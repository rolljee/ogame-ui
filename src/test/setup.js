import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount anything a test rendered, so the DOM never leaks between tests.
afterEach(() => {
	cleanup();
	localStorage.clear();
});
