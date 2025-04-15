async function trackPageView() {
  const ep = new URL(`/api/events`, document.currentScript.src);

  const d = window.location.hostname;
  const u = window.location.href;
  const r = document.referrer;
  const w = window.screen.width; // device screen width
  const t = performance.now(); // load time of the page
  const body = { d, u, r, w, t };
  console.log("Chickadees Page View:", ep, body);

  const params = new URLSearchParams();
  params.set("d", d);
  params.set("u", u);
  params.set("r", r);
  params.set("w", w);
  params.set("t", t);

  try {
    const res = await fetch(ep + "?" + params.toString(), {
      method: "GET",
    });
    const data = await res.text();
    console.log("Chickadee ->", data);
  } catch (err) {
    console.error("Chickadee Error:", err);
  }
}

trackPageView(); // TODO auto-track client-side navigation?
