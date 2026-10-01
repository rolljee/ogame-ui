import React from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useUniverse } from '../universe/UniverseContext';
import { NeedsUniverse } from '../components/Layout';
import { describeServer, formatSetting } from './settings';

function SettingValue({ row }) {
	const { t } = useI18n();
	if (row.format === 'bool') {
		return (
			<span className={Number(row.value) === 1 ? 'is-on' : 'is-off'}>
				{t(Number(row.value) === 1 ? 'common.yes' : 'common.no')}
			</span>
		);
	}
	return <span>{formatSetting(row.value, row.format)}</span>;
}

function ServerSettings() {
	const { t } = useI18n();
	const { selection } = useUniverse();

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const groups = describeServer(data);

	return (
		<div className="tool-grid tool-grid-single">
			<NeedsUniverse>
				{loading && <p className="help">{t('srv.loading')}</p>}

				{error && (
					<p className="api-error" role="alert">
						{t('srv.error.data')} <span className="api-error-detail">{error.message}</span>
					</p>
				)}

				{data && (
					<div className="result">
						<div className="result-head">
							{/* Some universes omit <name> entirely (e.g. s1-en), which would
							    otherwise render an empty heading. */}
							<h2 className="result-title">
								{data.name || t('srv.unnamed', { number: data.number })}
							</h2>
							<p className="result-meta">
								{t('srv.subtitle', {
									number: data.number,
									lang: String(data.language).toUpperCase(),
								})}
							</p>
						</div>

						<div className="srv-groups">
							{groups.map((group) => (
								<section className="srv-group" key={group.key}>
									<h3 className="srv-group-title">{t(group.titleKey)}</h3>
									<dl className="srv-rows">
										{group.rows.map((row) => (
											<div className="srv-row" key={row.key}>
												<dt>{t(row.labelKey)}</dt>
												<dd>
													<SettingValue row={row} />
												</dd>
											</div>
										))}
									</dl>
								</section>
							))}
						</div>
					</div>
				)}
			</NeedsUniverse>
		</div>
	);
}

export default ServerSettings;
