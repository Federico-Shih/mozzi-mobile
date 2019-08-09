const date = new Date();
const tomorrow = new Date(date.setSeconds(date.getSeconds() + 60 * 60 * 24));
console.log(date.getDay);
console.log(tomorrow.toLocaleDateString('hi', { weekday: 'short', timeZone: 'America/Buenos_Aires' }));
