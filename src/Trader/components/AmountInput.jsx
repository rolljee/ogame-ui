import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RESOURCE_META } from '../resources';
import ResourceIcon from '../../components/ResourceIcon';

// Group a digits-only string into thousands with dots (1000000 -> 1.000.000).
function groupDigits(raw) {
	return String(raw).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function AmountInput({ resource, value, onChange }) {
	const { t } = useI18n();
	const meta = RESOURCE_META[resource];

	function handleChange(e) {
		// Keep only digits; the parent stores the raw numeric string.
		const raw = e.target.value.replace(/\D/g, '');
		onChange(raw);
	}

	return (
		<label className="field" style={{ '--res-color': meta.color }}>
			<span className="field-label">
				<ResourceIcon resource={resource} size={22} />
				{t(meta.labelKey)}
			</span>
			<input
				type="text"
				inputMode="numeric"
				autoComplete="off"
				placeholder="0"
				value={value === '' ? '' : groupDigits(value)}
				onChange={handleChange}
			/>
		</label>
	);
}

export default AmountInput;
