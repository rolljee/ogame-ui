import React, { useEffect, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchAlliance, searchAlliances } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useUniverse } from '../universe/UniverseContext';
import { Group, NeedsUniverse, ToolGrid } from '../components/Layout';
import AllianceSearch from './components/AllianceSearch';
import AllianceList from './components/AllianceList';
import AllianceDetail from './components/AllianceDetail';

function Alliances() {
	const { t } = useI18n();
	const { selection } = useUniverse();
	const [search, setSearch] = useState('');
	const [allianceId, setAllianceId] = useState(null);
	const [statuses, setStatuses] = useState([]);

	const canSearch = Boolean(selection.universe && search);

	const results = useApiData(
		canSearch ? (signal) => searchAlliances({ ...selection, search }, { signal }) : null,
		[selection.universe, selection.lang, search],
	);

	const detail = useApiData(
		allianceId ? (signal) => fetchAlliance({ ...selection, id: allianceId }, { signal }) : null,
		[selection.universe, selection.lang, allianceId],
	);

	// An alliance id only means something in the universe it was found in, and a
	// new search makes the previous selection stale.
	useEffect(() => setAllianceId(null), [selection.universe, selection.lang]);

	function handleSearch(next) {
		setSearch(next);
		setAllianceId(null);
	}

	function handleToggleStatus(key) {
		setStatuses((prev) =>
			prev.includes(key) ? prev.filter((status) => status !== key) : [...prev, key],
		);
	}

	return (
		<ToolGrid
			layout="data"
			settings={
				<Group title={t('al.step.search')} help={t('al.step.search.help')}>
					<AllianceSearch onSearch={handleSearch} />
					<NeedsUniverse>

						{results.loading && <p className="help">{t('al.loading')}</p>}
						{results.error && (
							<p className="api-error" role="alert">
								{t('al.error.search')}{' '}
								<span className="api-error-detail">{results.error.message}</span>
							</p>
						)}
						{results.data && (
							<AllianceList
								alliances={results.data.alliances}
								total={results.data.total}
								selectedId={allianceId}
								onSelect={setAllianceId}
							/>
						)}
					</NeedsUniverse>
				</Group>
			}
			report={
				<>
					{detail.loading && <p className="help">{t('al.loading.detail')}</p>}
					{detail.error && (
						<p className="api-error" role="alert">
							{t('al.error.detail')}{' '}
							<span className="api-error-detail">{detail.error.message}</span>
						</p>
					)}
					{detail.data ? (
						<AllianceDetail
							alliance={detail.data}
							statuses={statuses}
							onToggleStatus={handleToggleStatus}
						/>
					) : (
						!detail.loading && (
							<div className="result">
								<div className="result-head">
									<h2 className="result-title">{t('al.detail.title')}</h2>
								</div>
								<p className="result-empty">
									{canSearch ? t('al.detail.pick') : t('al.detail.searchFirst')}
								</p>
							</div>
						)
					)}
				</>
			}
		/>
	);
}

export default Alliances;
