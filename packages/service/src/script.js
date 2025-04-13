// TODO! publish this script

fetch("https://chickadee.5sides.workers.dev/api/events?d=test.com")
  .then((res) => res.json())
  .then((data) => console.log(data));
