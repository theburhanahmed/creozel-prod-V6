// Dev-Rules §Testing Standards: Hook Tests
import { renderHook, act } from '@testing-library/react-hooks';
import { useRepurpose } from '../useReport';

// Mock the global fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockResponse = {
  id: 'rep-123',
  status: 'completed',
  result: {
    twitter: 'Repurposed content for Twitter',
    linkedin: 'Repurposed content for LinkedIn'
  }
};

describe('useRepurpose', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
  });

  it('should make a POST request to the repurpose API', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRepurpose());
    
    const contentId = 'content-123';
    const config = {
      targetPlatforms: ['twitter', 'linkedin'],
      tone: 'professional',
      includeHashtags: true,
      includeEmojis: false,
    };

    await act(async () => {
      const promise = result.current.repurpose(contentId, config);
      await waitForNextUpdate();
      return promise;
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/repurpose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentId,
        config,
      }),
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to repurpose content';
    mockFetch.mockReset();
    mockFetch.mockRejectedValueOnce(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useRepurpose());
    
    await act(async () => {
      try {
        await result.current.repurpose('content-123', {
          targetPlatforms: ['twitter'],
          includeHashtags: true,
          includeEmojis: false,
        });
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
      await waitForNextUpdate();
    });

    expect(result.current.error?.message).toBe(errorMessage);
  });
});
