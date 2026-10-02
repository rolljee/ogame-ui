import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { TECHS } from '../formulas';

// The three combat technologies, plus any extra level field the side needs
// (hyperspace for the attacker's cargo).
function TechInputs({ levels, onChange, idPrefix, extra }) {
	const { t } = useI18n();

	return (
		<div className="cs-techs">
			{TECHS.map((tech) => {
				const inputId = `${idPrefix}-${tech}`;
				return (
					<div className="mini-field" key={tech}>
						<label htmlFor={inputId}>{t(`cs.tech.${tech}`)}</label>
						<input
							id={inputId}
							type="text"
							inputMode="numeric"
							autoComplete="off"
							placeholder="0"
							value={levels[tech] ?? ''}
							onChange={(e) => onChange(tech, e.target.value.replace(/\D/g, ''))}
						/>
					</div>
				);
			})}
			{extra}
		</div>
	);
}

export default TechInputs;
