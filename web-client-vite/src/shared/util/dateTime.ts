import moment from "moment";
import store from "../redux/store";

type TDateInput = string | Date;

function momentFormat(date: TDateInput, format: string): string {
  return moment(date).format(format);
}

export function formatDateFromNow(date: TDateInput) {
  return moment(date).fromNow();
}

export function formatDateShort(date: TDateInput) {
  const formatString = store.getState().user.formats.shortDateFormat;
  return momentFormat(date, formatString);
}

export function formatDateLong(date: TDateInput) {
  const formatString = store.getState().user.formats.longDateFormat;
  return momentFormat(date, formatString);
}

export function formatDateTimeLong(date: TDateInput) {
  const formatString = store.getState().user.formats.longDateTimeFormat;
  return momentFormat(date, formatString);
}

export function formatDateTimeShort(date: TDateInput) {
  const formatString = store.getState().user.formats.shortDateTimeFormat;
  return momentFormat(date, formatString);
}

export function formatTime(date: TDateInput) {
  const formatString = store.getState().user.formats.timeFormat;
  return momentFormat(date, formatString);
}
