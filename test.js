// import console = require("console");

const newTime = (hours, minutes) => {
  date = new Date(0).setTime(1000 * 60 * minutes + 1000 * 60 * 60 * hours);
  return new Date(date).toLocaleTimeString("en-US", {
    dateStyle: "short",
    hour12: false,
    timeZone: "Etc/GMT",
    hour: "numeric",
    minute: "numeric"
  });
};

console.log(new Date(new Date().setHours(24)));
