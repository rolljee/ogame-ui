import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

function AllianceList({ alliances, total, selectedId, onSelect }) {
	const { t } = useI18n();

	if (alliances.length === 0) {
		return <p className="help">{t('al.list.empty')}</p>;
	}

	return (
		<div className="pl-list">
			<p className="help">
				{/* `total` counts the matches upstream, the list itself is capped at 50. */}
				{t('al.list.count', { shown: alliances.length, total })}
			</p>
			<ul>
				{alliances.map((alliance) => (
					<li key={alliance.id}>
						<button
							type="button"
							className={`pl-row ${alliance.id === selectedId ? 'is-active' : ''}`}
							aria-pressed={alliance.id === selectedId}
							onClick={() => onSelect(alliance.id)}
						>
							<span className="pl-row-name">
								<span className="al-tag">[{alliance.tag}]</span> {alliance.name}
							</span>
							<span className="al-count">
								{t('al.list.members', { count: alliance.memberCount })}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default AllianceList;
