const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

export const addDays = (dt, days) => {

  if (typeof dt === 'string') {
      dt = new Date(dt)
  }
  var newDate = new Date(dt)
  var nextDate = dt.getDate() + parseInt(days)
  newDate.setDate(nextDate);
  return newDate
}

export const inputDate = (date) => {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0,10);
}

export const formatDate = (date, sep = "/") => {
  let newDate = new Date(date)

  var dd = newDate.getDate()
  var mm = newDate.getMonth() + 1
  var y = newDate.getFullYear()

  return `${mm}${sep}${dd}${sep}${y}`
}

export const daysBetween = (d1, d2) => {
  var firstDate = new Date(d1);
  var secondDate = new Date(d2);
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}