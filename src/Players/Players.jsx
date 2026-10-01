import React, { useEffect, useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchPlayer, fetchRoster } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useDataAge, useUniverse } from '../universe/UniverseContext';
import { Group, NeedsUniverse, ToolGrid } from '../components/Layout';
import { coordsAge, filterRoster, sortRoster } from './model';
import PlayerFilters from './components/PlayerFilters';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';

const NO_FILTERS = { query: '', galaxy: '', system: '', statuses: [], sort: 'name' };

function Players() {
	const { t } = useI18n();
	const { selection } = useUniverse();
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
	useEffect(() => setPlayerId(null), [selection.universe, selection.lang]);

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
	useDataAge(age);

	return (
		<ToolGrid
			layout="data"
			settings={
				<Group
					title={t('pl.step.filter')}
					// universe.xml is regenerated every few days: the header stamps its
					// age, and the help says what that means for the positions.
					help={
						age === null
							? t('pl.step.filter.help')
							: `${t('pl.step.filter.help')} ${t('pl.coords.age', { hours: age })}`
					}
				>
					<NeedsUniverse>
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
					</NeedsUniverse>
				</Group>
			}
			report={
				<>
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
								<div className="result-head">
									<h2 className="result-title">{t('pl.detail.title')}</h2>
								</div>
								<p className="result-empty">{t('pl.detail.pick')}</p>
							</div>
						)
					)}
				</>
			}
		/>
	);
}

export default Players;
