import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useUniverse } from '../universe/UniverseContext';
import { Group, ToolGrid } from '../components/Layout';
import { computeMoonLock } from './formulas';
import CoordinatesInput from './components/CoordinatesInput';
import MoonLockResult from './components/MoonLockResult';

function MoonLock() {
	const { t } = useI18n();
	const { selection } = useUniverse();
	const [coordinates, setCoordinates] = useState('');

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const result = useMemo(() => computeMoonLock({ data, coordinates }), [data, coordinates]);

	return (
		<ToolGrid
			settings={
				<Group title={t('ml.step.coords')} help={t('ml.step.coords.help')}>
					<CoordinatesInput
						value={coordinates}
						onChange={setCoordinates}
						galaxies={data ? Number(data.galaxies) : undefined}
						systems={data ? Number(data.systems) : undefined}
					/>
				</Group>
			}
			report={
				<>
					{loading && <p className="help">{t('srv.loading')}</p>}
					{error && (
						<p className="api-error" role="alert">
							{t('srv.error.data')} <span className="api-error-detail">{error.message}</span>
						</p>
					)}
					<MoonLockResult result={result} />
				</>
			}
		/>
	);
}

export default MoonLock;
