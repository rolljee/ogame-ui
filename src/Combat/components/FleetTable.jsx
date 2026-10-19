import React from 'react';
import Ogame from 'ogamejs';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import { ATTACKER_SHIPS, DEFENDER_SHIPS, TECHS, typedCount, unitModel } from '../formulas';

const SIDES = ['attacker', 'defender'];

// The attacker's hyperspace level only sets its cargo, for the loot.
const TECH_ROWS = [...TECHS.map((tech) => ({ key: tech, sides: SIDES })), { key: 'hyperspace', sides: ['attacker'] }];

const SHIP_ROWS = DEFENDER_SHIPS.map((id) => ({
	key: id,
	sides: ATTACKER_SHIPS.includes(id) ? SIDES : ['defender'],
}));

// A number cell. Its name is read from its row and column headers, as a
// screen reader would read the table: "Deathstar Attacker".
export function CountCell({ id, labelledBy, value, onChange, grouped = true }) {
	return (
		<td>
			<input
				id={id}
				className="cs-count"
				type="text"
				inputMode="numeric"
				autoComplete="off"
				placeholder="0"
				aria-labelledby={labelledBy}
				value={grouped ? groupDigits(value ?? '') : (value ?? '')}
				onChange={(e) => onChange(typedCount(e.target.value))}
				onFocus={(e) => e.target.select()}
			/>
		</td>
	);
}

function isSet(value) {
	return Number(value) > 0;
}

// Both fleets face each other in one table: one row per technology or ship,
// one column per side, as players read a combat report.
function FleetTable({ attacker, defender, onChange, onClear }) {
	const { t, lang } = useI18n();
	const sides = { attacker, defender };

	function rows(list, part, label, grouped) {
		return list.map(({ key, sides: present }) => {
			const rowId = `cs-${part}-${key}`;
			const set = present.some((side) => isSet(sides[side][part][key]));
			return (
				<tr key={key} className={set ? 'is-set' : undefined}>
					<th scope="row" id={rowId}>
						{label(key)}
					</th>
					{SIDES.map((side) =>
						present.includes(side) ? (
							<CountCell
								key={side}
								id={`${rowId}-${side}`}
								labelledBy={`${rowId} cs-col-${side}`}
								value={sides[side][part][key]}
								grouped={grouped}
								onChange={(value) => onChange(side, part, key, value)}
							/>
						) : (
							<td key={side} className="cs-none" />
						),
					)}
				</tr>
			);
		});
	}

	return (
		<table className="cs-grid">
			<colgroup>
				<col />
				<col className="cs-grid-side" />
				<col className="cs-grid-side" />
			</colgroup>
			<thead>
				<tr>
					<td />
					{SIDES.map((side) => (
						<th scope="col" key={side}>
							<span className="cs-col-head">
								<span id={`cs-col-${side}`}>{t(`cs.side.${side}`)}</span>
								<button
									type="button"
									className="cs-clear"
									onClick={() => onClear(side)}
									aria-label={t(`cs.clear.${side}`)}
									title={t(`cs.clear.${side}`)}
								>
									{t('cs.clear')}
								</button>
							</span>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				<tr className="cs-section">
					<th scope="rowgroup" colSpan={3}>
						{t('cs.techs')}
					</th>
				</tr>
				{rows(TECH_ROWS, 'techs', (key) => t(`cs.tech.${key}`), false)}
			</tbody>
			<tbody>
				<tr className="cs-section">
					<th scope="rowgroup" colSpan={3}>
						{t('cs.ships')}
					</th>
				</tr>
				{rows(SHIP_ROWS, 'ships', (id) => Ogame.i18n.getName(unitModel(id), lang), true)}
			</tbody>
		</table>
	);
}

export default FleetTable;
