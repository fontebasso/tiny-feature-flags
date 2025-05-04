# tiny-feature-flags

[![tests](https://github.com/fontebasso/tiny-feature-flags/actions/workflows/tests.yml/badge.svg)](https://github.com/fontebasso/tiny-feature-flags/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/tiny-feature-flags)](https://www.npmjs.com/package/tiny-feature-flags)
[![npm audit signatures](https://img.shields.io/badge/npm%20audit-signed%20%26%20attested-brightgreen?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)
[![license](https://img.shields.io/npm/l/tiny-feature-flags)](LICENSE)

A tiny, dependency-free feature flag library designed for serverless, edge, and modern JavaScript runtimes. Built to be safe, deterministic, and easy to integrate anywhere.

## Use cases

- Gradual feature rollout using `rollout`
- A/B testing by user traits (plan, region, etc.)
- Environment-based toggles without external services
- Fast evaluation in edge or serverless environments

## Why tiny-feature-flags

- Zero dependencies
- Works in Node.js, Edge Functions, Vercel, Cloudflare Workers
- Runtime evaluation with user traits and percentage rollout
- Designed to be deterministic and side-effect-free
- Fully tested with 100% code coverage

## Installation

```bash
npm install tiny-feature-flags
```

## Quick start

```ts
import { TinyFlags } from 'tiny-feature-flags'

const flags = await TinyFlags.load('https://example.com/flags.json', {
  userId: 'user-123',
  traits: { region: 'us', plan: 'pro' },
})

if (flags.enabled('newSidebar')) {
  showNewSidebar()
}
```

### Sample JSON

```json
{
  "newSidebar": { "enabled": true, "rollout": 30 },
  "v3Checkout": { "enabled": true }
}
```

## Evaluation logic

Each flag has:

- `enabled: boolean` — the base toggle
- Optional `rollout: number` — deterministic activation based on user ID hash

Unknown flags always return `false`.

## API reference

```ts
class TinyFlags {
  constructor(flags: FlagSet, context?: FlagContext)
  static async load(url: string, context?: FlagContext): Promise<TinyFlags>
  enabled(flagName: string): boolean
}
```

### Types

```ts
type FlagContext = {
  userId?: string
  traits?: Record<string, string>
}

type FlagDefinition = {
  enabled: boolean
  rollout?: number
}

type FlagSet = Record<string, FlagDefinition>
```

## Hosting your flags

Serve JSON from any HTTPS endpoint. It can be hosted on:

- GitHub Gist
- Amazon S3
- Your own static server
- CDN with edge caching

## Example: usage with Vercel Edge Function

```ts
export const runtime = 'edge'

import { TinyFlags } from 'tiny-feature-flags'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value || 'anonymous'

  const flags = await TinyFlags.load('https://example.com/flags.json', {
    userId,
    traits: { region: 'br', plan: 'pro' },
  })

  return Response.json({
    showNewSidebar: flags.enabled('newSidebar'),
  })
}
```

## Tests and reliability

- 100% test coverage using Vitest
- Deterministic logic across all environments
- Includes validation and error handling for unexpected responses

## Design considerations

- Default to `false` for unknown flags
- Stateless by design
- Safe for usage in edge and serverless runtimes

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
