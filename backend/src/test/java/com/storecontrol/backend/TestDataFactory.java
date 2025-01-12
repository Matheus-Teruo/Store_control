package com.storecontrol.backend;

import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.customers.OrderCard;
import com.storecontrol.backend.models.customers.request.RequestCustomerFinalization;
import com.storecontrol.backend.models.customers.request.RequestOrderCard;
import com.storecontrol.backend.models.enumerate.PaymentType;
import com.storecontrol.backend.models.enumerate.TransactionType;
import com.storecontrol.backend.models.enumerate.VoluntaryRole;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.ItemId;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdatePurchase;
import com.storecontrol.backend.models.operations.request.RequestCreateRecharge;
import com.storecontrol.backend.models.operations.request.RequestCreateTransaction;
import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.*;
import com.storecontrol.backend.models.volunteers.User;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.models.volunteers.request.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

public class TestDataFactory {

  public static Customer createCustomerEntity(UUID uuid, OrderCard orderCard, boolean inUse) {
    return new Customer(
        uuid,
        orderCard,
        LocalDateTime.now(),
        null,
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>(),
        inUse
    );
  }

  public static RequestCustomerFinalization createRequestCustomerFinalization(Customer customer) {
    return new RequestCustomerFinalization(
        BigDecimal.TWO,
        BigDecimal.ONE,
        customer.getOrderCard().getId(),
        UUID.randomUUID()
    );
  }

  public static OrderCard createOrderCardEntity(String cardId, boolean active) {
    return new OrderCard(
        cardId,
        BigDecimal.ZERO,
        null,
        active
    );
  }

  public static RequestOrderCard createRequestOrderCard(String cardId) {
    return new RequestOrderCard(
        cardId
    );
  }

  public static Donation createDonationEntity(UUID uuid, Customer customer) {
    UUID voluntaryUUID = UUID.randomUUID();
    return new Donation(
        uuid,
        BigDecimal.TWO,
        LocalDateTime.now(),
        customer,
        createCashRegisterEntity(UUID.randomUUID()),
        voluntaryUUID,
        createVoluntaryEntity(voluntaryUUID),
        true
    );
  }

  public static Purchase createPurchaseEntity(UUID uuid, Customer customer) {
    UUID voluntaryUUID = UUID.randomUUID();
    return new Purchase(
        uuid,
        false,
        LocalDateTime.now(),
        null,
        customer,
        voluntaryUUID,
        createVoluntaryEntity(voluntaryUUID),
        true
    );
  }

  public static List<Item> createItemEntity(Purchase purchase) {
    return List.of(
        new Item(new ItemId(createProductEntity(UUID.randomUUID()), purchase),
            2, 0, BigDecimal.TWO, BigDecimal.ZERO, true),
        new Item(new ItemId(createProductEntity(UUID.randomUUID()), purchase),
            2, 0, BigDecimal.TWO, BigDecimal.ZERO, true));
  }

  public static RequestCreatePurchase createRequestCreatePurchase(Purchase purchase) {
    List<RequestCreateItem> requestCreateItems = List.of(
        new RequestCreateItem(
            purchase.getItems().get(0).getItemId().getProduct().getUuid(),
            purchase.getItems().get(0).getQuantity(),
            purchase.getItems().get(0).getDelivered(),
            purchase.getItems().get(0).getUnitPrice(),
            purchase.getItems().get(0).getDiscount()
        ),
        new RequestCreateItem(
            purchase.getItems().get(1).getItemId().getProduct().getUuid(),
            purchase.getItems().get(1).getQuantity(),
            purchase.getItems().get(1).getDelivered(),
            purchase.getItems().get(1).getUnitPrice(),
            purchase.getItems().get(1).getDiscount()
        )
    );
    return new RequestCreatePurchase(
        purchase.isOnOrder(),
        requestCreateItems,
        purchase.getCustomer().getOrderCard().getId()
    );
  }

