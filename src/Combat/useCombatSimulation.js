import { useCallback, useEffect, useRef, useState } from 'react';

import { runBattles, summariseBattles } from './formulas';

function createWorker() {
	if (typeof Worker === 'undefined') return null;
	return new Worker(new URL('./combat.worker.js', import.meta.url), { type: 'module' });
}

// Runs a battle built by `buildBattle` and keeps its averaged outcome. A new
// run stops the one in progress. Where there is no Worker (tests, very old
// browsers), the battles run on the main thread.
export function useCombatSimulation() {
	const [state, setState] = useState({ status: 'idle', progress: 0, stats: null, error: null });
	const workerRef = useRef(null);

	const stop = useCallback(() => {
		workerRef.current?.terminate();
		workerRef.current = null;
	}, []);

	useEffect(() => stop, [stop]);

	const run = useCallback(
		(battle) => {
			stop();
			const seed = Date.now();
			const worker = createWorker();

			if (!worker) {
				try {
					const stats = summariseBattles(runBattles(battle, seed, 0, battle.runs));
					setState({ status: 'done', progress: 1, stats, error: null });
				} catch (error) {
					setState({ status: 'error', progress: 0, stats: null, error: error.message });
				}
				return;
			}

			workerRef.current = worker;
			setState((prev) => ({ ...prev, status: 'running', progress: 0, error: null }));

			worker.onmessage = ({ data }) => {
				if (data.type === 'progress') {
					setState((prev) => ({ ...prev, progress: data.done }));
					return;
				}
				stop();
				setState(
					data.type === 'done'
						? { status: 'done', progress: 1, stats: data.stats, error: null }
						: { status: 'error', progress: 0, stats: null, error: data.message },
				);
			};
			worker.onerror = (event) => {
				stop();
				setState({ status: 'error', progress: 0, stats: null, error: event.message });
			};
			worker.postMessage({ battle, seed });
		},
		[stop],
	);

	return { ...state, run };
}
