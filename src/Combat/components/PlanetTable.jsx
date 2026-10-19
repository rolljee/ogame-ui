import React from 'react';
import Ogame from 'ogamejs';
import { useI18n } from '../../i18n/I18nContext';
import { RESOURCE_META } from '../../Trader/resources';
import ResourceIcon from '../../components/ResourceIcon';
import { DEFENSES, unitModel } from '../formulas';
import { CountCell } from './FleetTable';

// The site keys deuterium as `deut`, the library as `deuterium`.
const RESOURCES = [
	{ key: 'metal', resource: 'metal' },
	{ key: 'crystal', resource: 'crystal' },
	{ key: 'deuterium', resource: 'deut' },
];

// What stays on the defender's planet: its defenses and the resources a
// winning attacker can carry away.
function PlanetTable({ defenses, resources, onDefense, onResource, onClear }) {
	const { t, lang } = useI18n();

	return (
		<table className="cs-grid">
			<colgroup>
				<col />
				<col className="cs-grid-side is-alone" />
			</colgroup>
			<thead>
				<tr>
					<td />
					<th scope="col">
						<span className="cs-col-head">
							<span id="cs-col-planet">{t('cs.side.planet')}</span>
							<button
								type="button"
								className="cs-clear"
								onClick={onClear}
								aria-label={t('cs.clear.planet')}
								title={t('cs.clear.planet')}
							>
								{t('cs.clear')}
							</button>
						</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr className="cs-section">
					<th scope="rowgroup" colSpan={2}>
						{t('cs.defenses')}
					</th>
				</tr>
				{DEFENSES.map((id) => {
					const rowId = `cs-defenses-${id}`;
					return (
						<tr key={id} className={Number(defenses[id]) > 0 ? 'is-set' : undefined}>
							<th scope="row" id={rowId}>
								{Ogame.i18n.getName(unitModel(id), lang)}
							</th>
							<CountCell
								id={`${rowId}-defender`}
								labelledBy={rowId}
								value={defenses[id]}
								onChange={(value) => onDefense(id, value)}
							/>
						</tr>
					);
				})}
			</tbody>
			<tbody>
				<tr className="cs-section">
					<th scope="rowgroup" colSpan={2}>
						{t('cs.resources')}
					</th>
				</tr>
				{RESOURCES.map(({ key, resource }) => {
					const meta = RESOURCE_META[resource];
					const rowId = `cs-res-${key}`;
					return (
						<tr
							key={key}
							className={Number(resources[key]) > 0 ? 'is-set' : undefined}
							style={{ '--res-color': meta.color }}
						>
							<th scope="row" id={rowId}>
								<span className="cs-res-name">
									<ResourceIcon resource={resource} size={14} />
									{t(meta.labelKey)}
								</span>
							</th>
							<CountCell
								id={`${rowId}-defender`}
								labelledBy={rowId}
								value={resources[key]}
								onChange={(value) => onResource(key, value)}
							/>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default PlanetTable;
