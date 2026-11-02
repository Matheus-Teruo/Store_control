package com.storecontrol.backend.services.polling;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.storecontrol.backend.models.polling.ProcessedSale;
import com.storecontrol.backend.models.polling.SalePollingStatus;
import com.storecontrol.backend.models.polling.SyncExecutionLog;
import com.storecontrol.backend.models.polling.SyncFeatureToggle;
import com.storecontrol.backend.models.polling.response.ExternalSaleDTO;
import com.storecontrol.backend.repositories.polling.ProcessedSaleRepository;
import com.storecontrol.backend.repositories.polling.SyncExecutionLogRepository;
import com.storecontrol.backend.repositories.polling.SyncFeatureToggleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SalesPollingService {

    private final static String FEATURE_NAME = "PAGBANK_POLLING";
    private final static int SEARCH_WINDOW = 10;

    private final SyncExecutionLogRepository executionLogRepository;
    private final SyncFeatureToggleRepository featureToggleRepository;
    private final ProcessedSaleRepository processedSaleRepository;
    private final SalesTradeRegister salesTradeRegister;
    // private final PagBankClient pagBankClient; 

    @Transactional
    public void fetchAndProcessNewSales() {
        boolean isEnabled = featureToggleRepository.findByFeatureName(FEATURE_NAME)
                .map(SyncFeatureToggle::getEnabled)
                .orElse(true);
        if (!isEnabled) {
            return;
        }

        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime lastSync = getLastSuccessfulSyncDate();
        LocalDateTime safetyWindowStart = startTime.minusMinutes(SEARCH_WINDOW);

        log.info("Iniciando polling. Última sincronização registrada em: {}. Buscando a partir de: {}", lastSync, safetyWindowStart);

        int processedCount = 0;
        SalePollingStatus status = SalePollingStatus.SUCCESS;

        try {
            // Chamada simulada da API externa
            // List<ExternalSaleDTO> novasVendas = pagBankClient.getSales(safetyWindowStart, startTime);
            List<ExternalSaleDTO> novasVendas = List.of(); 

            for (ExternalSaleDTO venda : novasVendas) {
                String saleId = venda.id();

                if (processedSaleRepository.existsByExternalSaleId(saleId)) {
                    continue;
                }

                salesTradeRegister.createTradeFromBankApp(venda);
                
                processedSaleRepository.save(new ProcessedSale(saleId, LocalDateTime.now()));
                processedCount++;
            }

        } catch (Exception e) {
            status = SalePollingStatus.FAIL;
            log.error("Erro crítico durante o polling do PagBank: {}", e.getMessage(), e);
        } finally {
            LocalDateTime finishTime = LocalDateTime.now();
            SyncExecutionLog logEntry = new SyncExecutionLog(startTime, finishTime, processedCount, status);
            executionLogRepository.save(logEntry);
            log.info("Ciclo de polling finalizado. Status: {}. Vendas processadas: {}", status, processedCount);
        }
    }

    private LocalDateTime getLastSuccessfulSyncDate() {
        return executionLogRepository.findTopByStatusOrderByIdDesc(SalePollingStatus.SUCCESS)
                .map(SyncExecutionLog::getSyncFinishedAt)
                .orElseGet(() -> LocalDateTime.now().minusHours(2));
    }
}
