import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './client'

describe('apiRequest', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns data from a successful API response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ success: true, data: { id: 'borsch' } }),
      { status: 200 },
    )))

    await expect(apiRequest<{ id: string }>('/api/test')).resolves.toEqual({
      id: 'borsch',
    })
  })

  it('preserves server validation details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: { reason: ['reason is too short'] },
        },
      }),
      { status: 422 },
    )))

    await expect(apiRequest('/api/test')).rejects.toMatchObject({
      status: 422,
      code: 'VALIDATION_ERROR',
      details: { reason: ['reason is too short'] },
    })
  })

  it('converts a fetch failure into a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(apiRequest('/api/test')).rejects.toMatchObject({
      status: 0,
      code: 'NETWORK_ERROR',
    })
  })
})
