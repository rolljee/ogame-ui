import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import UniversePicker from '../components/UniversePicker';
import { computeExpedition } from './formulas';
import FleetInput from './components/FleetInput';
import ExpeditionResult from './components/ExpeditionResult';

function Expeditions() {
	const { t } = useI18n();
	const [selection, setSelection] = useState({ lang: '', universe: '' });
	const [hyperspaceLevel, setHyperspaceLevel] = useState('');
	const [pathfinder, setPathfinder] = useState(true);

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const result = useMemo(
		() => computeExpedition({ data, hyperspaceLevel, pathfinder }),
		[data, hyperspaceLevel, pathfinder],
	);

	return (
		<>
			<p className="calc-intro">{t('exp.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('exp.step.universe')}</h2>
				</div>
				<p className="help">{t('exp.step.universe.help')}</p>
				<UniversePicker value={selection} onChange={setSelection} />
				{loading && <p className="help">{t('srv.loading')}</p>}
				{error && (
					<p className="api-error" role="alert">
						{t('srv.error.data')} <span className="api-error-detail">{error.message}</span>
					</p>
				)}
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">2</span>
					<h2 className="section-title">{t('exp.step.fleet')}</h2>
				</div>
				<p className="help">{t('exp.step.fleet.help')}</p>
				<FleetInput
					hyperspaceLevel={hyperspaceLevel}
					onLevelChange={setHyperspaceLevel}
					pathfinder={pathfinder}
					onPathfinderChange={setPathfinder}
				/>
			</section>

			<ExpeditionResult
				result={result}
				universeName={data ? data.name || t('srv.unnamed', { number: data.number }) : ''}
			/>
		</>
	);
}

export default Expeditions;
