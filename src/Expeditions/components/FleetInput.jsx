import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { MAX_HYPERSPACE_LEVEL } from '../formulas';

// Hyperspace level and the Pathfinder toggle: the two things the player owns in
// this calculation, everything else comes from the universe.
function FleetInput({ hyperspaceLevel, onLevelChange, pathfinder, onPathfinderChange }) {
	const { t } = useI18n();

	function handleLevel(e) {
		onLevelChange(e.target.value.replace(/\D/g, ''));
	}

	return (
		<div className="exp-fleet">
			<label className="field">
				<span className="field-label">
					<span aria-hidden="true">🔭</span>
					{t('exp.hyperspace.label')}
				</span>
				<input
					type="text"
					inputMode="numeric"
					autoComplete="off"
					placeholder="0"
					value={hyperspaceLevel}
					onChange={handleLevel}
					aria-describedby="exp-hyperspace-range"
				/>
			</label>
			<p className="help" id="exp-hyperspace-range">
				{t('exp.hyperspace.range', { max: MAX_HYPERSPACE_LEVEL })}
			</p>

			<label className="exp-toggle">
				<input
					type="checkbox"
					checked={pathfinder}
					onChange={(e) => onPathfinderChange(e.target.checked)}
				/>
				<span>{t('exp.pathfinder')}</span>
			</label>
			<p className="help">{t('exp.pathfinder.help')}</p>
		</div>
	);
}

export default FleetInput;
