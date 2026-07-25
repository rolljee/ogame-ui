import React, { useEffect, useMemo } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchUniverses } from '../api/ogame';
import { useApiData } from '../api/useApiData';

// Universe selector fed by Gameforge's lobby API through the proxy. The whole
// list is small once trimmed, so it is fetched once and filtered in place
// instead of refetching per community.
function UniversePicker({ value, onChange }) {
	const { t, lang } = useI18n();
	const { data: universes, error, loading } = useApiData(
		(signal) => fetchUniverses({}, { signal }),
		[],
	);

	const languages = useMemo(
		() => [...new Set((universes ?? []).map((universe) => universe.language))].sort(),
		[universes],
	);

	// The parent's selection is empty on first paint, one render before the
	// effect below fills it. Falling back here keeps the dropdown from flashing
	// empty in the meantime.
	const activeLang = value.lang || (languages.includes(lang) ? lang : languages[0]) || '';

	const inLanguage = useMemo(
		() => (universes ?? []).filter((universe) => universe.language === activeLang),
		[universes, activeLang],
	);

	// Preselect the community matching the interface language, then its first
	// universe, so the view has something to show immediately.
	useEffect(() => {
		if (!universes || universes.length === 0 || value.universe) return;
		const first = universes.find((universe) => universe.language === activeLang);
		if (first) onChange({ lang: first.language, universe: String(first.number) });
	}, [universes, activeLang]);

	function handleLanguage(next) {
		const first = universes.find((universe) => universe.language === next);
		onChange({ lang: next, universe: first ? String(first.number) : '' });
	}

	if (loading) {
		return <p className="help">{t('srv.loadingUniverses')}</p>;
	}
	if (error) {
		return (
			<p className="api-error" role="alert">
				{t('srv.error.universes')} <span className="api-error-detail">{error.message}</span>
			</p>
		);
	}

	return (
		<div className="universe-picker">
			<label className="mini-field">
				<span>{t('srv.language')}</span>
				<select value={activeLang} onChange={(e) => handleLanguage(e.target.value)}>
					{languages.map((code) => (
						<option key={code} value={code}>
							{code.toUpperCase()}
						</option>
					))}
				</select>
			</label>

			<label className="mini-field universe-field">
				<span>{t('srv.universe')}</span>
				<select
					value={value.universe}
					onChange={(e) => onChange({ ...value, universe: e.target.value })}
				>
					{inLanguage.map((universe) => (
						<option key={universe.number} value={String(universe.number)}>
							{universe.number} — {universe.name}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}

export default UniversePicker;
