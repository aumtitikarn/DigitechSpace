import moment from 'moment-timezone';

function getThaiDateTime() {
  return moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
}

function formatThaiDateTime(dateString) {
  return moment.tz(dateString, 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
}

function getThaiDateTimeMinusDays(days) {
  return moment().tz('Asia/Bangkok').subtract(days, 'days').toDate();
}


export { getThaiDateTime, getThaiDateTimeMinusDays, formatThaiDateTime };