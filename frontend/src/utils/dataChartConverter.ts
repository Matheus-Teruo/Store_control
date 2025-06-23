import ResponseRegisterChart from "@data/statistics/registerChart";
import ResponseStandChart, {
  ResponseStandProductTotal,
  ResponseStandTotal,
} from "@data/statistics/standChart";
import { format, parseISO, addMinutes, isBefore, isEqual } from "date-fns";

type Point = { x: string; y: number };
type Series = { id: string; data: Point[] };
type SimpleBar = { id: string; value: number };

const toDatetimeLocal = (date: Date): string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss");

function fillData(serie: Point[]): Point[] {
  if (serie.length === 0) return [];

  const filled: Point[] = [];

  const pointMap = new Map(serie.map((p) => [p.x, p.y]));

  let current = parseISO(serie[0].x);
  const end = parseISO(serie[serie.length - 1].x);

  while (isBefore(current, end) || isEqual(current, end)) {
    filled.push({
      x: toDatetimeLocal(current),
      y: pointMap.get(toDatetimeLocal(current)) ?? 0,
    });
    current = addMinutes(current, 15);
  }

  return filled;
}

export function groupRegisterData(
  data: ResponseRegisterChart[],
  group: "register" | "payment",
): Series[] {
  const chartData: Series[] = [];

  if (group === "register") {
    for (const register of data) {
      const timeMap: Record<string, number> = {};
      for (const node of register.rechargeCharts) {
        timeMap[node.time] = (timeMap[node.time] || 0) + node.total;
      }

      chartData.push({
        id: register.registerName,
        data: fillData(Object.entries(timeMap).map(([x, y]) => ({ x, y }))),
      });
    }
  } else {
    const mapByPayment: Record<string, Record<string, number>> = {};

    for (const register of data) {
      for (const node of register.rechargeCharts) {
        if (!mapByPayment[node.paymentType]) {
          mapByPayment[node.paymentType] = {};
        }

        mapByPayment[node.paymentType][node.time] =
          (mapByPayment[node.paymentType][node.time] || 0) + node.total;
      }
    }

    for (const [paymentType, times] of Object.entries(mapByPayment)) {
      chartData.push({
        id: paymentType,
        data: fillData(Object.entries(times).map(([x, y]) => ({ x, y }))),
      });
    }
  }
  return chartData;
}

export function groupStandData(
  data: ResponseStandChart[],
  group: "product" | "stand",
  mode: "quantity" | "total",
): Series[] {
  const chartData: Series[] = [];

  if (group === "product") {
    for (const stand of data) {
      for (const product of stand.productCharts) {
        chartData.push({
          id: product.productName,
          data: fillData(
            product.purchaseChartNodes.map((node) => ({
              x: node.time,
              y: mode === "quantity" ? node.quantity : node.total,
            })),
          ),
        });
      }
    }
  } else {
    for (const stand of data) {
      const timeMap: Record<string, number> = {};

      for (const product of stand.productCharts) {
        for (const node of product.purchaseChartNodes) {
          const key = node.time;
          const value = mode === "quantity" ? node.quantity : node.total;
          timeMap[key] = (timeMap[key] || 0) + value;
        }
      }

      chartData.push({
        id: stand.standName,
        data: fillData(Object.entries(timeMap).map(([x, y]) => ({ x, y }))),
      });
    }
  }

  return chartData;
}

export function totalProductData(
  data: ResponseStandProductTotal[],
  mode: "quantity" | "total",
): SimpleBar[] {
  const productMap: Record<string, { name: string; value: number }> = {};

  data.forEach((stand) => {
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
    id: p.name,
    value: p.value,
  }));
}

export function totalStandData(
  data: ResponseStandTotal[],
  mode: "quantity" | "total",
): SimpleBar[] {
  return data.map((stand) => ({
    id: stand.standName,
    value: mode === "quantity" ? stand.totalProductQuantity : stand.totalAmount,
  }));
}
