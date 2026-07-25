import { useState, useEffect } from 'react';

// Minimal async-data hook for the proxy client. `load(signal)` runs whenever
// `deps` change; the in-flight request is aborted on change and on unmount, so
// a slow answer can never overwrite a newer one.
//
// Pass `load = null` when there is nothing to load yet (no universe picked).
export function useApiData(load, deps) {
	const [state, setState] = useState({ data: null, error: null, loading: false });

	useEffect(() => {
		if (!load) {
			setState({ data: null, error: null, loading: false });
			return undefined;
		}

		const controller = new AbortController();
		let current = true;
		setState({ data: null, error: null, loading: true });

		load(controller.signal).then(
			(data) => {
				if (current) setState({ data, error: null, loading: false });
			},
			(error) => {
				// An abort is our own doing, not a failure to report.
				if (!current || error.name === 'AbortError') return;
				setState({ data: null, error, loading: false });
			},
		);

		return () => {
			current = false;
			controller.abort();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return state;
}
