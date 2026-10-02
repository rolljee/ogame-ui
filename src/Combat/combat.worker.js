// Runs the battles off the main thread, so a big fight never freezes the page.
// Results come back in batches, with the share done, then the averages.

import { runBattles, summariseBattles } from './formulas';

// Small enough to report progress often, big enough not to flood the page.
const BATCH = 10;

self.onmessage = ({ data: { battle, seed } }) => {
	try {
		const results = [];
		while (results.length < battle.runs) {
			const count = Math.min(BATCH, battle.runs - results.length);
			results.push(...runBattles(battle, seed, results.length, count));
			self.postMessage({ type: 'progress', done: results.length / battle.runs });
		}
		self.postMessage({ type: 'done', stats: summariseBattles(results) });
	} catch (error) {
		self.postMessage({ type: 'error', message: error.message });
	}
};
