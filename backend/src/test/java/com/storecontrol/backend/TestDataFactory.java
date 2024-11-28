package com.storecontrol.backend;

import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.request.*;

import java.math.BigDecimal;
import java.util.Random;
import java.util.UUID;

public class TestDataFactory {

  public static Association createAssociationEntity(UUID uuid) {
    return new Association(
        uuid,
        nameOnlyLetters(),
        nameOnlyLettersAndSpace(),
        null,
        true
    );
  }

  public static RequestCreateAssociation createRequestCreateAssociation() {
    return new RequestCreateAssociation(
        nameOnlyLetters(),
        nameOnlyLettersAndSpace()
    );
  }

  public static RequestUpdateAssociation createRequestUpdateAssociation(UUID uuid) {
    return new RequestUpdateAssociation(
        uuid,
        nameOnlyLetters(),
        nameOnlyLettersAndSpace()
    );
  }

  public static Product createProductEntity(UUID uuid, Stand stand) {
    return new Product(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
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

  public static RequestCreateProduct createRequestCreateProduct(UUID standUuid) {
    return new RequestCreateProduct(
        nameOnlyLettersSpaceAndNumbers(),
        BigDecimal.TEN,
        1000,
        null,
        standUuid
    );
  }

  public static RequestUpdateProduct createRequestUpdateProduct(UUID uuid, UUID standUuid) {
    return new RequestUpdateProduct(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        BigDecimal.TEN,
        BigDecimal.TWO,
        1000,
        null,
        standUuid
    );
  }

  public static Stand createStandEntity(UUID uuid, Association association) {
    return new Stand(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        null,
        true,
        association,
        null
    );
  }

  public static RequestCreateStand createRequestCreateStand(UUID associationUuid) {
    return new RequestCreateStand(
        nameOnlyLettersSpaceAndNumbers(),
        associationUuid
    );
  }

  public static RequestUpdateStand createRequestUpdateStand(UUID uuid, UUID associationUuid) {
    return new RequestUpdateStand(
        uuid,
        nameOnlyLettersSpaceAndNumbers(),
        associationUuid
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

  private static String nameOnlyLettersSpaceAndNumbers() {
    String character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
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
