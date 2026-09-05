import React from 'react';

import { useI18n } from '../../i18n/I18nContext';
import StatusBadges from '../../components/StatusBadges';

// Who lives in the system a cell points at. The map answers "where", this
// answers "who" — the reason a cell is worth clicking at all.
function SystemDetail({ system, rows }) {
	const { t } = useI18n();

	if (!system) {
		return (
			<div className="result">
				<h2 className="result-title">{t('gm.detail.title')}</h2>
				<p className="result-empty">{t('gm.detail.pick')}</p>
			</div>
		);
	}

	const coords = `${system.galaxy}:${system.system}`;

	return (
		<div className="result">
			<h2 className="result-title">{t('gm.detail.system', { coords })}</h2>

			{rows.length === 0 ? (
				<p className="result-empty">{t('gm.detail.empty')}</p>
			) : (
				<ul className="gm-detail-list">
					{rows.map((row) => (
						<li key={row.id} className="gm-detail-row">
							<span className="gm-detail-position">{row.position}</span>
							<span className="gm-detail-name">{row.player.name}</span>
							{row.player.alliance && (
								<span className="pl-row-alliance">[{row.player.alliance.tag}]</span>
							)}
							<StatusBadges status={row.player.status} />
							{row.moon && (
								<span className="pl-moon" title={t('gm.detail.moon')}>
									🌙
								</span>
							)}
							{row.url ? (
								<a
									className="pl-coords"
									href={row.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{row.coords}
								</a>
							) : (
								<span className="pl-coords">{row.coords}</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default SystemDetail;
