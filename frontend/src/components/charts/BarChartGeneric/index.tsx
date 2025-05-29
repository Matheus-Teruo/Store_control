import {
  ResponseStandProductTotal,
  ResponseStandTotal,
} from "@data/statistics/standChart";
import { ResponsiveBar } from "@nivo/bar";

interface BarChartGenericProps {
  group: "stand" | "product";
  mode: "quantity" | "total";
  data: ResponseStandTotal[] | ResponseStandProductTotal[];
}

function BarChartGeneric({ group, mode, data }: BarChartGenericProps) {
  const chartData: {
    product: string;
    value: number;
  }[] = (() => {
    if (data.length !== 0) {
      if (group === "stand") {
        return (data as ResponseStandTotal[]).map((stand) => ({
          product: stand.standName,
          value:
            mode === "quantity"
              ? stand.totalProductQuantity
              : stand.totalAmount,
        }));
      } else {
        const productMap: Record<string, { name: string; value: number }> = {};
        (data as ResponseStandProductTotal[]).forEach((stand) => {
          stand.productTotal.forEach((product) => {
            if (!productMap[product.productUuid]) {
              productMap[product.productUuid] = {
                name: product.productName,
                value: 0,
              };
            }
            productMap[product.productUuid].value +=
              mode === "quantity"
                ? product.totalProductQuantity
                : product.totalAmount;
          });
        });

        return Object.values(productMap).map((p) => ({
          product: p.name,
          value: p.value,
        }));
      }
    } else {
      return [{ product: "none", value: 0 }];
    }
  })();

  const keys =
    group === "stand"
      ? Array.from(
          new Set(
            (data as ResponseStandProductTotal[]).flatMap((d) =>
              d.productTotal.map((p) => p.productName),
            ),
          ),
        )
      : ["value"];

  const indexBy = group === "stand" ? "stand" : "product";

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={chartData}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisBottom={{
          tickRotation: -30,
          legend: group === "stand" ? "Estande" : "Produto",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          legend: mode === "quantity" ? "Quantidade" : "Total R$",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionConfig="wobbly"
        role="application"
        ariaLabel="Gráfico de barras por estande ou produto"
      />
    </div>
  );
}

export default BarChartGeneric;
