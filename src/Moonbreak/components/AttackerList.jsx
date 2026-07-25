import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { MAX_ATTACKERS } from '../formulas';

function AttackerList({ attackers, onChange, onAdd, onRemove }) {
	const { t } = useI18n();

	return (
		<div className="attackers">
			{attackers.map((rip, index) => (
				// Rows are positional: the index *is* the attacker's identity here.
				<div className="attacker-row" key={index}>
					<label className="mini-field">
						<span>{t('mb.attacker', { n: index + 1 })}</span>
						<input
							type="text"
							inputMode="numeric"
							autoComplete="off"
							placeholder="0"
							value={rip}
							onChange={(e) => onChange(index, e.target.value.replace(/\D/g, ''))}
						/>
					</label>
					{attackers.length > 1 && (
						<button
							type="button"
							className="attacker-remove"
							aria-label={t('mb.attacker.remove', { n: index + 1 })}
							onClick={() => onRemove(index)}
						>
							✕
						</button>
					)}
				</div>
			))}

			{attackers.length < MAX_ATTACKERS && (
				<button type="button" className="btn btn-ghost" onClick={onAdd}>
					{t('mb.attacker.add')}
				</button>
			)}
		</div>
	);
}

export default AttackerList;
