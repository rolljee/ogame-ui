import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchPlayer, fetchRoster } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import UniversePicker from '../components/UniversePicker';
import { coordsAge, filterRoster, sortRoster } from './model';
import PlayerFilters from './components/PlayerFilters';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';

const NO_FILTERS = { query: '', galaxy: '', system: '', statuses: [], sort: 'name' };

function Players() {
	const { t } = useI18n();
	const [selection, setSelection] = useState({ lang: '', universe: '' });
	const [filters, setFilters] = useState(NO_FILTERS);
	const [playerId, setPlayerId] = useState(null);

	// The whole roster of the universe, once: filtering then costs nothing, and
	// there is no other way to know where a player lives.
	const roster = useApiData(
		selection.universe ? (signal) => fetchRoster(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const detail = useApiData(
		playerId ? (signal) => fetchPlayer({ ...selection, id: playerId }, { signal }) : null,
		[selection.universe, selection.lang, playerId],
	);

	// A player id only means something in the universe it was found in.
	function handleUniverse(next) {
		setSelection(next);
		setPlayerId(null);
	}

	function handleToggleStatus(key) {
		setFilters((prev) => ({
			...prev,
			statuses: prev.statuses.includes(key)
				? prev.statuses.filter((status) => status !== key)
				: [...prev.statuses, key],
		}));
	}

	const players = useMemo(
		() => sortRoster(filterRoster(roster.data?.players, filters), filters.sort),
		[roster.data, filters],
	);

	const age = coordsAge(roster.data?.coordsTimestamp);

	return (
		<>
			<p className="calc-intro">{t('pl.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('pl.step.universe')}</h2>
				</div>
				<p className="help">{t('pl.step.universe.help')}</p>
				<UniversePicker value={selection} onChange={handleUniverse} />
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">2</span>
					<h2 className="section-title">{t('pl.step.filter')}</h2>
				</div>
				<p className="help">{t('pl.step.filter.help')}</p>

				{roster.loading && <p className="help">{t('pl.loading')}</p>}
				{roster.error && (
					<p className="api-error" role="alert">
						{t('pl.error.roster')}{' '}
						<span className="api-error-detail">{roster.error.message}</span>
					</p>
				)}

				{roster.data && (
					<>
						<PlayerFilters
							filters={filters}
							onChange={setFilters}
							onToggleStatus={handleToggleStatus}
						/>
						{/* universe.xml is regenerated every few days: say how old the
						    positions are rather than let them pass for live. */}
						{age !== null && (
							<p className="help pl-coords-age">{t('pl.coords.age', { hours: age })}</p>
						)}
						<PlayerList
							players={players}
							total={roster.data.total}
							filters={filters}
							selection={selection}
							selectedId={playerId}
							onSelect={setPlayerId}
						/>
					</>
				)}
			</section>

			{detail.loading && <p className="help">{t('pl.loading.detail')}</p>}
			{detail.error && (
				<p className="api-error" role="alert">
					{t('pl.error.detail')}{' '}
					<span className="api-error-detail">{detail.error.message}</span>
				</p>
			)}
			{detail.data ? (
				<PlayerDetail player={detail.data} selection={selection} />
			) : (
				!detail.loading && (
					<div className="result">
						<h2 className="result-title">{t('pl.detail.title')}</h2>
						<p className="result-empty">{t('pl.detail.pick')}</p>
					</div>
				)
			)}
		</>
	);
}

export default Players;
