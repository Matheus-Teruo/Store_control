package com.storecontrol.backend.services.volunteers.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntaryFunction;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import com.storecontrol.backend.repositories.volunteers.FunctionRepository;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class VoluntaryValidation {

  @Autowired
  VoluntaryRepository repository;

  @Autowired
  FunctionRepository functionRepository;

  @Autowired
  AssociationRepository associationRepository;

  public void checkVoluntaryAuthentication(UUID requestUuid, UUID loggedUuid){
    if (!requestUuid.equals(loggedUuid)) {
      var user = repository.findByUuidValidTrue(loggedUuid).orElseThrow(() -> new InvalidDatabaseQueryException(
          MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.error"),
          MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.message"),
          loggedUuid.toString()));
      if (user.getVoluntaryRole().isNotAdmin()) {
        throw new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("validation.voluntary.checkAuthentication.voluntaryMatch.error"),
            MessageResolver.getInstance().getMessage("validation.voluntary.checkAuthentication.voluntaryMatch.message"),
            requestUuid.toString()
        );
      }
    }
  }

  public void checkNameDuplication(String username, String fullname) {
    if (username != null && repository.existsByUserUsername(username)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkUsername.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkUsername.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkUsername.nameDuplication.field"),
              username
          )
      );
    }
    if (fullname != null && repository.existsByFullname(fullname)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.nameDuplication.field"),
              fullname
          )
      );
    }
  }

  public void checkRootFullname(UUID uuid, String fullname) {
    if (fullname != null && repository.existsByUuidAndFullname(uuid, "Root User")) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.RootCantChange.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.RootCantChange.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkFullname.RootCantChange.field"),
              fullname
          )
      );
    }
  }

  public void checkAssociationKey(String key) {
    if (key != null && !associationRepository.existsByAssociationKey(key)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkAssociationKey.invalidKey.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkAssociationKey.invalidKey.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkAssociationKey.invalidKey.field"),
              key
          )
      );
    }
  }

  public void checkManagerBelongsSelectedStand(RequestUpdateVoluntaryFunction request, UUID managerUuid) {
    var manager = repository.findByUuidValidTrue(managerUuid).orElseThrow(() -> new InvalidDatabaseQueryException(
        MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.error"),
        MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.message"),
        managerUuid.toString()));
    var voluntary = repository.findByUuidValidTrue(request.uuid()).orElseThrow(() -> new InvalidDatabaseQueryException(
        MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.error"),
        MessageResolver.getInstance().getMessage("service.exception.voluntary.get.validation.message"),
        request.uuid().toString()));
    if (manager.getVoluntaryRole().isNotAdmin()){
      if (request.functionUuid() != null && !manager.getFunction().getUuid().equals(request.functionUuid())) {
        // Stand validation
        if (manager.getFunction() instanceof Stand) {
          throw new InvalidDatabaseInsertionException(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidStand.error"),
              MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidStand.message"),
              Map.of(
                  MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidStand.field"),
                  request.functionUuid().toString()
              )
          );
        }
        // CashRegister validation
        else {
          var function = functionRepository.findByUuidValidTrue(request.functionUuid())
            .orElseThrow(() -> new InvalidDatabaseQueryException(
                MessageResolver.getInstance().getMessage("service.exception.function.get.validation.error"),
                MessageResolver.getInstance().getMessage("service.exception.function.get.validation.message"),
                request.functionUuid().toString())
            );
          if (function instanceof Stand) {
            throw new InvalidDatabaseInsertionException(
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidCashRegister.error"),
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidCashRegister.message"),
                Map.of(
                    MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidCashRegister.field"),
                    request.functionUuid().toString()
                )
            );
          }
        }
      }
      else if (request.functionUuid() == null && !voluntary.getFunction().getUuid().equals(managerUuid)) {
        // Stand validation
        if (voluntary.getFunction() instanceof Stand) {
          throw new InvalidDatabaseInsertionException(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidStand.error"),
              MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidStand.message"),
              Map.of(
                  MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidStand.field"),
                  "null"
              )
          );
        }
        // CashRegister validation
        else {
          if (manager.getFunction() instanceof Stand) {
            throw new InvalidDatabaseInsertionException(
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidCashRegister.error"),
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidCashRegister.message"),
                Map.of(
                    MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidCashRegister.field"),
                    "null"
                )
            );
          }
        }
      }
    }
  }
}
