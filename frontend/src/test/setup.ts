import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { afterEach, vi } from 'vitest';

Object.defineProperty(window, 'crypto', {
  configurable: true,
  value: globalThis.crypto,
});

Object.defineProperty(window.navigator, 'clipboard', {
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

afterEach(() => {
  vi.restoreAllMocks();
  indexedDB.deleteDatabase('web3-student-lab-p2p-crypto');
});
