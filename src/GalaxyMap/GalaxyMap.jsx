import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchRoster, fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import UniversePicker from '../components/UniversePicker';
import { coordsAge } from '../Players/model';
import { buildHeatmap, describeSystem } from './model';
import HeatmapControls from './components/HeatmapControls';
import HeatmapGrid from './components/HeatmapGrid';
import SystemDetail from './components/SystemDetail';

// A heatmap of where an universe's players actually live: one row per galaxy,
// one cell per system, shaded by how crowded it is.
//
// It reuses the roster the players view already fetches — the one document that
// carries everyone's coordinates — and aggregates it in the browser, so the
// whole map costs a single request.
function GalaxyMap() {
	const { t } = useI18n();
	const [selection, setSelection] = useState({ lang: '', universe: '' });
	const [metric, setMetric] = useState('planets');
	const [statuses, setStatuses] = useState([]);
	const [system, setSystem] = useState(null);

	const roster = useApiData(
		selection.universe ? (signal) => fetchRoster(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	// Only for the grid's bounds: a galaxy nobody lives in still has to be drawn,
	// or the map would silently shrink to the occupied part of the universe.
	const server = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	function handleUniverse(next) {
		setSelection(next);
		setSystem(null);
	}

	function handleToggleStatus(key) {
		setStatuses((prev) =>
			prev.includes(key) ? prev.filter((status) => status !== key) : [...prev, key],
		);
	}

	const map = useMemo(
		() =>
			roster.data
				? buildHeatmap(roster.data.players, {
						galaxies: server.data?.galaxies,
						systems: server.data?.systems,
						statuses,
						metric,
					})
				: null,
		[roster.data, server.data, statuses, metric],
	);

	const rows = useMemo(
		() =>
			roster.data && system
				? describeSystem(roster.data.players, { ...system, statuses, ...selection })
				: [],
		[roster.data, system, statuses, selection],
	);

	const age = coordsAge(roster.data?.coordsTimestamp);

	return (
		<>
			<p className="calc-intro">{t('gm.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('gm.step.universe')}</h2>
				</div>
				<p className="help">{t('gm.step.universe.help')}</p>
				<UniversePicker value={selection} onChange={handleUniverse} />
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">2</span>
					<h2 className="section-title">{t('gm.step.map')}</h2>
				</div>
				<p className="help">{t('gm.step.map.help')}</p>

				{roster.loading && <p className="help">{t('gm.loading')}</p>}
				{roster.error && (
					<p className="api-error" role="alert">
						{t('gm.error.roster')}{' '}
						<span className="api-error-detail">{roster.error.message}</span>
					</p>
				)}

				{map && (
					<>
						<HeatmapControls
							metric={metric}
							statuses={statuses}
							onMetric={setMetric}
							onToggleStatus={handleToggleStatus}
						/>
						<HeatmapGrid
							map={map}
							metric={metric}
							selected={system}
							onSelect={setSystem}
						/>
						<p className="help gm-summary">
							{t('gm.summary', {
								planets: map.positioned,
								galaxies: map.galaxies,
								systems: map.systems,
							})}
						</p>
						{/* universe.xml is regenerated every few days: the same caveat as
						    the players view, for the same coordinates. */}
						{age !== null && <p className="help pl-coords-age">{t('pl.coords.age', { hours: age })}</p>}
					</>
				)}
			</section>

			{map && <SystemDetail system={system} rows={rows} />}
		</>
	);
}

export default GalaxyMap;
