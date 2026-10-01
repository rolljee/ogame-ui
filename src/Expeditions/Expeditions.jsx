import React, { useMemo, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useUniverse } from '../universe/UniverseContext';
import { Group, ToolGrid } from '../components/Layout';
import { computeExpedition } from './formulas';
import FleetInput from './components/FleetInput';
import ExpeditionResult from './components/ExpeditionResult';
import ClassPicker from './components/ClassPicker';
import LifeformBonuses from './components/LifeformBonuses';

function Expeditions() {
	const { t } = useI18n();
	const { selection } = useUniverse();
	const [hyperspaceLevel, setHyperspaceLevel] = useState('');
	const [pathfinder, setPathfinder] = useState(true);
	const [characterClass, setCharacterClass] = useState('explorer');
	const [bonuses, setBonuses] = useState({});

	function handleBonus(field, value) {
		setBonuses((prev) => ({ ...prev, [field]: value }));
	}

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const result = useMemo(
		() => computeExpedition({ data, hyperspaceLevel, pathfinder, characterClass, bonuses }),
		[data, hyperspaceLevel, pathfinder, characterClass, bonuses],
	);

	return (
		<ToolGrid
			settings={
				<>
					<Group title={t('exp.step.class')} help={t('exp.step.class.help')}>
						<ClassPicker value={characterClass} onChange={setCharacterClass} />
					</Group>
					<Group title={t('exp.step.fleet')} help={t('exp.step.fleet.help')}>
						<FleetInput
							hyperspaceLevel={hyperspaceLevel}
							onLevelChange={setHyperspaceLevel}
							pathfinder={pathfinder}
							onPathfinderChange={setPathfinder}
						/>
					</Group>
					<Group title={t('exp.step.lifeform')} help={t('exp.step.lifeform.help')}>
						<LifeformBonuses values={bonuses} onChange={handleBonus} characterClass={characterClass} />
					</Group>
				</>
			}
			report={
				<>
					{loading && <p className="help">{t('srv.loading')}</p>}
					{error && (
						<p className="api-error" role="alert">
							{t('srv.error.data')} <span className="api-error-detail">{error.message}</span>
						</p>
					)}
					<ExpeditionResult
						result={result}
						universeName={data ? data.name || t('srv.unnamed', { number: data.number }) : ''}
					/>
				</>
			}
		/>
	);
}

export default Expeditions;
