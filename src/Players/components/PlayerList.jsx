import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import StatusBadges from '../../components/StatusBadges';
import { describeRosterCoords } from '../model';

// A universe holds thousands of players and the roster is filtered in place, so
// the list caps what it paints: the count line always tells the truth about how
// many matched, and a filter is one keystroke away.
export const RENDER_LIMIT = 200;

function Coords({ player, filters, selection }) {
	const { coords, rest } = describeRosterCoords(player, { ...selection, ...filters });
	if (coords.length === 0) return null;

	return (
		<span className="pl-row-coords">
			{coords.map(({ coords: position, url, moon }) =>
				url ? (
					<a
						key={position}
						className="pl-coords"
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						// The row is a button; the link inside it must not toggle it.
						onClick={(event) => event.stopPropagation()}
					>
						[{position}]{moon && <span aria-hidden="true"> 🌑</span>}
					</a>
				) : (
					<span key={position} className="pl-coords">
						[{position}]
					</span>
				),
			)}
			{rest > 0 && <span className="pl-row-more">+{rest}</span>}
		</span>
	);
}

function PlayerList({ players, total, filters, selection, selectedId, onSelect }) {
	const { t } = useI18n();

	if (players.length === 0) {
		return <p className="help">{t('pl.list.empty')}</p>;
	}

	const shown = players.slice(0, RENDER_LIMIT);

	return (
		<div className="pl-list">
			<p className="help">
				{t(players.length > shown.length ? 'pl.list.capped' : 'pl.list.count', {
					shown: shown.length,
					matching: players.length,
					total,
				})}
			</p>
			<ul>
				{shown.map((player) => (
					<li key={player.id}>
						<button
							type="button"
							className={`pl-row ${player.id === selectedId ? 'is-active' : ''}`}
							aria-pressed={player.id === selectedId}
							onClick={() => onSelect(player.id)}
						>
							<span className="pl-row-name">
								{player.name}
								{/* The proxy resolves the alliance id against alliances.xml. */}
								{player.alliance && (
									<span className="pl-row-alliance" title={player.alliance.name}>
										[{player.alliance.tag}]
									</span>
								)}
							</span>
							<Coords player={player} filters={filters} selection={selection} />
							<StatusBadges status={player.status} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default PlayerList;
