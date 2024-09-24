import moment from 'moment-timezone';

function getThaiDateTime() {
  return moment().tz('Asia/Bangkok').toDate();
}

function getThaiDateTimeMinusDays(days) {
  return moment().tz('Asia/Bangkok').subtract(days, 'days').toDate();
}

function formatThaiDateTime(date) {
  return moment(date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
}

export { getThaiDateTime, getThaiDateTimeMinusDays, formatThaiDateTime };