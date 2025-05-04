import { stableHash } from './hash'
import type { FlagSet, FlagContext } from './types.ts'

export class TinyFlags {
  private flags: FlagSet
  private context: FlagContext

  constructor(flags: FlagSet, context: FlagContext = {}) {
    this.flags = flags
    this.context = context
  }

  enabled(flagName: string): boolean {
    const def = this.flags[flagName]
    if (!def) return false

    const { enabled, rollout } = def
    const { userId } = this.context

    if (rollout != null && userId) {
      return this.rolloutCheck(rollout, userId)
    }

    return enabled
  }

  static async load(
    url: string,
    context: FlagContext = {}
  ): Promise<TinyFlags> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to load flags`)
    const json: unknown = await res.json()

    if (typeof json !== 'object' || json === null) {
      throw new Error(`Invalid flag JSON format`)
    }

    return new TinyFlags(json as FlagSet, context)
  }

  private rolloutCheck(percent: number, userId: string): boolean {
    const bucket = stableHash(userId) % 100
    return bucket < percent
  }
}
