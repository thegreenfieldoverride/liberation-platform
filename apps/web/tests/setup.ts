import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.liberationJourney for real hourly wage tests
Object.defineProperty(window, 'liberationJourney', {
  value: {
    updateMilestone: vi.fn(),
    recordEvent: vi.fn(),
    updateToolInsights: vi.fn(),
  },
  writable: true,
});

// Mock fetch for analytics
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
    text: async () => 'OK',
  } as Response)
);