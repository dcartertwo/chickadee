// TODO! publish this script

const d = "test.com";
const p = window.location.pathname;
fetch(`https://chickadee.5sides.workers.dev/api/events?d=${d}&p=${p}`)
  .then((res) => res.text())
  .then((data) => console.log("Chickadee ->", data))
  .catch((err) => console.error("Chickadee Error:", err));