  public static RequestUpdatePurchase createRequestUpdatePurchase(UUID uuid, Purchase purchase) {
    List<RequestUpdateItem> requestUpdateItems = List.of(
        new RequestUpdateItem(
            purchase.getItems().get(0).getItemId().getProduct().getUuid(),
            purchase.getItems().get(0).getDelivered()
            ),
        new RequestUpdateItem(
            purchase.getItems().get(1).getItemId().getProduct().getUuid(),
            purchase.getItems().get(1).getDelivered()
            )
    );
    return new RequestUpdatePurchase(
        uuid,
        true,
        requestUpdateItems
    );
  }

  public static Recharge createRechargeEntity(UUID uuid, Customer customer, boolean isCash) {
    PaymentType[] paymentTypes = PaymentType.values();
    int randomIndex = new Random().nextInt(paymentTypes.length);
    UUID voluntaryUUID = UUID.randomUUID();
    return new Recharge(
        uuid,
        BigDecimal.TEN,
        isCash ? PaymentType.CASH : paymentTypes[randomIndex],
        LocalDateTime.now(),
        customer,
        createCashRegisterEntity(UUID.randomUUID()),
        voluntaryUUID,
        createVoluntaryEntity(voluntaryUUID),
        true
    );
  }

  public static RequestCreateRecharge createRequestCreateRecharge(Recharge recharge) {
    return new RequestCreateRecharge(
        recharge.getRechargeValue(),
        recharge.getPaymentTypeEnum().toString().toLowerCase(),
        recharge.getCustomer().getOrderCard().getId(),
        recharge.getCashRegister().getUuid()
    );
  }

  public static Refund createRefundEntity(UUID uuid, Customer customer) {
    UUID voluntaryUUID = UUID.randomUUID();
    return new Refund(
        uuid,
        BigDecimal.TWO,
        LocalDateTime.now(),
        customer,
        createCashRegisterEntity(UUID.randomUUID()),
        voluntaryUUID,
        createVoluntaryEntity(voluntaryUUID),
        true
    );
  }

  public static Transaction createTransactionEntity(UUID uuid, boolean isEntry) {
    UUID voluntaryUUID = UUID.randomUUID();
    return new Transaction(
        uuid,
        BigDecimal.valueOf(50),
        isEntry ? TransactionType.ENTRY : TransactionType.EXIT,
        LocalDateTime.now(),
        createCashRegisterEntity(UUID.randomUUID()),
        voluntaryUUID,
        createVoluntaryEntity(voluntaryUUID),
        true
    );
  }

  public static RequestCreateTransaction createRequestCreateTransaction(Transaction transaction) {
    return new RequestCreateTransaction(
        transaction.getAmount(),
        transaction.getTransactionTypeEnum().toString().toLowerCase(),
        transaction.getCashRegister().getUuid()
    );
  }

  public static CashRegister createCashRegisterEntity(UUID uuid) {
    return new CashRegister(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        null,
        true
    );
  }

  public static RequestCreateCashRegister createRequestCreateCashRegister(CashRegister cashRegister) {
    return new RequestCreateCashRegister(
        cashRegister.getFunctionName()
    );
  }

  public static RequestUpdateCashRegister createRequestUpdateCashRegister(UUID uuid) {
    return new RequestUpdateCashRegister(
        uuid,
        nameOnlyLettersSpaceAndNumbers()
    );
  }

  public static Association createAssociationEntity(UUID uuid) {
    return new Association(
        uuid,
        nameOnlyLetters(),
        nameOnlyLettersAndSpace(),
        new ArrayList<>(),
        true
    );
  }

  public static RequestCreateAssociation createRequestCreateAssociation(Association association) {
    return new RequestCreateAssociation(
        association.getAssociationName(),
        association.getPrincipalName()
    );
  }

  public static RequestUpdateAssociation createRequestUpdateAssociation(UUID uuid) {
    return new RequestUpdateAssociation(
        uuid,
        nameOnlyLetters(),
        nameOnlyLettersAndSpace()
    );
  }

  public static Product createProductEntity(UUID uuid) {
    Stand stand = createStandEntity(UUID.randomUUID());
    return new Product(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        nameOnlyLettersSpaceAndNumbers(),
        textOnlyLettersSpaceAndNumbers(),
        BigDecimal.TEN,
        BigDecimal.ZERO,
        1000,
        null,
        stand.getUuid(),
        stand,
        null,
        true
    );
  }

