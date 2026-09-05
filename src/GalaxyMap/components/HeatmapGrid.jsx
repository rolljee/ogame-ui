import React from 'react';

import { useI18n } from '../../i18n/I18nContext';
import { axisTicks, HEAT_LEVELS } from '../model';

// The map itself: one row per galaxy, one cell per system, coloured by density.
//
// A universe is up to 7 × 499 cells, too wide for any screen, so the grid
// scrolls horizontally with the galaxy labels pinned to the left. Every cell is
// a button — the map is meant to be clicked to see who lives there, and that
// also makes it reachable with the keyboard. The label doubles as the tooltip
// so hovering and screen-reading say the same thing without a second DOM node
// per cell, which matters at a few thousand of them.
function HeatmapGrid({ map, metric, selected, onSelect }) {
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
											className={`gm-cell gm-level-${cell.level}${isSelected ? ' is-selected' : ''}`}
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

			<div className="gm-legend">
				<span className="gm-legend-label">{t('gm.legend.less')}</span>
				{Array.from({ length: HEAT_LEVELS + 1 }, (_, level) => (
					<span key={level} className={`gm-legend-swatch gm-level-${level}`} />
				))}
				<span className="gm-legend-label">{t('gm.legend.more', { max: map.max })}</span>
			</div>
		</div>
	);
}

export default HeatmapGrid;
