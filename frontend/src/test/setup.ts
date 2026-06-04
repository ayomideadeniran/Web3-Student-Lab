import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { webcrypto } from 'node:crypto';

// Polyfill window.crypto with Node's webcrypto so crypto.subtle is available in jsdom
Object.defineProperty(window, 'crypto', {
  configurable: true,
  value: webcrypto,
});

// Polyfill window.indexedDB from globalThis (set by fake-indexeddb/auto)
if (typeof (globalThis as any).indexedDB !== 'undefined') {
  Object.defineProperty(window, 'indexedDB', {
    configurable: true,
    writable: true,
    value: (globalThis as any).indexedDB,
  });
}

Object.defineProperty(window.navigator, 'clipboard', {
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
