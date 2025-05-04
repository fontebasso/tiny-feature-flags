/**
 * Represents the context used when evaluating flags,
 * such as a user identifier and optional traits.
 */
export interface FlagContext {
  userId?: string
  traits?: Record<string, string>
}

/**
 * Defines a single feature flag.
 * `enabled` sets the base state of the flag.
 * `rollout` enables gradual activation (percentage of users based on userId).
 */
export interface FlagDefinition {
  enabled: boolean
  rollout?: number // 0–100
}

/**
 * A collection of flags indexed by name.
 */
export type FlagSet = Record<string, FlagDefinition>

/**
 * The final result of an evaluated flag.
 */
export type FlagValue = boolean
