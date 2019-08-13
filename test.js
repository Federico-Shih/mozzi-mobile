function getNextDay(nDays) {
  const date = new Date();
  return new Date(date.setSeconds(date.getSeconds() + 60 * 60 * 24 * nDays));
}

const mm = new Date();
const dates = new Map();
const newDate = { date: mm, key: 29, selected: false };

let initialDate;
for (let i = 0; i < 30; i += 1) {
  const date = getNextDay(i + 1);
  const objectDate = { date, key: i, selected: i === 0 };
  if (i === 0) initialDate = objectDate;
  dates.set(i, objectDate);
}

const selectedDate = "";

console.time();
if (selectedDate.key !== newDate.key) {
  dates.set(newDate.key, { ...dates.get(newDate.key), selected: true });
  if (selectedDate !== "") {
    newDates[oldIndex] = { ...dates[oldIndex], selected: false };
  }
}
const array = Array.from(dates.values);
console.timeEnd();
