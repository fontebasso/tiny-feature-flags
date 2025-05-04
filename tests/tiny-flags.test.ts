import { describe, it, expect } from 'vitest'
import { TinyFlags } from '../src/index.js'

const mockFlags = {
  simple: { enabled: true },
  rollout: { enabled: true, rollout: 50 },
}

describe('TinyFlags', () => {
  it('should return true for enabled flag', () => {
    const tf = new TinyFlags(mockFlags)
    expect(tf.enabled('simple')).toBe(true)
  })

  it('should return false for unknown flag', () => {
    const tf = new TinyFlags(mockFlags)
    expect(tf.enabled('doesNotExist')).toBe(false)
  })

  it('should return consistent result for rollout with userId', () => {
    const tf1 = new TinyFlags(mockFlags, { userId: 'user123' })
    const tf2 = new TinyFlags(mockFlags, { userId: 'user123' })
    expect(tf1.enabled('rollout')).toBe(tf2.enabled('rollout'))
  })

  it('should use full range of hash buckets', () => {
    const buckets = new Set()
    for (let i = 0; i < 1000; i++) {
      const id = `user-${i}`
      const tf = new TinyFlags(mockFlags, { userId: id })
      buckets.add(tf.enabled('rollout'))
    }
    expect(buckets.size).toBeGreaterThan(1)
  })
})
