package com.storecontrol.backend.services.charts;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchaseChartNode;
import com.storecontrol.backend.models.operations.response.ResponseRechargeChartNode;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegisterChart;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.response.ResponseProductChart;
import com.storecontrol.backend.models.stands.response.ResponseStandChart;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import com.storecontrol.backend.services.charts.validation.ChartValidation;
import com.storecontrol.backend.services.registers.CashRegisterService;
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
public class ChartService {

  @Autowired
  private RechargeRepository rechargeRepository;

  @Autowired
  private PurchaseRepository purchaseRepository;

  @Autowired
  private CashRegisterService cashRegisterService;

  @Autowired
  private StandService standService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ChartValidation validation;

  public List<ResponseCashRegisterChart> getRechargeCharts() {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerRegister(manager);
    List<CashRegister> cashRegisters = cashRegisterService.listCashRegisters();
    List<Recharge> recharges = rechargeRepository.findAllValid();

    Map<UUID, CashRegister> cashRegisterMap = cashRegisters.stream()
        .collect(Collectors.toMap(CashRegister::getUuid, Function.identity()));

    Map<UUID, Map<LocalDateTime, Map<PaymentType, BigDecimal>>> groupedData = new HashMap<>();

    for (Recharge recharge : recharges) {
      UUID cashRegisterUuid = recharge.getCashRegisterUuid();
      if (cashRegisterUuid == null || recharge.getRechargeTimeStamp() == null) continue;

      LocalDateTime groupedTime = truncateTo5Minutes(recharge.getRechargeTimeStamp());
      PaymentType paymentType = recharge.getPaymentTypeEnum();
      BigDecimal value = getTotal(recharge);

      groupedData
          .computeIfAbsent(cashRegisterUuid, k -> new HashMap<>())
          .computeIfAbsent(groupedTime, k -> new HashMap<>())
          .merge(paymentType, value, BigDecimal::add);
    }

    List<ResponseCashRegisterChart> response = new ArrayList<>();

    for (var entry : groupedData.entrySet()) {
      UUID registerUuid = entry.getKey();
      CashRegister register = cashRegisterMap.get(registerUuid);
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

      response.add(new ResponseCashRegisterChart(registerUuid, register.getFunctionName(), nodes));
    }

    return response;
  }

  public List<ResponseStandChart> getPurchaseCharts(UUID standUuid) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValid();
    List<Product> products = productRepository.findAllValidTrueOrByStandUuid(standUuid);

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
            .multiply(BigDecimal.valueOf(item.getQuantity()))
            .subtract(item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO);

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



  // Auxiliares
  private LocalDateTime truncateTo5Minutes(LocalDateTime timestamp) {
    int minute = timestamp.getMinute();
    int minutesGroup = (minute / 5) * 5;
    return timestamp.withMinute(minutesGroup).withSecond(0).withNano(0);
  }

  private BigDecimal getTotal(Recharge recharge) {
    return recharge.getRechargeValue();
  }
}
