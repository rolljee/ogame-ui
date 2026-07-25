import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApiData } from './useApiData';

describe('useApiData', () => {
	it('reports the loaded data', async () => {
		const { result } = renderHook(() => useApiData(async () => 'payload', []));
		await waitFor(() => expect(result.current.data).toBe('payload'));
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('is loading while the request is in flight', async () => {
		const { result } = renderHook(() => useApiData(() => new Promise(() => {}), []));
		await waitFor(() => expect(result.current.loading).toBe(true));
	});

	it('reports a failure', async () => {
		const boom = new Error('boom');
		const { result } = renderHook(() => useApiData(async () => { throw boom; }, []));
		await waitFor(() => expect(result.current.error).toBe(boom));
		expect(result.current.loading).toBe(false);
	});

	it('does nothing when there is nothing to load', async () => {
		const { result } = renderHook(() => useApiData(null, []));
		expect(result.current).toEqual({ data: null, error: null, loading: false });
	});

	it('aborts the in-flight request when the deps change', async () => {
		const signals = [];
		const load = (signal) => {
			signals.push(signal);
			return new Promise(() => {});
		};
		const { rerender } = renderHook(({ id }) => useApiData(load, [id]), {
			initialProps: { id: 1 },
		});

		rerender({ id: 2 });

		expect(signals).toHaveLength(2);
		expect(signals[0].aborted).toBe(true);
		expect(signals[1].aborted).toBe(false);
	});

	// Without this, picking universe A then B could leave A's settings on screen.
	it('never lets a slow answer overwrite a newer one', async () => {
		let resolveFirst;
		const load = vi
			.fn()
			.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
			.mockImplementationOnce(async () => 'second');

		const { result, rerender } = renderHook(({ id }) => useApiData(load, [id]), {
			initialProps: { id: 1 },
		});

		rerender({ id: 2 });
		await waitFor(() => expect(result.current.data).toBe('second'));

		resolveFirst('first');
		await Promise.resolve();

		expect(result.current.data).toBe('second');
	});

	it('swallows an abort instead of reporting it as an error', async () => {
		const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
		const { result } = renderHook(() => useApiData(async () => { throw abort; }, []));
		await waitFor(() => expect(result.current.loading).toBe(true));
		expect(result.current.error).toBeNull();
	});
});
