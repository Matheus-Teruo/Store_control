package com.storecontrol.backend.services.statistics;

import com.storecontrol.backend.models.statistics.registers.response.ResponsePaymentTypeTotal;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRechargeChartNode;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRegisterChart;
import com.storecontrol.backend.models.statistics.stands.response.*;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import com.storecontrol.backend.services.statistics.validation.StatisticsValidation;
import com.storecontrol.backend.services.registers.RegisterService;
import com.storecontrol.backend.services.stands.StandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

  @Autowired
  private RechargeRepository rechargeRepository;

  @Autowired
  private PurchaseRepository purchaseRepository;

  @Autowired
  private RegisterService registerService;

  @Autowired
  private StandService standService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private StatisticsValidation validation;

  public List<ResponsePaymentTypeTotal> getPaymentTypeTotalCharts() {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerRegister(manager);

    List<Recharge> recharges = rechargeRepository.findAllValid();

    Map<PaymentType, BigDecimal> totalsByType = new EnumMap<>(PaymentType.class);
    for (Recharge recharge : recharges) {
      PaymentType type = recharge.getPaymentTypeEnum();
      BigDecimal currentTotal = totalsByType.getOrDefault(type, BigDecimal.ZERO);
      totalsByType.put(type, currentTotal.add(recharge.getRechargeValue()));
    }

    List<ResponsePaymentTypeTotal> result = new ArrayList<>();
    for (Map.Entry<PaymentType, BigDecimal> entry : totalsByType.entrySet()) {
      result.add(new ResponsePaymentTypeTotal(
          entry.getKey(),
          entry.getValue()
      ));
    }

    return result;
  }

  public List<ResponseRegisterChart> getRechargeCharts() {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerRegister(manager);
    List<Register> registers = registerService.listRegisters();
    List<Recharge> recharges = rechargeRepository.findAllValid();

    Map<UUID, Register> registerMap = registers.stream()
        .collect(Collectors.toMap(Register::getUuid, Function.identity()));

    Map<UUID, Map<LocalDateTime, Map<PaymentType, BigDecimal>>> groupedData = new HashMap<>();

    for (Recharge recharge : recharges) {
      UUID registerUuid = recharge.getRegisterUuid();
      if (registerUuid == null || recharge.getRechargeTimeStamp() == null) continue;

      LocalDateTime groupedTime = truncateTo5Minutes(recharge.getRechargeTimeStamp());
      PaymentType paymentType = recharge.getPaymentTypeEnum();
      BigDecimal value = getTotal(recharge);

      groupedData
          .computeIfAbsent(registerUuid, k -> new HashMap<>())
          .computeIfAbsent(groupedTime, k -> new HashMap<>())
          .merge(paymentType, value, BigDecimal::add);
    }

    List<ResponseRegisterChart> response = new ArrayList<>();

    for (var entry : groupedData.entrySet()) {
      UUID registerUuid = entry.getKey();
      Register register = registerMap.get(registerUuid);
      if (register == null) continue;

      List<ResponseRechargeChartNode> nodes = new ArrayList<>();

      for (var timeEntry : entry.getValue().entrySet()) {
        LocalDateTime time = timeEntry.getKey();
        for (var paymentEntry : timeEntry.getValue().entrySet()) {
          PaymentType paymentType = paymentEntry.getKey();
          BigDecimal total = paymentEntry.getValue();

          nodes.add(new ResponseRechargeChartNode(time, paymentType, total));
        }
      }

      response.add(new ResponseRegisterChart(registerUuid, register.getFunctionName(), nodes));
    }

    return response;
  }

  public List<ResponseStandTotal> getStandsCharts(UUID standUuid) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValidAndByStandUuid(standUuid);

    Map<UUID, Stand> standMap = stands.stream()
        .collect(Collectors.toMap(Stand::getUuid, Function.identity()));

    Map<UUID, ResponseStandTotal> totalsMap = new HashMap<>();

    for (Purchase purchase : purchases) {
      UUID currentStandUuid = purchase.getStandUuid();
      Stand stand = standMap.get(currentStandUuid);
      if (stand == null) continue; // Skip if stand is missing (defensive)

      int totalQuantity = 0;
      BigDecimal totalValue = BigDecimal.ZERO;

      for (Item item : purchase.getItems()) {
        if (!item.isValid()) continue;

        int quantity = item.getQuantity();
        BigDecimal price = item.getUnitPrice();
        BigDecimal discount = item.getDiscount();

        BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(quantity)).subtract(discount);

        totalQuantity += quantity;
        totalValue = totalValue.add(itemTotal);
      }

      totalsMap.merge(
          currentStandUuid,
          new ResponseStandTotal(
              currentStandUuid,
              stand.getFunctionName(), // ou stand.getFunctionName() se preferir
              totalQuantity,
              totalValue
          ),
          (oldVal, newVal) -> new ResponseStandTotal(
              oldVal.standUuid(),
              oldVal.standName(),
              oldVal.totalProductQuantity() + newVal.totalProductQuantity(),
              oldVal.totalAmount().add(newVal.totalAmount())
          )
      );
    }

    return new ArrayList<>(totalsMap.values());
  }

  public List<ResponseStandProductTotal> getProductsCharts(UUID standUuid) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValidAndByStandUuid(standUuid);
    List<Product> products = productRepository.findAllValidAndByStandUuid(standUuid);

    Map<UUID, Stand> standMap = stands.stream()
        .collect(Collectors.toMap(Stand::getUuid, Function.identity()));

    Map<UUID, Product> productMap = products.stream()
        .collect(Collectors.toMap(Product::getUuid, Function.identity()));

    Map<UUID, Map<UUID, ResponseProductTotal>> standProductTotals = new HashMap<>();

    for (Purchase purchase : purchases) {
      UUID currentStandUuid = purchase.getStandUuid();
      Stand stand = standMap.get(currentStandUuid);
      if (stand == null) continue;

      Map<UUID, ResponseProductTotal> productTotals =
          standProductTotals.computeIfAbsent(currentStandUuid, k -> new HashMap<>());

      for (Item item : purchase.getItems()) {
        if (!item.isValid()) continue;

        UUID productUuid = item.getProductUuid();
        Product product = productMap.get(productUuid);
        if (product == null) continue;

        int quantity = item.getQuantity();
        BigDecimal price = item.getUnitPrice();
        BigDecimal discount = item.getDiscount();

        BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(quantity)).subtract(discount);

        productTotals.merge(
            productUuid,
            new ResponseProductTotal(
                productUuid,
                product.getProductName(),
                quantity,
                itemTotal
            ),
            (oldVal, newVal) -> new ResponseProductTotal(
                oldVal.productUuid(),
                oldVal.productName(),
                oldVal.totalProductQuantity() + newVal.totalProductQuantity(),
                oldVal.totalAmount().add(newVal.totalAmount())
            )
        );
      }
    }

    List<ResponseStandProductTotal> response = new ArrayList<>();

    for (Map.Entry<UUID, Map<UUID, ResponseProductTotal>> standEntry : standProductTotals.entrySet()) {
      UUID currentStandUuid = standEntry.getKey();
      Stand stand = standMap.get(currentStandUuid);
      if (stand == null) continue;

      List<ResponseProductTotal> productCharts = new ArrayList<>(standEntry.getValue().values());
      response.add(new ResponseStandProductTotal(currentStandUuid, stand.getFunctionName(), productCharts));
    }

    return response;
  }

  public List<ResponseStandChart> getPurchaseCharts(UUID standUuid) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValidAndByStandUuid(standUuid);
    List<Product> products = productRepository.findAllValidAndByStandUuid(standUuid);

    Map<UUID, Stand> standMap = stands.stream()
        .collect(Collectors.toMap(Stand::getUuid, Function.identity()));

    Map<UUID, Product> productMap = products.stream()
        .collect(Collectors.toMap(Product::getUuid, Function.identity()));

    Map<UUID, Map<UUID, Map<LocalDateTime, int[]>>> groupedData = new HashMap<>();
    Map<UUID, Map<UUID, Map<LocalDateTime, BigDecimal>>> totalData = new HashMap<>();

    for (Purchase purchase : purchases) {
      UUID pStandUuid = purchase.getStandUuid();
      if (pStandUuid == null || purchase.getPurchaseTimeStamp() == null) continue;

      LocalDateTime groupedTime = truncateTo5Minutes(purchase.getPurchaseTimeStamp());

      for (Item item : purchase.getItems()) {
        if (item == null || item.getItemId() == null || !item.isValid()) continue;

        UUID productUuid = item.getProductUuid();
        if (productUuid == null) continue;

        // Quantidade
        groupedData
            .computeIfAbsent(pStandUuid, k -> new HashMap<>())
            .computeIfAbsent(productUuid, k -> new HashMap<>())
            .computeIfAbsent(groupedTime, k -> new int[1])[0] += item.getQuantity();

        // Total
        BigDecimal itemTotal = item.getUnitPrice()
            .subtract(item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO)
            .multiply(BigDecimal.valueOf(item.getQuantity()));

        totalData
            .computeIfAbsent(pStandUuid, k -> new HashMap<>())
            .computeIfAbsent(productUuid, k -> new HashMap<>())
            .merge(groupedTime, itemTotal, BigDecimal::add);
      }
    }

    List<ResponseStandChart> response = new ArrayList<>();

    for (var standEntry : groupedData.entrySet()) {
      UUID pStandUuid = standEntry.getKey();
      Stand stand = standMap.get(pStandUuid);
      if (stand == null) continue;

      List<ResponseProductChart> productCharts = new ArrayList<>();

      for (var productEntry : standEntry.getValue().entrySet()) {
        UUID productUuid = productEntry.getKey();
        Product product = productMap.get(productUuid);
        if (product == null) continue;

        List<ResponsePurchaseChartNode> nodes = new ArrayList<>();

        for (var timeEntry : productEntry.getValue().entrySet()) {
          LocalDateTime time = timeEntry.getKey();
          int quantity = timeEntry.getValue()[0];
          BigDecimal total = totalData.getOrDefault(pStandUuid, Map.of())
              .getOrDefault(productUuid, Map.of())
              .getOrDefault(time, BigDecimal.ZERO);

          nodes.add(new ResponsePurchaseChartNode(
              time,
              quantity,
              total
          ));
        }

        productCharts.add(new ResponseProductChart(
            productUuid,
            product.getProductName(),
            nodes
        ));
      }

      response.add(new ResponseStandChart(
          pStandUuid,
          stand.getFunctionName(),
          productCharts
      ));
    }

    return response;
  }


  private LocalDateTime truncateTo5Minutes(LocalDateTime timestamp) {
    int minute = timestamp.getMinute();
    int minutesGroup = (minute / 5) * 5;
    return timestamp.withMinute(minutesGroup).withSecond(0).withNano(0);
  }

  private BigDecimal getTotal(Recharge recharge) {
    return recharge.getRechargeValue();
  }
}
