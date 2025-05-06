package com.storecontrol.backend.services.volunteers.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.enumerate.VoluntaryRole;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Voluntary;
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
  private VoluntaryRepository repository;

  @Autowired
  private FunctionRepository functionRepository;

  @Autowired
  private AssociationRepository associationRepository;

  public void checkVoluntaryPermission(UUID requestUuid, Voluntary user){
    if (!requestUuid.equals(user.getUuid())) {
      var role = user.getVoluntaryRole();
      if (role.equals(VoluntaryRole.ROLE_USER)) {
        throw new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("validation.voluntary.checkAuthentication.voluntaryMatch.error"),
            MessageResolver.getInstance().getMessage("validation.voluntary.checkAuthentication.voluntaryMatch.message"),
            requestUuid.toString()
        );
      }
    }
  }

  public void checkVoluntaryAuthentication(UUID requestUuid, Voluntary user){
    if (!requestUuid.equals(user.getUuid())) {
      var role = user.getVoluntaryRole();
      if (!role.equals(VoluntaryRole.ROLE_ADMIN)) {
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

  public void checkManagerBelongsSelectedStand(RequestUpdateVoluntaryFunction request, Voluntary manager) {
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
        // Register validation
        else {
          var function = functionRepository.findByUuidValidTrue(request.functionUuid())
            .orElseThrow(() -> new InvalidDatabaseQueryException(
                MessageResolver.getInstance().getMessage("service.exception.function.get.validation.error"),
                MessageResolver.getInstance().getMessage("service.exception.function.get.validation.message"),
                request.functionUuid().toString())
            );
          if (function instanceof Stand) {
            throw new InvalidDatabaseInsertionException(
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidRegister.error"),
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidRegister.message"),
                Map.of(
                    MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidRegister.field"),
                    request.functionUuid().toString()
                )
            );
          }
        }
      }
      else if (request.functionUuid() == null && !voluntary.getFunction().getUuid().equals(manager.getUuid())) {
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
        // Register validation
        else {
          if (manager.getFunction() instanceof Stand) {
            throw new InvalidDatabaseInsertionException(
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidRegister.error"),
                MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidRegister.message"),
                Map.of(
                    MessageResolver.getInstance().getMessage("validation.voluntary.checkManageFunction.invalidRegister.field"),
                    "null"
                )
            );
          }
        }
      }
    }
  }

  public void checkRootCantChangeRole(Voluntary voluntary) {
    if (voluntary.getFullname().equals("Root User")) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.voluntary.checkRootRole.invalidChangeRole.error"),
          MessageResolver.getInstance().getMessage("validation.voluntary.checkRootRole.invalidChangeRole.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.voluntary.checkRootRole.invalidChangeRole.field"),
              "null"
          )
      );
    }
  }
}
