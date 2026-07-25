import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import StatusBadges from '../../components/StatusBadges';

function PlayerList({ players, total, selectedId, onSelect }) {
	const { t } = useI18n();

	if (players.length === 0) {
		return <p className="help">{t('pl.list.empty')}</p>;
	}

	return (
		<div className="pl-list">
			<p className="help">
				{/* `total` counts the matches upstream, the list itself is capped at 50. */}
				{t('pl.list.count', { shown: players.length, total })}
			</p>
			<ul>
				{players.map((player) => (
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
							<StatusBadges status={player.status} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default PlayerList;
