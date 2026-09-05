import React from 'react';

import { useI18n } from '../../i18n/I18nContext';
import { STATUS_FLAGS } from '../../components/status';
import { METRICS } from '../model';

// What the colours count, and who is counted. Both re-aggregate a roster
// already in memory, so there is no submit and no request.
function HeatmapControls({ metric, statuses, onMetric, onToggleStatus }) {
	const { t } = useI18n();

	return (
		<div className="gm-controls">
			<div className="gm-control" role="group" aria-label={t('gm.metric.label')}>
				<span className="pl-sort-label">{t('gm.metric.label')}</span>
				{METRICS.map(({ key, labelKey }) => (
					<button
						key={key}
						type="button"
						className={`chip ${metric === key ? 'is-active' : ''}`}
						aria-pressed={metric === key}
						onClick={() => onMetric(key)}
					>
						{t(labelKey)}
					</button>
				))}
			</div>

			<div className="gm-control" role="group" aria-label={t('gm.filter.label')}>
				<span className="pl-sort-label">{t('gm.filter.label')}</span>
				{STATUS_FLAGS.map(({ key, labelKey, icon }) => (
					<button
						key={key}
						type="button"
						className={`chip ${statuses.includes(key) ? 'is-active' : ''}`}
						aria-pressed={statuses.includes(key)}
						onClick={() => onToggleStatus(key)}
					>
						<span aria-hidden="true">{icon}</span> {t(labelKey)}
					</button>
				))}
			</div>
		</div>
	);
}

export default HeatmapControls;
