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
        curve="monotoneX"
        xFormat="time:%Y-%m-%d %H:%M"
        pointLabel="id"
        pointLabelYOffset={-15}
        yScale={{ type: "linear", stacked: false }}
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
        pointSize={8}
        useMesh
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
