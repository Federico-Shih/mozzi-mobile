var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

var event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

let array = [
  { fag: 45 },
  { fag: 31 },
  { fag: 34 }
]

array.sort((a, b) => {
  return a.fag - b.fag;
})
console.log(array)