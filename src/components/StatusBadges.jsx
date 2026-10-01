import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { describeStatus } from './status';

// The status flags of a player, as badges. Shared by the players list and the
// member list of an alliance.
function StatusBadges({ status }) {
	const { t } = useI18n();
	return (
		<span className="pl-badges">
			{describeStatus(status).map(({ key, labelKey, Icon }) => (
				<span key={key} className={`pl-badge pl-badge-${key} st-${key}`}>
					<Icon size={13} aria-hidden="true" /> {t(labelKey)}
				</span>
			))}
		</span>
	);
}

export default StatusBadges;
