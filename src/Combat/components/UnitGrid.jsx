import React from 'react';
import Ogame from 'ogamejs';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import { unitModel } from '../formulas';

// One count field per ship or defense, named as in the game.
function UnitGrid({ ids, counts, onChange, idPrefix }) {
	const { lang } = useI18n();

	return (
		<div className="cs-units">
			{ids.map((id) => {
				const inputId = `${idPrefix}-${id}`;
				return (
					<div className="mini-field" key={id}>
						<label htmlFor={inputId}>{Ogame.i18n.getName(unitModel(id), lang)}</label>
						<input
							id={inputId}
							type="text"
							inputMode="numeric"
							autoComplete="off"
							placeholder="0"
							value={groupDigits(counts[id] ?? '')}
							onChange={(e) => onChange(id, e.target.value.replace(/\D/g, ''))}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default UnitGrid;
