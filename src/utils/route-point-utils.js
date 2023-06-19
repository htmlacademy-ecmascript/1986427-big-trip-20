import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const MSEC_IN_SEC = 1000;
export const SEC_IN_MIN = 60;
export const MIN_IN_HOUR = 60;
export const HOUR_IN_DAY = 24;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const EVENT_DATE = 'MMM DD';
export const TIME_FORMAT = 'HH:mm';

export const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
export const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;

export function normalizeDate(date, dateFormat) {
  return date
    ? dayjs(date).format(dateFormat)
    : '';
}

export function getTimeDiff(timeFrom, timeTo) {
  const timeDiff = dayjs(timeTo).diff(timeFrom);

  let routeDuration = 0;

  if (timeDiff >= MSEC_IN_DAY) {
    routeDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  }

  if (timeDiff >= MSEC_IN_HOUR) {
    routeDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }

  if (timeDiff < MSEC_IN_HOUR) {
    routeDuration = dayjs.duration(timeDiff).format('mm[M]');
  }

  return routeDuration;
}

export const getDatesDiff = (dateFrom, dateTo, timeUnit) => timeUnit
  ? dayjs(dateTo).diff(dayjs(dateFrom), timeUnit)
  : dayjs(dateTo).diff(dayjs(dateFrom));


export function isRoutePointFuture(routePoint){
  return (dayjs().isBefore(routePoint.dateFrom));
}

export function isRoutePointPast(routePoint){
  return (dayjs().isAfter(routePoint.dateTo));
}

export function isRoutePointPresent(routePoint){
  return (dayjs().isAfter(routePoint.dateFrom) && dayjs().isBefore(routePoint.dateTo));
}

export const sortByDay = (routePointA, routePointB) => {
  const dateA = dayjs(routePointA.dateFrom);
  const dateB = dayjs(routePointB.dateFrom);
  if (dateA.isSame(dateB, 'D')) {
    return 0;
  }
  return dateA.isAfter(dateB, 'D') ? 1 : -1;
};

export const sortByDurationTime = (routePointA, routePointB) => getDatesDiff(routePointB.dateFrom, routePointB.dateTo) - getDatesDiff(routePointA.dateFrom, routePointA.dateTo);

export const sortByPrice = (routePointA, routePointB) => routePointB.basePrice - routePointA.basePrice;
