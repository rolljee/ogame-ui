import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import StatusBadges from '../../components/StatusBadges';
import { STATUS_FLAGS, filterByStatus } from '../../components/status';
import {
	countStatuses,
	countsOverlap,
	describeMembers,
	foundYear,
	safeHomepage,
} from '../model';

function MemberFilters({ statuses, onToggle }) {
	const { t } = useI18n();
	return (
		<div className="chips" role="group" aria-label={t('al.filter.label')}>
			{STATUS_FLAGS.map(({ key, labelKey, icon }) => (
				<button
					key={key}
					type="button"
					className={`chip ${statuses.includes(key) ? 'is-active' : ''}`}
					aria-pressed={statuses.includes(key)}
					onClick={() => onToggle(key)}
				>
					<span aria-hidden="true">{icon}</span> {t(labelKey)}
				</button>
			))}
		</div>
	);
}

function AllianceDetail({ alliance, statuses, onToggleStatus }) {
	const { t } = useI18n();

	const members = describeMembers(filterByStatus(alliance.members, statuses));
	const breakdown = countStatuses(alliance.members);
	const homepage = safeHomepage(alliance.homepage);
	const year = foundYear(alliance.foundDate);

	return (
		<div className="result">
			<h2 className="result-title">{t('al.detail.title')}</h2>
			<h3 className="pl-name">
				<span className="al-tag">[{alliance.tag}]</span> {alliance.name}
			</h3>
			<p className="srv-subtitle">
				{t('al.detail.summary', { members: alliance.memberCount })}
				{year ? ` · ${t('al.detail.founded', { year })}` : ''}
				{` · ${t(alliance.open ? 'al.detail.open' : 'al.detail.closed')}`}
			</p>
			{homepage && (
				<p className="help">
					<a href={homepage} target="_blank" rel="noopener noreferrer nofollow">
						{t('al.detail.homepage')}
					</a>
				</p>
			)}

			{breakdown.length > 0 && (
				<section className="srv-group">
					<h3 className="srv-group-title">{t('al.detail.breakdown')}</h3>
					{/* The flags overlap, so say so instead of looking like a bad sum. */}
					{countsOverlap(alliance.members) && (
						<p className="help">{t('al.detail.breakdown.overlap')}</p>
					)}
					<div className="al-breakdown">
						{breakdown.map(({ key, labelKey, icon, count }) => (
							<span key={key} className="al-breakdown-item">
								<span aria-hidden="true">{icon}</span> {count} {t(labelKey)}
							</span>
						))}
					</div>
				</section>
			)}

			<section className="srv-group">
				<h3 className="srv-group-title">{t('al.detail.members')}</h3>
				<MemberFilters statuses={statuses} onToggle={onToggleStatus} />
				{members.length === 0 ? (
					<p className="help">{t('al.members.empty')}</p>
				) : (
					<ul className="al-members">
						{members.map((member) => (
							<li key={member.id} className={member.unknown ? 'is-unknown' : ''}>
								<span className="al-member-name">{member.label}</span>
								{member.founder && (
									<span className="al-founder">
										<span aria-hidden="true">👑</span> {t('al.detail.founder')}
									</span>
								)}
								{/* players.xml is generated apart from alliances.xml, so a member
								    can be listed here without a name or a status yet. */}
								{member.unknown ? (
									<span className="al-unknown">{t('al.members.unknown')}</span>
								) : (
									<StatusBadges status={member.status} />
								)}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

export default AllianceDetail;
