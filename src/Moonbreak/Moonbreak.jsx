import React, { useState, useMemo } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { computeMoonbreak, describeCurve, MAX_ATTACKERS, MAX_MOON_SIZE } from './formulas';
import MoonSizeInput from './components/MoonSizeInput';
import AttackerList from './components/AttackerList';
import MoonbreakResult from './components/MoonbreakResult';
import MoonbreakCurve from './components/MoonbreakCurve';
import { Group, ToolGrid } from '../components/Layout';

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

	// Only worth computing once the form is usable; the curve reuses the moon
	// size and the number of attackers, and spreads the fleet evenly.
	const curve = useMemo(
		() =>
			result.ok
				? describeCurve({
						moonSize: Number(moonSize),
						attackerCount: result.attackers.length,
						currentRip: result.totalRip,
					})
				: null,
		[result, moonSize],
	);

	return (
		<ToolGrid
			settings={
				<>
					<Group title={t('mb.step.size')} help={t('mb.step.size.help')}>
						<MoonSizeInput value={moonSize} onChange={setMoonSize} />
					</Group>

					<Group title={t('mb.step.attackers')} help={t('mb.step.attackers.help')}>
						<AttackerList
							attackers={attackers}
							onChange={handleAttackerChange}
							onAdd={handleAdd}
							onRemove={handleRemove}
						/>
					</Group>
				</>
			}
			report={
				<>
					<MoonbreakResult result={result} />
					{curve && <MoonbreakCurve curve={curve} attackerCount={result.attackers.length} />}
				</>
			}
		/>
	);
}

export default Moonbreak;
