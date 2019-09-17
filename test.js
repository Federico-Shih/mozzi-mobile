var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const lol = [
  {
    name: "adfv"
  },
  {
    name: "b"
  },
  {
    name: "c"
  },
  {
    name: "asasa"
  },
  {
    name: "ddd"
  },
  {
    name: "gjjsjs"
  }
];

function alphabetize(array, compareKey = "name") {
  const res = {};
  array.forEach(el => {
    const letter = el[compareKey];
    const key = letter[0].toUpperCase();
    if (!(key in res)) res[key] = [];
    res[key].push(el);
  });
  const keys = Object.keys(res);
  keys.forEach(key => {
    res[key].sort((a, b) => a[compareKey] - b[compareKey]);
  });

  return res;
}
const result = alphabetize(lol);
console.log(result);
