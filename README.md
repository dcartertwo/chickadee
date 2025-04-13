# Chickadee

Chickadee is a self-managed, open-source website analytics tool built with Cloudflare.

Monorepo:

- `./packages/service` - the service: events endpoint, client script, and dashboard
- `./packages/cli` - used for deploying the service
- `./packages/web` - the landing page: <https://www.chickadee.me>

## Development

### Dev Vars

`./packages/service/.dev.vars` is used for local development:

- `CLOUDFLARE_API_TOKEN` - Cloudflare account token with "Access: Analytics" Read permission: <https://developers.cloudflare.com/analytics/analytics-engine/get-started/#create-an-api-token>

### AI/LLMs

The following LLM docs are included in `.cursor/rules`:

- `hono.mdc`: <https://hono.dev/llms-small.txt>
