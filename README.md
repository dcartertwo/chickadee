# 🐦 Chickadee

Chickadee is a self-managed, open-source website analytics tool running on a Cloudflare Worker.

Monorepo:

- `./packages/app` - the service: events endpoint, client script, and dashboard
- `./packages/web` - the landing page: <https://www.chickadee.me>

## Deploy your Own

1. Make sure you have installed the [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) and authenticated with your Cloudflare account by calling `wrangler login`.
2. Clone the repo: `git clone https://github.com/abegehr/chickadee` and `cd chickadee`.
3. Run `pnpm i` to install the dependencies.
4. Run `pnpm app run deploy` to deploy the service to Cloudflare.
5. Make note of your worker URL: `https://<your-worker-name>.workers.dev`.
6. Set all secrets listed in the [Secrets](#secrets) section on you worker: `pnpm app wrangler secret put …`.
7. Open your worker URL in your browser and login with username `admin` and password `BASIC_PASSWORD` configured in step 6.

<!-- TODO add cli for easier deployment -->

## Development

### Secrets

Copy `./packages/app/.dev.vars.example` to `./packages/app/.dev.vars` and set the following secrets:

- `BASIC_PASSWORD` - the password for basic auth to access the dashboard
- `CLOUDFLARE_API_TOKEN` - Cloudflare account token with "Access: Analytics" Read permission: <https://developers.cloudflare.com/analytics/analytics-engine/get-started/#create-an-api-token>

## Inspired by

- <http://plausible.io>
- <https://counterscale.dev>
- <https://withcabin.com>
- <https://matomo.org>

## TODOs

- [ ] TODO! landing page
- [x] favicon on LP and dashboard
- [x] dashboard with graphs
- [ ] cli for easy deployment
- [ ] live-mode
- [ ] page with grid of all sites
- [ ] add loadTime metric to dashboard
- [ ] add screen size to dashboard?
- [ ] filter dashboard by dimensions
- [ ] add retention to dashboard (based on user id)
