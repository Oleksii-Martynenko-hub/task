const moment = require("moment");
// const [hours, minutes] = [1,0]
// const dt = [2020, 8, 14, 9, 0]

// const testDate = new Date(...dt)

export function getDateDealine(hoursT, minutesT, newDate = new Date(), today = 1) {
  let hours = hoursT;
  let minutes = minutesT;
  const wD = {sat:6, sun:0}
  const wH = {start: 10, end: 19}
  
  const now = new Date(newDate)
  const nYear = now.getFullYear();
  const nMonth = now.getMonth();
  const nDay = now.getDay();
  const nDate = now.getDate();
  const nHour = now.getHours();
  const nMin = now.getMinutes();
  
  let nextDay = 0;
  
  const deadline = new Date(now);
  
  let min = nMin + minutes;
  if (min > 60) {
    deadline.setHours(nHour + 1)
    min = min - 60;
  }
  min = min > 0 && min <= 30 ? 30 : min > 30 && min <= 60 ? 60 : 0;
  
  deadline.setHours(nHour + hours, min)
  deadline.setMonth(nMonth)
  deadline.setFullYear(nYear)
  
  let dHour = deadline.getHours();
  let dMin = deadline.getMinutes();
  
  if(nDay !== wD.sat && nDay !== wD.sun) {  
    
    if(nHour >= wH.start && nHour < wH.end) {
      
      if ((dHour < wH.end && dHour >= wH.start && hours <= (wH.end-wH.start)) || (dHour === wH.end && dMin < 1)) {
        
        if (today === 1) return hours <= 1 ? `Здамо за: одну годину` :
        hours === 2 ? `Здамо за: дві години` :
        (hours === 3 && minutes < 1) ? `Здамо за: три години`:
        `Термін виконання: ${moment(deadline).format('DD.MM.YYYY о HH:mm')}`;
        
        
        if (today === 0) return `Термін виконання: ${moment(deadline).format('DD.MM.YYYY о HH:mm')}`;
        
        
      } else {
        
        if (minutes < 60 - nMin) {
          minutes = 60 - (60 - nMin - minutes);
          hours--;
        } else {
          minutes = minutes - (60 - nMin);
        }
        hours = hours - (wH.end - (nHour+1))
        
        deadline.setDate(nDate + 1)
        deadline.setHours(wH.start, 0)
        return getDateDealine(hours, minutes, deadline, 0)
      }
    } else {
      nextDay = (nHour >= 0 && nHour < wH.start) ? 0 : 1;
      deadline.setDate(nDate + nextDay)
      deadline.setHours(wH.start, 0)
      return getDateDealine(hours, minutes, deadline, 0)
    }
  } else {
    nextDay = nDay === wD.sat ? 2 : nDay === wD.sun ? 1 : 0;
    deadline.setDate(nDate + nextDay)
    deadline.setHours(wH.start, 0)
    return getDateDealine(hours, minutes, deadline, 0)
  }
}