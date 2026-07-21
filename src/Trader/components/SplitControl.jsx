import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RESOURCE_META } from '../resources';
import ResourceIcon from '../../components/ResourceIcon';

function SplitControl({ others, percents, onChange }) {
	const { t } = useI18n();
	return (
		<div className="split">
			{others.map((resource) => {
				const meta = RESOURCE_META[resource];
				const value = percents[resource] || 0;
				return (
					<div
						className="split-row"
						key={resource}
						style={{ '--res-color': meta.color, '--pct': `${value}%` }}
					>
						<span className="field-label">
							<ResourceIcon resource={resource} size={20} />
							{t(meta.labelKey)}
						</span>
						<input
							type="range"
							className="slider"
							min="0"
							max="100"
							value={value}
							onChange={(e) => onChange(resource, Number(e.target.value))}
							aria-label={t(meta.labelKey)}
						/>
						<span className="split-value">{value}%</span>
					</div>
				);
			})}
		</div>
	);
}

export default SplitControl;
