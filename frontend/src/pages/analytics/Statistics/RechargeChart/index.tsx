import LineChartGeneric from "@/components/charts/LineChartGeneric";
import style from "./RechargeChart.module.scss";
import ChartSelect from "@/components/selects/ChartSelect";
import { isManeger, isUserUnlogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import ResponseRegisterChart from "@data/statistics/registerChart";
import {
  convertToString,
  dateRangeReducer,
  initialDateRangeState,
} from "@reducer/statistics/dateRangeReducer";
import useStatisticsRegisterService from "@service/statistics/useStatisticsRegisterService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupRegisterData } from "@/utils/dataChartConverter";

function RechargeChart() {
  const [registers, setRegisters] = useState<ResponseRegisterChart[]>([]);
  const [date, dateDispatch] = useReducer(
    dateRangeReducer,
    initialDateRangeState,
  );
  const [group, setGroup] = useState<"register" | "payment">("register");
  const { getRechargeCharts } = useStatisticsRegisterService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistersChart = async () => {
      const rechargeCharts = await getRechargeCharts(
        convertToString(date.startTime),
        convertToString(date.endTime),
      );
      if (rechargeCharts) {
        setRegisters(rechargeCharts);
      }
    };

    if (isManeger(user)) {
      fetchRegistersChart();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, date, navigate, getRechargeCharts]);

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
                setGroup(event.target.value as "register" | "payment")
              }
              list={["register", "payment"]}
            />
          </div>
        </div>
      </div>
      <LineChartGeneric
        data={groupRegisterData(registers, group)}
        modeLabel="Total R$"
      />
    </div>
  );
}

export default RechargeChart;
