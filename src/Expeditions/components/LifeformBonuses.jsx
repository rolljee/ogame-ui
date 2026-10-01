import React, { useId } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { BONUS_FIELDS, INFO_FIELDS } from '../formulas';

function PercentField({ field, value, onChange }) {
	const { t } = useI18n();
	const id = useId();

	return (
		<div className="mini-field exp-bonus">
			<label htmlFor={id}>{t(`exp.lf.${field}`)}</label>
			<span className="exp-bonus-input">
				<input
					id={id}
					type="text"
					inputMode="decimal"
					autoComplete="off"
					placeholder="0"
					value={value}
					onChange={(e) => onChange(field, e.target.value.replace(/[^\d.,]/g, ''))}
				/>
				<span aria-hidden="true">%</span>
			</span>
		</div>
	);
}

// The totals of the in-game lifeform bonus page. The Discoverer enhancement is
// only asked of a Discoverer, the one class it amplifies.
function LifeformBonuses({ values, onChange, characterClass }) {
	const { t } = useI18n();
	const fields = BONUS_FIELDS.filter((field) => field !== 'explorer' || characterClass === 'explorer');
	const hasInfo = INFO_FIELDS.some((field) => values[field]);

	return (
		<div className="exp-lifeform">
			<div className="exp-bonus-grid">
				{fields.map((field) => (
					<PercentField key={field} field={field} value={values[field] ?? ''} onChange={onChange} />
				))}
			</div>

			<details className="disclosure" open={hasInfo}>
				<summary>{t('exp.lf.info')}</summary>
				<p className="help">{t('exp.lf.info.help')}</p>
				<div className="exp-bonus-grid">
					{INFO_FIELDS.map((field) => (
						<PercentField key={field} field={field} value={values[field] ?? ''} onChange={onChange} />
					))}
				</div>
			</details>
		</div>
	);
}

export default LifeformBonuses;
