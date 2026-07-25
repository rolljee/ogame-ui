import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import UniversePicker from '../components/UniversePicker';
import { computeMoonLock } from './formulas';
import CoordinatesInput from './components/CoordinatesInput';
import MoonLockResult from './components/MoonLockResult';

function MoonLock() {
	const { t } = useI18n();
	const [selection, setSelection] = useState({ lang: '', universe: '' });
	const [coordinates, setCoordinates] = useState('');

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const result = useMemo(() => computeMoonLock({ data, coordinates }), [data, coordinates]);

	return (
		<>
			<p className="calc-intro">{t('ml.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('ml.step.universe')}</h2>
				</div>
				<p className="help">{t('ml.step.universe.help')}</p>
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
					<h2 className="section-title">{t('ml.step.coords')}</h2>
				</div>
				<p className="help">{t('ml.step.coords.help')}</p>
				<CoordinatesInput
					value={coordinates}
					onChange={setCoordinates}
					galaxies={data ? Number(data.galaxies) : undefined}
					systems={data ? Number(data.systems) : undefined}
				/>
			</section>

			<MoonLockResult result={result} />
		</>
	);
}

export default MoonLock;
