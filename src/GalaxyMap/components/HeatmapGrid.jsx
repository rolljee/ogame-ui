import React from 'react';

import { useI18n } from '../../i18n/I18nContext';
import { axisTicks, HEAT_BINS } from '../model';

// The map itself: one row per galaxy, one cell per system, coloured by density.
//
// A universe is up to 7 × 499 cells, too wide for any screen, so the grid
// scrolls horizontally with the galaxy labels pinned to the left. Every cell is
// a button — the map is meant to be clicked to see who lives there, and that
// also makes it reachable with the keyboard. The label doubles as the tooltip
// so hovering and screen-reading say the same thing without a second DOM node
// per cell, which matters at a few thousand of them.
function HeatmapGrid({ map, metric, selected, onSelect, shown = [], onToggleLevel }) {
	const { t } = useI18n();
	const ticks = axisTicks(map.systems);

	return (
		<div className="gm-map">
			<div className="gm-scroll">
				<div className="gm-rows">
					{map.rows.map((row) => (
						<div className="gm-row" key={row.galaxy}>
							<span className="gm-row-label">G{row.galaxy}</span>
							<div className="gm-cells" style={{ '--gm-systems': map.systems }}>
								{row.cells.map((cell) => {
									const isSelected =
										selected &&
										selected.galaxy === cell.galaxy &&
										selected.system === cell.system;
									const label = t(`gm.cell.${metric}`, {
										coords: `${cell.galaxy}:${cell.system}`,
										planets: cell.planets,
										players: cell.players,
										inactive: cell.inactive,
										moons: cell.moons,
									});
									return (
										<button
											key={cell.system}
											type="button"
											className={`gm-cell gm-level-${cell.level}${isSelected ? ' is-selected' : ''}${
												shown.length && !shown.includes(cell.level) ? ' is-dimmed' : ''
											}`}
											aria-pressed={Boolean(isSelected)}
											aria-label={label}
											title={label}
											onClick={() =>
												onSelect({ galaxy: cell.galaxy, system: cell.system })
											}
										/>
									);
								})}
							</div>
						</div>
					))}

					{/* The axis lives inside the scrolled area so its ticks stay under
					    the systems they label. */}
					<div className="gm-row gm-axis">
						<span className="gm-row-label" aria-hidden="true" />
						<div className="gm-cells" style={{ '--gm-systems': map.systems }}>
							{ticks.map((system) => (
								<span
									key={system}
									className="gm-tick"
									style={{ gridColumn: `${system} / span 1` }}
								>
									{system}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Each shade covers its own range of values, so the legend names them.
			    Its entries double as a filter: picking some fades every other
			    system, so the map keeps its shape. */}
			<div className="gm-legend" role="group" aria-label={t('gm.legend.label')}>
				{[{ level: 0, label: t('gm.legend.empty') }, ...HEAT_BINS.map(({ level, min, max }) => ({
					level,
					label: min === max ? String(min) : `${min}–${max}`,
				}))].map(({ level, label }) => (
					<button
						key={level}
						type="button"
						className={`gm-legend-item${shown.includes(level) ? ' is-active' : ''}`}
						aria-pressed={shown.includes(level)}
						title={t('gm.legend.count', { count: map.levels[level] })}
						onClick={() => onToggleLevel?.(level)}
					>
						<span className={`gm-legend-swatch gm-level-${level}`} />
						{label}
					</button>
				))}
				<span className="gm-legend-unit">{t(`gm.legend.unit.${metric}`)}</span>
			</div>
		</div>
	);
}

export default HeatmapGrid;
