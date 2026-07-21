import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RESOURCE_META } from '../resources';
import ResourceIcon from '../../components/ResourceIcon';

function AmountInput({ resource, value, onChange }) {
	const { t } = useI18n();
	const meta = RESOURCE_META[resource];
	return (
		<div className="field" style={{ '--res-color': meta.color }}>
			<span className="field-label">
				<ResourceIcon resource={resource} size={22} />
				{t(meta.labelKey)}
			</span>
			<input
				type="number"
				min="0"
				inputMode="numeric"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}

export default AmountInput;
