import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { MAX_POSITION } from '../formulas';

function CoordinatesInput({ value, onChange, galaxies, systems }) {
	const { t } = useI18n();

	return (
		<div className="ml-coords">
			<label className="field">
				<span className="field-label">
					<span aria-hidden="true">📍</span>
					{t('ml.coords.label')}
				</span>
				<input
					type="text"
					inputMode="numeric"
					autoComplete="off"
					placeholder="1:1:1"
					value={value}
					// Coordinates are three numbers and two colons, nothing else.
					onChange={(e) => onChange(e.target.value.replace(/[^\d:]/g, ''))}
					aria-describedby="ml-coords-range"
				/>
			</label>
			<p className="help" id="ml-coords-range">
				{galaxies && systems
					? t('ml.coords.range', { galaxies, systems, positions: MAX_POSITION })
					: t('ml.coords.help')}
			</p>
		</div>
	);
}

export default CoordinatesInput;
