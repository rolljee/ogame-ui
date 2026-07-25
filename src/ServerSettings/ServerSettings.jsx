import React, { useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import UniversePicker from '../components/UniversePicker';
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
	const [selection, setSelection] = useState({ lang: '', universe: '' });

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const groups = describeServer(data);

	return (
		<>
			<p className="calc-intro">{t('srv.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('srv.step.universe')}</h2>
				</div>
				<p className="help">{t('srv.step.universe.help')}</p>
				<UniversePicker value={selection} onChange={setSelection} />
			</section>

			{loading && <p className="help">{t('srv.loading')}</p>}

			{error && (
				<p className="api-error" role="alert">
					{t('srv.error.data')} <span className="api-error-detail">{error.message}</span>
				</p>
			)}

			{data && (
				<div className="result">
					{/* Some universes omit <name> entirely (e.g. s1-en), which would
					    otherwise render an empty heading. */}
					<h2 className="result-title">
						{data.name || t('srv.unnamed', { number: data.number })}
					</h2>
					<p className="srv-subtitle">
						{t('srv.subtitle', { number: data.number, lang: String(data.language).toUpperCase() })}
					</p>

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
			)}
		</>
	);
}

export default ServerSettings;
