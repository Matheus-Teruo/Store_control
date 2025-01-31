export interface Config {
  version: "simple" | "order" | "tokens";
  enableOrder: boolean;
  enableToken: boolean;
}

const configs: Record<string, Config> = {
  simple: {
    version: "simple",
    enableOrder: false,
    enableToken: false,
  },
  order: {
    version: "order",
    enableOrder: true,
    enableToken: false,
  },
  tokens: {
    version: "tokens",
    enableOrder: false,
    enableToken: true,
  },
};

export default configs;
