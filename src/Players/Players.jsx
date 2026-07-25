import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchPlayer, searchPlayers } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import UniversePicker from '../components/UniversePicker';
import { filterByStatus } from '../components/status';
import PlayerSearch from './components/PlayerSearch';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';

function Players() {
	const { t } = useI18n();
	const [selection, setSelection] = useState({ lang: '', universe: '' });
	const [search, setSearch] = useState('');
	const [statuses, setStatuses] = useState([]);
	const [playerId, setPlayerId] = useState(null);

	const canSearch = Boolean(selection.universe && search);

	const results = useApiData(
		canSearch ? (signal) => searchPlayers({ ...selection, search }, { signal }) : null,
		[selection.universe, selection.lang, search],
	);

	const detail = useApiData(
		playerId ? (signal) => fetchPlayer({ ...selection, id: playerId }, { signal }) : null,
		[selection.universe, selection.lang, playerId],
	);

	// A player id only means something in the universe it was found in, and a
	// new search makes the previous selection stale.
	function handleUniverse(next) {
		setSelection(next);
		setPlayerId(null);
	}

	function handleSearch(next) {
		setSearch(next);
		setPlayerId(null);
	}

	function handleToggleStatus(key) {
		setStatuses((prev) =>
			prev.includes(key) ? prev.filter((status) => status !== key) : [...prev, key],
		);
	}

	const players = useMemo(
		() => filterByStatus(results.data?.players, statuses),
		[results.data, statuses],
	);

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
					<h2 className="section-title">{t('pl.step.search')}</h2>
				</div>
				<p className="help">{t('pl.step.search.help')}</p>
				<PlayerSearch
					onSearch={handleSearch}
					statuses={statuses}
					onToggleStatus={handleToggleStatus}
				/>

				{results.loading && <p className="help">{t('pl.loading')}</p>}
				{results.error && (
					<p className="api-error" role="alert">
						{t('pl.error.search')}{' '}
						<span className="api-error-detail">{results.error.message}</span>
					</p>
				)}
				{results.data && (
					<PlayerList
						players={players}
						total={results.data.total}
						selectedId={playerId}
						onSelect={setPlayerId}
					/>
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
						<p className="result-empty">
							{canSearch ? t('pl.detail.pick') : t('pl.detail.searchFirst')}
						</p>
					</div>
				)
			)}
		</>
	);
}

export default Players;
