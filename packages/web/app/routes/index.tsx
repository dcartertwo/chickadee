import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <>
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Chickadee Analytics</h1>
            <p className="py-6 text-xl">
              Simple, privacy-focused web analytics you can self-host on
              Cloudflare
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com/abegehr/chickadee"
                className="btn btn-primary"
              >
                Get Started with GitHub
              </a>
              {/* TODO! chickadee-demo */}
              <a href="/demo" className="btn btn-outline">
                Browse the Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16 px-4 max-w-7xl mx-auto">
        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <title>Scale icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            <h2 className="card-title">Free and Open Source</h2>
            <p>
              Chickadee is MIT licensed. You run it yourself on your own
              Cloudflare account.
            </p>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <title>Lightning bolt icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 className="card-title">Simple to Deploy</h2>
            <p>
              Deploy as a single Cloudflare Worker with data stored using
              Cloudflare Analytics Engine.
            </p>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <title>Lock icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="card-title">Privacy Focused</h2>
            <p>
              No cookies, you control your data end-to-end, and data is retained
              for only 90 days.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-base-200 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8">
            Deploy your own instance of Chickadee Analytics today.
          </p>
          <a
            href="https://github.com/abegehr/chickadee"
            className="btn btn-primary"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </>,
  );
});
