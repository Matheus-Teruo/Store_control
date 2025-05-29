import style from "./TotalProductsBars.module.scss";
import BarChartGeneric from "@/components/charts/BarChartGeneric";
import ChartSelect from "@/components/selects/ChartSelect";
import StandSelect from "@/components/selects/StandSelect";
import {
  isAdmin,
  isManeger,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  ResponseStandProductTotal,
  // ResponseStandTotal,
} from "@data/statistics/standChart";
import {
  convertToString,
  dateRangeReducer,
  initialDateRangeState,
} from "@reducer/statistics/dateRangeReducer";
import useStatisticsStandService from "@service/statistics/useStatisticsStandService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

function TotalProductsBars() {
  // const [standTotals, setStandTotals] = useState<ResponseStandTotal[]>([]);
  const [productTotals, setProductTotals] = useState<
    ResponseStandProductTotal[]
  >([]);
  const [date, dateDispatch] = useReducer(
    dateRangeReducer,
    initialDateRangeState,
  );
  const [mode, setMode] = useState<"total" | "quantity">("total");
  const [stand, setStand] = useState<string | undefined>(undefined);
  const { getProductTotals } = useStatisticsStandService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchTotals = useCallback(
    async (modeAmin: boolean) => {
      if (isManeger(user)) {
        // const standTotalResponse = await getStandTotals(
        //   modeAmin ? stand : user.summaryFunction?.uuid,
        // );
        const productTotalResponse = await getProductTotals(
          convertToString(date.startTime),
          convertToString(date.endTime),
          modeAmin ? stand : user.summaryFunction?.uuid,
        );
        // if (standTotalResponse) {
        //   setStandTotals(standTotalResponse);
        // }
        if (productTotalResponse) {
          setProductTotals(productTotalResponse);
        }
      }
    },
    [user, date, stand, getProductTotals],
  );

  useEffect(() => {
    if (isManeger(user)) {
      if (isAdmin(user)) {
        fetchTotals(true);
      } else {
        fetchTotals(false);
      }
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchTotals]);

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
      {/* <BarChartGeneric group="stand" mode={mode} data={standTotals} /> */}
      <BarChartGeneric group="product" mode={mode} data={productTotals} />
    </div>
  );
}

export default TotalProductsBars;