  public static RequestCreateProduct createRequestCreateProduct(Product product) {
    return new RequestCreateProduct(
        product.getProductName(),
        product.getSummary(),
        product.getDescription(),
        product.getPrice(),
        product.getStock(),
        product.getProductImg(),
        product.getStandUuid()
    );
  }

  public static RequestUpdateProduct createRequestUpdateProduct(UUID uuid, UUID standUuid) {
    return new RequestUpdateProduct(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        nameOnlyLettersSpaceAndNumbers(),
        textOnlyLettersSpaceAndNumbers(),
        BigDecimal.TEN,
        BigDecimal.TWO,
        1000,
        null,
        standUuid
    );
  }

  public static Stand createStandEntity(UUID uuid) {
    return new Stand(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        null,
        true,
        createAssociationEntity(UUID.randomUUID()),
        new ArrayList<>()
    );
  }

  public static RequestCreateStand createRequestCreateStand(Stand stand) {
    return new RequestCreateStand(
        stand.getFunctionName(),
        stand.getAssociation().getUuid()
    );
  }

  public static RequestUpdateStand createRequestUpdateStand(UUID uuid, UUID associationUuid) {
    return new RequestUpdateStand(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        associationUuid
    );
  }

  public static Voluntary createVoluntaryEntity(UUID uuid) {
    return new Voluntary(
        uuid,
        new User(nameOnlyLettersAndNumbers(), nameOnlyLettersAndNumbers()),
        nameOnlyLettersAndSpace(),
        null,
        null,
        null,
        null,
        null,
        VoluntaryRole.ROLE_USER,
        true
    );
  }

  public static RequestSignupVoluntary createRequestSignupVoluntary(Voluntary voluntary) {
    return new RequestSignupVoluntary(
        voluntary.getUser().getUsername(),
        voluntary.getUser().getPassword(),
        voluntary.getFullname()
    );
  }

  public static RequestLoginVoluntary createRequestLoginVoluntary(Voluntary voluntary) {
    return new RequestLoginVoluntary(
        voluntary.getUser().getUsername(),
        voluntary.getUser().getPassword()
    );
  }

  public static RequestUpdateVoluntary createRequestUpdateVoluntary(UUID uuid) {
    return new RequestUpdateVoluntary(
        uuid,
        nameOnlyLettersAndNumbers(),
        nameOnlyLettersAndNumbers(),
        nameOnlyLettersAndSpace()
    );
  }

  public static RequestUpdateVoluntaryFunction createRequestUpdateVoluntaryFunction(UUID uuid, UUID functionUuid) {
    return new RequestUpdateVoluntaryFunction(
        uuid,
        functionUuid
    );
  }

  public static RequestRoleVoluntary createRequestUpdateVoluntaryRole(UUID uuid, String voluntaryRole) {
    return new RequestRoleVoluntary(
        uuid,
        voluntaryRole
    );
  }

  private static int generateRandomLength(int min, int max) {
    return random.nextInt(max - min + 1) + min;
  }

  private static String nameOnlyLetters() {
    String character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    int length = generateRandomLength(4, 13);
    return generateRandomName(length, character);
  }

  private static String nameOnlyLettersAndSpace() {
    String character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    int length = generateRandomLength(6, 30);
    return generateRandomName(length, character);
  }

  private static String textOnlyLettersSpaceAndNumbers() {
    String character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
    int length = generateRandomLength(35, 100);
    return generateRandomName(length, character);
  }

  private static String nameOnlyLettersSpaceAndNumbers() {
    String character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
    int length = generateRandomLength(6, 25);
    return generateRandomName(length, character);
  }

  private static String nameOnlyLettersAndNumbers() {
    String character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    int length = generateRandomLength(6, 25);
    return generateRandomName(length, character);
  }

  private static final Random random = new Random();

  private static String generateRandomName(int length, String characterAllowed) {
    StringBuilder name = new StringBuilder();

    for (int i = 0; i < length; i++) {
      int index = random.nextInt(characterAllowed.length());
      name.append(characterAllowed.charAt(index));
    }
    return name.toString();
  }
}
