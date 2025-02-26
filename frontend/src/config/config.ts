export interface Config {
  version: "simple" | "order" | "tokens";
  enableOrder: boolean;
  enableToken: boolean;
  enableCard: boolean;
}

const configs: Record<string, Config> = {
  simple: {
    version: "simple",
    enableOrder: true,
    enableToken: false,
    enableCard: false,
  },
  order: {
    version: "order",
    enableOrder: true,
    enableToken: false,
    enableCard: true,
  },
  tokens: {
    version: "tokens",
    enableOrder: false,
    enableToken: true,
    enableCard: true,
  },
};

export default configs;
