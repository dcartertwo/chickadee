async function trackPageView() {
  const ep = new URL(`/api/events`, document.currentScript.src);

  const d = window.location.hostname;
  const u = window.location.href;
  const r = document.referrer;
  const w = window.screen.width; // device screen width
  const t = performance.now(); // load time of the page
  const body = { d, u, r, w, t };
  console.debug("Chickadees Page View:", ep, body);

  try {
    const res = await fetch(ep, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.text();
    console.debug("Chickadee ->", data);
  } catch (err) {
    console.error("Chickadee Error:", err);
  }
}

trackPageView(); // TODO auto-track client-side navigation?
