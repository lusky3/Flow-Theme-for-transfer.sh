import '@testing-library/jest-dom/vitest';

// Mock window.__CONFIG__ for tests
window.__CONFIG__ = {
  webAddress: 'https://transfer.sh/',
  hostname: 'transfer.sh',
  gaKey: '',
  emailContact: 'test@example.com',
  maxUploadSize: '10GB',
  purgeTime: '14 days',
  sampleToken: 'abc123',
  sampleToken2: 'def456',
};

// Mock localStorage — jsdom 29+ requires a valid --localstorage-file path
// which is unavailable in the vitest environment, so we provide an in-memory shim.
const localStorageStore: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: (key: string) => localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
  },
  key: (index: number) => Object.keys(localStorageStore)[index] ?? null,
  get length() {
    return Object.keys(localStorageStore).length;
  },
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? false : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
