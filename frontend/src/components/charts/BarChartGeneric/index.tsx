import { ResponsiveBar } from "@nivo/bar";

type SimpleBar = { id: string; value: number };

interface BarChartGenericProps {
  mode: "quantity" | "total";
  data: SimpleBar[];
}

function BarChartGeneric({ mode, data }: BarChartGenericProps) {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "set3" }}
        colorBy="indexValue"
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisBottom={{
          tickRotation: -20,
          legendPosition: "middle",
          legendOffset: 100,
        }}
        axisLeft={{
          legend: mode === "quantity" ? "Quantidade" : "Total R$",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableLabel={false}
        enableTotals
        legends={[
          {
            dataFrom: "indexes",
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
