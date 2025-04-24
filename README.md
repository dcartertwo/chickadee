# 🐦 Chickadee

Chickadee is a self-managed, open-source website analytics tool running on a Cloudflare Worker.

Monorepo:

- `./packages/service` - the service: events endpoint, client script, and dashboard
- `./packages/cli` - used for deploying the service
- `./packages/web` - the landing page: <https://www.chickadee.me>

## Deploy your Own

TODO! how to deploy chickadee

## Development

### Dev Vars

`./packages/service/.dev.vars` is used for local development:

- `BASIC_PASSWORD` - the password for basic auth to access the dashboard
- `CLOUDFLARE_API_TOKEN` - Cloudflare account token with "Access: Analytics" Read permission: <https://developers.cloudflare.com/analytics/analytics-engine/get-started/#create-an-api-token>

## Inspired by

- <http://plausible.io>
- <https://counterscale.dev>
- <https://withcabin.com>
- <https://matomo.org>

## TODOs

- [ ] website landing page
- [ ] favicon on LP and dashboard
- [ ] dashboard with graphs and stuff
- [ ] cli for easy deployment
- [ ] live-mode
- [ ] page with grid of all sites
