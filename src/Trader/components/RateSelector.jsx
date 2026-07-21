import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RATES } from '../../components/constants';
import { RESOURCE_ORDER, RESOURCE_META } from '../resources';

// The rate string is metal:crystal:deut, which matches RESOURCE_ORDER indices.
function RateSelector({ rate, onChange }) {
	const { t } = useI18n();
	const parts = rate.split(':');
	const isPreset = RATES.some((r) => r.rate === rate);

	function setPart(index, val) {
		const next = [...parts];
		next[index] = val;
		onChange(next.join(':'));
	}

	return (
		<>
			<div className="chips">
				{RATES.map(({ rate: preset }) => (
					<button
						key={preset}
						type="button"
						className={`chip ${preset === rate ? 'is-active' : ''}`}
						onClick={() => onChange(preset)}
					>
						{preset.replace(/:/g, ' : ')}
					</button>
				))}
			</div>

			<details className="disclosure" open={!isPreset}>
				<summary>{t('step.rate.custom')}</summary>
				<div className="rate-inputs">
					{RESOURCE_ORDER.map((resource, index) => {
						const meta = RESOURCE_META[resource];
						return (
							<div className="mini-field" key={resource} style={{ '--res-color': meta.color }}>
								<label>
									<span className="res-dot" />
									{t(meta.labelKey)}
								</label>
								<input
									type="number"
									min="0"
									step="0.1"
									value={parts[index] ?? ''}
									onChange={(e) => setPart(index, e.target.value)}
								/>
							</div>
						);
					})}
				</div>
			</details>
		</>
	);
}

export default RateSelector;
