package com.storecontrol.backend.services.integration;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.storecontrol.backend.models.integration.response.ExternalOrderDTO;
import com.storecontrol.backend.models.integration.response.ExternalOrderDTO.ItemDTO;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.repositories.integration.ProcessedOrderRepository;
import com.storecontrol.backend.repositories.resgisters.RegisterRepository;
import com.storecontrol.backend.repositories.stands.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

import com.storecontrol.backend.config.initializer.DataInitializerProperties;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.integration.ProcessedOrder;
import com.storecontrol.backend.models.integration.SyncFeatureToggle;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderManagerService {

    private final OrdersTradeService ordersTradeService;
    private final ProcessedOrderRepository processedOrderRepository;
    private final ProductRepository productRepository;
    private final RegisterRepository registerRepository;
    private final DataInitializerProperties props;

    public void createBatchOrder(List<String> orderCodes, SyncFeatureToggle syncFeatureToggle) {

        for (String orderCode : orderCodes) {
            ProcessedOrder processedOrder = processedOrderRepository.findByExternalSaleId(orderCode)
                .orElse(new ProcessedOrder(orderCode, "charge"));
            
            if(!processedOrder.getDone()) {
                createOrderWithCode(orderCode, syncFeatureToggle);
                processedOrder.setDone(true);
            }

            processedOrderRepository.save(processedOrder);
        }
    };

    public void createOrderWithHook(ExternalOrderDTO request, SyncFeatureToggle syncFeatureToggle) {
        ProcessedOrder processedOrder = processedOrderRepository.findByExternalSaleId(request.id())
            .orElse(new ProcessedOrder(request.id(), "charge"));
        
        List<Product> products = productRepository.findAllValid();

        if (!products.isEmpty()) {
            Map<UUID, List<ItemDTO>> itemsByStand = request.items().stream()
                .filter(item -> item.externalProductId() != null)
                .flatMap(item -> products.stream()
                    .filter(product -> product.getProductCode().equals(item.externalProductId()))
                    .map(product -> Map.entry(product.getStandUuid(), item))
                )
                .collect(Collectors.groupingBy(
                    Map.Entry::getKey,
                    Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));

            if(!processedOrder.getDone()) {
                itemsByStand.forEach((standUuid, listItems) -> {
                    ordersTradeService.createTradeFromExternal(
                        listItems,
                        registerRepository.findById(standUuid).orElseThrow(EntityNotFoundException::new),
                        standUuid,
                        PaymentType.fromExternalString(request.charges().getFirst().paymentMethod().type()),
                        props.cardId()
                    );
                });
                
                processedOrder.setDone(true);
            }
        }        

        processedOrderRepository.save(processedOrder);
    };

    public void createOrderWithCode(String orderCode, SyncFeatureToggle syncFeatureToggle) {
        // getOrder
        ExternalOrderDTO orderDTO = new ExternalOrderDTO(orderCode, orderCode, OffsetDateTime.now(),null, null, null);

        List<Product> products = productRepository.findAllValid();

        Map<UUID, List<ItemDTO>> itemsByStand = orderDTO.items().stream()
                .filter(item -> item.externalProductId() != null)
                .flatMap(item -> products.stream()
                    .filter(product -> product.getProductCode().equals(item.externalProductId()))
                    .map(product -> Map.entry(product.getStandUuid(), item))
                )
                .collect(Collectors.groupingBy(
                    Map.Entry::getKey,
                    Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));

        itemsByStand.forEach((standUuid, listItems) -> {
            ordersTradeService.createTradeFromExternal(
                listItems,
                registerRepository.findById(standUuid).orElseThrow(EntityNotFoundException::new),
                standUuid,
                PaymentType.fromExternalString(orderDTO.charges().getFirst().paymentMethod().type()),
                props.cardId()
            );
        });

    }


}
