# Chickadee

Chickadee is a self-managed, open-source website analytics tool built with Cloudflare.

Monorepo:

- `./packages/service` - the service: events endpoint, client script, and dashboard
- `./packages/cli` - used for deploying the service
- `./packages/web` - the landing page: <https://www.chickadee.me>

## Dev Experience

### AI/LLMs

The following LLM docs are included in `.cursor/rules`:

- `hono.mdc`: <https://hono.dev/llms-small.txt>
