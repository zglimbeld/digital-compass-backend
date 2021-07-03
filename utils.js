const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const formatDate = date => {
  const formattedYear = date.getUTCFullYear();
  const formattedMonth = (date.getUTCMonth() + 1) < 10 ?
    `0${date.getUTCMonth() + 1}` :
    date.getUTCMonth();
  const formattedDay = date.getUTCDate() < 10 ?
    `0${date.getUTCDate()}` :
    date.getUTCDate();
  const formattedTime = date.getUTCHours() <= 12 ?
    `${date.getUTCHours() < 10 ?
      `0${date.getUTCHours()}` :
      date.getUTCHours()}:${date.getUTCMinutes() < 10 ?
        `0${date.getUTCMinutes()}` :
        date.getUTCMinutes()}:${date.getUTCSeconds() < 10 ?
        `0${date.getUTCSeconds()}` :
        date.getUTCSeconds()} AM` :
    `${(date.getUTCHours() - 12) < 10 ?
      `0${date.getUTCHours() - 12}` :
      date.getUTCHours() - 12}:${date.getUTCMinutes() < 10 ?
        `0${date.getUTCMinutes()}` :
        date.getUTCMinutes()}:${date.getUTCSeconds() < 10 ?
        `0${date.getUTCSeconds()}` :
        date.getUTCSeconds()} PM`;
  const formattedDate = `${formattedYear}${formattedMonth}${formattedDay} ${formattedTime}`;
  return formattedDate;
}

exports.addDays = addDays;
exports.formatDate = formatDate;
