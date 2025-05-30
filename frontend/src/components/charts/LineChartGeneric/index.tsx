import { ResponsiveLine } from "@nivo/line";

type LineSerie = {
  id: string;
  data: { x: string; y: number }[];
};

interface LineChartGenericProps {
  data: LineSerie[];
  modeLabel?: string;
}

function LineChartGeneric({ data, modeLabel }: LineChartGenericProps) {
  return (
    <div style={{ height: 500 }}>
      <ResponsiveLine
        data={data}
        xScale={{
          type: "time",
          format: "%Y-%m-%dT%H:%M:%S",
          precision: "minute",
        }}
        xFormat="time:%Y-%m-%d %H:%M"
        yScale={{ type: "linear", stacked: false, reverse: false }}
        axisBottom={{
          format: "%H:%M",
          tickValues: "every 15 minutes",
          legend: "Tempo",
          legendOffset: 36,
        }}
        axisLeft={{
          legend: modeLabel || "Valor",
          legendOffset: -40,
        }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor", modifiers: [] }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh
        colors={{ scheme: "category10" }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
}

export default LineChartGeneric;
