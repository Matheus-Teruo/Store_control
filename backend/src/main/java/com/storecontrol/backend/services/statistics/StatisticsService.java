package com.storecontrol.backend.services.statistics;

import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.statistics.registers.RegisterGroup;
import com.storecontrol.backend.models.statistics.registers.response.ResponsePaymentTypeTotal;
import com.storecontrol.backend.models.statistics.registers.response.ResponseRegisterChart;
import com.storecontrol.backend.models.statistics.stands.ProductGroup;
import com.storecontrol.backend.models.statistics.stands.StandGroup;
import com.storecontrol.backend.models.statistics.stands.response.*;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import com.storecontrol.backend.repositories.operations.RechargeRepository;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import com.storecontrol.backend.services.registers.RegisterService;
import com.storecontrol.backend.services.stands.StandService;
import com.storecontrol.backend.services.statistics.validation.StatisticsValidation;
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

  public List<ResponsePaymentTypeTotal> getPaymentTypeTotals(LocalDateTime startTime, LocalDateTime endTime) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerRegister(manager);

    List<Recharge> recharges = rechargeRepository.findAllValid(startTime, endTime);

    Map<PaymentType, BigDecimal> totalsByType = new TreeMap<>(Comparator.comparing(Enum::name));
    for (Recharge recharge : recharges) {
      PaymentType type = recharge.getPaymentTypeEnum();
      BigDecimal currentTotal = totalsByType.getOrDefault(type, BigDecimal.ZERO);
      totalsByType.put(type, currentTotal.add(recharge.getRechargeValue()));
    }

    List<ResponsePaymentTypeTotal> result = new ArrayList<>();
    for (Map.Entry<PaymentType, BigDecimal> entry : totalsByType.entrySet()) {
      result.add(new ResponsePaymentTypeTotal(entry.getKey(), entry.getValue()));
    }

    return result;
  }

  public List<ResponseRegisterChart> getRechargeCharts(LocalDateTime startTime, LocalDateTime endTime) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerRegister(manager);

    List<Register> registers = registerService.listRegisters();
    List<Recharge> recharges = rechargeRepository.findAllValid(startTime, endTime);

    Map<UUID, Register> registerMap = registers.stream()
        .collect(Collectors.toMap(Register::getUuid, Function.identity()));

    Map<UUID, RegisterGroup> groupedRegisters = new HashMap<>();

    for (Recharge recharge : recharges) {
      UUID registerUuid = recharge.getRegisterUuid();
      LocalDateTime timestamp = truncateTo15Minutes(recharge.getRechargeTimeStamp());

      if (registerUuid == null) continue;

      Register register = registerMap.get(registerUuid);
      if (register == null) continue;

      groupedRegisters
          .computeIfAbsent(registerUuid, uuid ->
              new RegisterGroup(register.getUuid(), register.getFunctionName()))
          .addRecharge(timestamp, recharge.getPaymentTypeEnum(), getTotal(recharge));
    }

    return groupedRegisters.values().stream()
        .sorted(Comparator.comparing(RegisterGroup::getRegisterName, String.CASE_INSENSITIVE_ORDER))
        .map(RegisterGroup::toRegisterChart)
        .toList();
  }

  public List<ResponseStandTotal> getStandTotals(
      UUID standUuid,
      LocalDateTime startTime,
      LocalDateTime endTime
  ) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValidAndByStandUuid(standUuid, startTime, endTime);

    Map<UUID, Stand> standMap = stands.stream()
        .collect(Collectors.toMap(Stand::getUuid, Function.identity()));

    Map<UUID, StandGroup> standGroups = new HashMap<>();

    for (Purchase purchase : purchases) {
      UUID currentStandUuid = purchase.getStandUuid();
      Stand stand = standMap.get(currentStandUuid);
      if (stand == null) continue;

      StandGroup standGroup = standGroups.computeIfAbsent(currentStandUuid,
          id -> new StandGroup(currentStandUuid, stand.getFunctionName()));

      for (Item item : purchase.getItems()) {
        UUID productUuid = item.getProductUuid();
        if (productUuid == null || !item.isValid()) continue;

        standGroup.addItemWithoutProduct(item);
      }
    }

    return standGroups.values().stream()
        .sorted(Comparator.comparing(StandGroup::getStandName, String.CASE_INSENSITIVE_ORDER))
        .map(StandGroup::toStandTotal)
        .toList();
  }

  public List<ResponseStandProductTotal> getProductTotals(
      UUID standUuid,
      LocalDateTime startTime,
      LocalDateTime endTime
  ) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValidAndByStandUuid(standUuid, startTime, endTime);
    List<Product> products = productRepository.findAllValidAndByStandUuid(standUuid);

    Map<UUID, Stand> standMap = stands.stream()
        .collect(Collectors.toMap(Stand::getUuid, Function.identity()));

    Map<UUID, Product> productMap = products.stream()
        .collect(Collectors.toMap(Product::getUuid, Function.identity()));

    Map<UUID, StandGroup> standGroups = new HashMap<>();

    for (Purchase purchase : purchases) {
      UUID currentStandUuid = purchase.getStandUuid();
      Stand stand = standMap.get(currentStandUuid);
      if (stand == null) continue;

      StandGroup standGroup = standGroups.computeIfAbsent(
          currentStandUuid,
          id -> new StandGroup(currentStandUuid, stand.getFunctionName())
      );

      for (Item item : purchase.getItems()) {
        UUID productUuid = item.getProductUuid();
        Product product = productMap.get(productUuid);
        if (product == null || !item.isValid()) continue;

        standGroup.addItem(item, product, null);
      }
    }

    return standGroups.values().stream()
        .sorted(Comparator.comparing(StandGroup::getStandName, String.CASE_INSENSITIVE_ORDER))
        .map(group -> new ResponseStandProductTotal(
            group.getStandUuid(),
            group.getStandName(),
            group.getProductGroups().values().stream()
                .sorted(Comparator.comparing(ProductGroup::getProductName, String.CASE_INSENSITIVE_ORDER))
                .map(ProductGroup::toProductTotal)
                .toList()
        ))
        .toList();
  }

  public List<ResponseStandChart> getPurchaseCharts(
      UUID standUuid,
      LocalDateTime startTime,
      LocalDateTime endTime
  ) {
    Voluntary manager = (Voluntary) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    validation.checkManagerStand(manager, standUuid);

    List<Stand> stands = standService.listStands();
    List<Purchase> purchases = purchaseRepository.findAllValidAndByStandUuid(standUuid, startTime, endTime);
    List<Product> products = productRepository.findAllValidAndByStandUuid(standUuid);

    Map<UUID, Stand> standMap = stands.stream()
        .collect(Collectors.toMap(Stand::getUuid, Function.identity()));

    Map<UUID, Product> productMap = products.stream()
        .collect(Collectors.toMap(Product::getUuid, Function.identity()));

    Map<UUID, StandGroup> standGroups = new HashMap<>();

    for (Purchase purchase : purchases) {
      UUID currentStandUuid = purchase.getStandUuid();
      if (currentStandUuid == null || purchase.getPurchaseTimeStamp() == null) continue;

      Stand stand = standMap.get(currentStandUuid);
      if (stand == null) continue;

      StandGroup standGroup = standGroups.computeIfAbsent(currentStandUuid,
          id -> new StandGroup(currentStandUuid, stand.getFunctionName()));

      for (Item item : purchase.getItems()) {
        if (!item.isValid() || item.getProductUuid() == null) continue;

        Product product = productMap.get(item.getProductUuid());
        if (product == null) continue;

        LocalDateTime timestamp = truncateTo15Minutes(purchase.getPurchaseTimeStamp());
        standGroup.addItem(item, product, timestamp);
      }
    }

    return standGroups.values().stream()
        .sorted(Comparator.comparing(StandGroup::getStandName, String.CASE_INSENSITIVE_ORDER))
        .map(StandGroup::toStandChart)
        .toList();
  }


  private LocalDateTime truncateTo15Minutes(LocalDateTime timestamp) {
    int minute = timestamp.getMinute();
    int minutesGroup = (minute / 15) * 15;
    return timestamp.withMinute(minutesGroup).withSecond(0).withNano(0);
  }

  private BigDecimal getTotal(Recharge recharge) {
    return recharge.getRechargeValue();
  }
}
