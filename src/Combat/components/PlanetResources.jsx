import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import { RESOURCE_META } from '../../Trader/resources';
import ResourceIcon from '../../components/ResourceIcon';

// The site keys deuterium as `deut`, the library as `deuterium`.
const FIELDS = [
	{ key: 'metal', resource: 'metal' },
	{ key: 'crystal', resource: 'crystal' },
	{ key: 'deuterium', resource: 'deut' },
];

function PlanetResources({ values, onChange }) {
	const { t } = useI18n();

	return (
		<div className="cs-resources">
			{FIELDS.map(({ key, resource }) => {
				const meta = RESOURCE_META[resource];
				const inputId = `cs-res-${key}`;
				return (
					<div className="mini-field" key={key} style={{ '--res-color': meta.color }}>
						<label htmlFor={inputId}>
							<ResourceIcon resource={resource} size={14} />
							{t(meta.labelKey)}
						</label>
						<input
							id={inputId}
							type="text"
							inputMode="numeric"
							autoComplete="off"
							placeholder="0"
							value={groupDigits(values[key] ?? '')}
							onChange={(e) => onChange(key, e.target.value.replace(/\D/g, ''))}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default PlanetResources;
