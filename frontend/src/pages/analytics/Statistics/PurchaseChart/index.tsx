import LineChartGeneric from "@/components/charts/LineChartGeneric";
import style from "./PurchaseChart.module.scss";
import ChartSelect from "@/components/selects/ChartSelect";
import {
  isAdmin,
  isManeger,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import ResponseStandChart from "@data/statistics/standChart";
import {
  convertToString,
  dateRangeReducer,
  initialDateRangeState,
} from "@reducer/statistics/dateRangeReducer";
import useStatisticsStandService from "@service/statistics/useStatisticsStandService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupStandData } from "@/utils/dataChartConverter";
import StandSelect from "@/components/selects/StandSelect";

function PurchaseChart() {
  const [purchases, setPurchases] = useState<ResponseStandChart[]>([]);
  const [date, dateDispatch] = useReducer(
    dateRangeReducer,
    initialDateRangeState,
  );
  const [group, setGroup] = useState<"product" | "stand">("product");
  const [mode, setMode] = useState<"total" | "quantity">("total");
  const [stand, setStand] = useState<string | undefined>(undefined);
  const { getPurchaseCharts } = useStatisticsStandService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchPurhcases = useCallback(
    async (modeAmin: boolean) => {
      if (isManeger(user)) {
        const purchasesCharts = await getPurchaseCharts(
          convertToString(date.startTime),
          convertToString(date.endTime),
          modeAmin ? stand : user.summaryFunction?.uuid,
        );
        if (purchasesCharts) {
          setPurchases(purchasesCharts);
        }
      }
    },
    [user, date, stand, getPurchaseCharts],
  );

  useEffect(() => {
    if (isManeger(user)) {
      if (isAdmin(user)) {
        fetchPurhcases(true);
      } else {
        fetchPurhcases(false);
      }
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchPurhcases]);

  return (
    <div>
      <div className={style.header}>
        <div className={style.headerData}>
          <div className={style.selector}>
            <p>Data de início</p>
            <input
              type="datetime-local"
              value={date.startTime}
              onChange={(event) =>
                dateDispatch({
                  type: "SET_START_TIME",
                  payload: event.target.value,
                })
              }
            />
          </div>
          <div className={style.selector}>
            <p>Data de fim</p>
            <input
              type="datetime-local"
              value={date.endTime}
              onChange={(event) =>
                dateDispatch({
                  type: "SET_END_TIME",
                  payload: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className={style.headerSelect}>
          <div className={style.selector}>
            <p>Grupo</p>
            <ChartSelect
              value={group}
              onChange={(event) =>
                setGroup(event.target.value as "product" | "stand")
              }
              list={["product", "stand"]}
            />
          </div>
          <div className={style.selector}>
            <p>Valor</p>
            <ChartSelect
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as "total" | "quantity")
              }
              list={["total", "quantity"]}
            />
          </div>
          {isAdmin(user) && (
            <div className={style.selector}>
              <p>Estande</p>
              <StandSelect
                value={stand}
                onChange={(value) => setStand(value)}
              />
            </div>
          )}
        </div>
      </div>
      <LineChartGeneric
        data={groupStandData(purchases, group, mode)}
        modeLabel={mode === "total" ? "Total R$" : "Quantidade"}
      />
    </div>
  );
}

export default PurchaseChart;
