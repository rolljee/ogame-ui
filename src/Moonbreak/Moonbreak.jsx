import React, { useState, useMemo } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { computeMoonbreak, MAX_ATTACKERS, MAX_MOON_SIZE } from './formulas';
import MoonSizeInput from './components/MoonSizeInput';
import AttackerList from './components/AttackerList';
import MoonbreakResult from './components/MoonbreakResult';

function Moonbreak() {
	const { t } = useI18n();
	const [moonSize, setMoonSize] = useState(String(MAX_MOON_SIZE));
	const [attackers, setAttackers] = useState(['']);

	function handleAttackerChange(index, value) {
		setAttackers((prev) => prev.map((rip, i) => (i === index ? value : rip)));
	}

	function handleAdd() {
		setAttackers((prev) => (prev.length < MAX_ATTACKERS ? [...prev, ''] : prev));
	}

	function handleRemove(index) {
		setAttackers((prev) => prev.filter((_, i) => i !== index));
	}

	// An empty field reads as 0, which computeMoonbreak already rejects.
	const result = useMemo(
		() => computeMoonbreak({ moonSize, attackers }),
		[moonSize, attackers],
	);

	return (
		<>
			<p className="calc-intro">{t('mb.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('mb.step.size')}</h2>
				</div>
				<p className="help">{t('mb.step.size.help')}</p>
				<MoonSizeInput value={moonSize} onChange={setMoonSize} />
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">2</span>
					<h2 className="section-title">{t('mb.step.attackers')}</h2>
				</div>
				<p className="help">{t('mb.step.attackers.help')}</p>
				<AttackerList
					attackers={attackers}
					onChange={handleAttackerChange}
					onAdd={handleAdd}
					onRemove={handleRemove}
				/>
			</section>

			<MoonbreakResult result={result} />
		</>
	);
}

export default Moonbreak;
