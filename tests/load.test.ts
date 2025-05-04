import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TinyFlags } from '../src/index.js'

const mockJson = {
  newSidebar: { enabled: true, rollout: 50 },
  v3Checkout: { enabled: true },
}

describe('TinyFlags.load', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => mockJson,
    })) as typeof fetch
  })

  it('should load flags from remote source and evaluate them', async () => {
    const flags = await TinyFlags.load('https://example.org/flags.json', {
      userId: 'user-abc123',
      traits: { plan: 'pro' },
    })

    expect(flags.enabled('newSidebar')).toBeTypeOf('boolean')
    expect(flags.enabled('v3Checkout')).toBe(true)
    expect(flags.enabled('unknownFlag')).toBe(false)
  })

  it('should throw if fetch fails', async () => {
    vi.stubGlobal('fetch', async () => ({
      ok: false,
      status: 500,
    })) as typeof fetch

    await expect(() =>
      TinyFlags.load('https://example.org/flags.json')
    ).rejects.toThrow('Failed to load flags')
  })

  it('should throw if the response is not valid JSON', async () => {
    vi.stubGlobal('fetch', async () => ({
      ok: true,
      json: async () => 123,
    })) as typeof fetch

    await expect(() =>
      TinyFlags.load('https://example.org/flags.json')
    ).rejects.toThrow('Invalid flag JSON format')
  })
})
