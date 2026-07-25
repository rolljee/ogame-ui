import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { MIN_MOON_SIZE, MAX_MOON_SIZE } from '../formulas';

function MoonSizeInput({ value, onChange }) {
	const { t } = useI18n();
	const pct = ((Number(value) - MIN_MOON_SIZE) / (MAX_MOON_SIZE - MIN_MOON_SIZE)) * 100;

	function handleChange(e) {
		const raw = e.target.value.replace(/\D/g, '');
		onChange(raw);
	}

	return (
		<div className="moon-size">
			<label className="field">
				<span className="field-label">
					<span aria-hidden="true">🌑</span>
					{t('mb.size.label')}
				</span>
				<input
					type="text"
					inputMode="numeric"
					autoComplete="off"
					placeholder={String(MAX_MOON_SIZE)}
					value={value}
					onChange={handleChange}
					aria-describedby="moon-size-range"
				/>
			</label>
			<input
				type="range"
				className="slider"
				min={MIN_MOON_SIZE}
				max={MAX_MOON_SIZE}
				value={Number(value) || MIN_MOON_SIZE}
				aria-label={t('mb.size.label')}
				style={{ '--pct': `${Math.max(0, Math.min(100, pct))}%` }}
				onChange={(e) => onChange(e.target.value)}
			/>
			<p className="help" id="moon-size-range">
				{t('mb.size.range', { min: MIN_MOON_SIZE, max: MAX_MOON_SIZE })}
			</p>
		</div>
	);
}

export default MoonSizeInput;
