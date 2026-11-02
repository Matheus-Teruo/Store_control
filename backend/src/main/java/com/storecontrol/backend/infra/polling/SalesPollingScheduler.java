package com.storecontrol.backend.infra.polling;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.storecontrol.backend.services.polling.SalesPollingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class SalesPollingScheduler {

    private final SalesPollingService salesPollingService;

    @Scheduled (fixedRateString = "${pagbank.polling.interval-ms}")
    public void pollPagBankSales() {
        log.info("Iniciando ciclo de polling nas vendas do PagBank...");
        try {
            salesPollingService.fetchAndProcessNewSales();
            log.info("Ciclo de polling finalizado com sucesso.");
        } catch (Exception e) {
            log.error("Erro durante o processo de polling das vendas: {}", e.getMessage(), e);
        }
    }
}
