import { format, isAfter, isBefore } from "date-fns";

interface DateRange {
  startTime: string;
  endTime: string;
}

const toDatetimeLocal = (date: Date): string =>
  format(date, "yyyy-MM-dd'T'HH:mm");

type DateRangeAction =
  | { type: "SET_START_TIME"; payload: string }
  | { type: "SET_END_TIME"; payload: string }
  | { type: "RESET" };

const getInitialDateRangeState = (): DateRange => {
  const savedStartTime = localStorage.getItem("startTime");
  const savedEndTime = localStorage.getItem("endTime");

  const now = Date.now();

  return {
    startTime:
      savedStartTime ?? toDatetimeLocal(new Date(now - 24 * 60 * 60 * 1000)),
    endTime: savedEndTime ?? toDatetimeLocal(new Date(now)),
  };
};

export const initialDateRangeState: DateRange = getInitialDateRangeState();

export function dateRangeReducer(
  state: DateRange,
  action: DateRangeAction,
): DateRange {
  switch (action.type) {
    case "SET_START_TIME": {
      const newStart = new Date(action.payload);
      const currentEnd = new Date(state.endTime);
      if (isAfter(newStart, currentEnd)) return state;
      localStorage.setItem("startTime", action.payload);
      return { ...state, startTime: action.payload };
    }

    case "SET_END_TIME": {
      const newEnd = new Date(action.payload);
      const currentStart = new Date(state.startTime);
      if (isBefore(newEnd, currentStart)) return state;
      localStorage.setItem("endTime", action.payload);
      return { ...state, endTime: action.payload };
    }
    case "RESET": {
      return initialDateRangeState;
    }
    default:
      throw new Error("Ação desconhecida no reducer");
  }
}

export const convertToString = (time: string): string => time + ":00";
