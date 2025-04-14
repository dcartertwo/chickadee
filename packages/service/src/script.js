// TODO! publish this script

const d = "test.com";
const u = window.location.href;
fetch(`https://chickadee.5sides.workers.dev/api/events`, {
  method: "POST",
  body: JSON.stringify({ d, u }),
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.text())
  .then((data) => console.log("Chickadee ->", data))
  .catch((err) => console.error("Chickadee Error:", err));
