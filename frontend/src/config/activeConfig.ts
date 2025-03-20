import configs, { Config } from "./config";

const activeVersion = import.meta.env.VITE_SYSTEM_VERSION || "simple";
export const fixedCardID = import.meta.env.VITE_ORDER_CARD_ID_FIXED;
export const fixedCashUuid = import.meta.env.VITE_CASH_REGISTER_UUID_FIXED;

const activeConfig: Config = configs[activeVersion];

if (!activeConfig) {
  throw new Error(
    `Configuração não encontrada para a versão: ${activeVersion}`,
  );
}

export default activeConfig;
