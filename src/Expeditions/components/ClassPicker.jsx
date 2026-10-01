import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { CLASSES } from '../formulas';

// The character class: the Discoverer's finds grow with the economy speed and
// the class bonus, the Collector carries more, the General changes nothing here.
function ClassPicker({ value, onChange }) {
	const { t } = useI18n();
	return (
		<div className="chips" role="group" aria-label={t('exp.class.label')}>
			{CLASSES.map((key) => (
				<button
					key={key}
					type="button"
					className={`chip ${key === value ? 'is-active' : ''}`}
					aria-pressed={key === value}
					onClick={() => onChange(key)}
				>
					{t(`exp.class.${key}`)}
				</button>
			))}
		</div>
	);
}

export default ClassPicker;
