package com.storecontrol.backend.services.statistics.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class StatisticsValidation {
  public void checkManagerRegister(Voluntary manager) {
    if (manager.getVoluntaryRole().isNotAdmin()) {
      if (manager.getFunction() instanceof Stand) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.notRegister.error"),
            MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.notRegister.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.notRegister.field"),
                manager.getFunction().getUuid().toString()
            )
        );
      }
    }
  }

  public void checkManagerStand(Voluntary manager, UUID standUuid) {
    if (manager.getVoluntaryRole().isNotAdmin()) {
      if (standUuid != null && !manager.getFunction().getUuid().equals(standUuid)) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.differentStand.error"),
            MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.differentStand.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.differentStand.field"),
                standUuid.toString()
            )
        );
      } else if (standUuid == null) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.nullStand.error"),
          MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.nullStand.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.chart.checkManagerFunction.nullStand.field"),
              "null"
          )
      );
    }
    }
  }
}
