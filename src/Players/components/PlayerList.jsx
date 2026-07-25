import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { describeStatus } from '../model';

function StatusBadges({ status }) {
	const { t } = useI18n();
	return (
		<span className="pl-badges">
			{describeStatus(status).map(({ key, labelKey, icon }) => (
				<span key={key} className={`pl-badge pl-badge-${key}`}>
					<span aria-hidden="true">{icon}</span> {t(labelKey)}
				</span>
			))}
		</span>
	);
}

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
							<span className="pl-row-name">{player.name}</span>
							<StatusBadges status={player.status} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default PlayerList;
