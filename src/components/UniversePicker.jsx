import React, { useEffect, useMemo } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchUniverses } from '../api/ogame';
import { useApiData } from '../api/useApiData';

// The universe preselected on arrival, on every view at once. The app has a
// single user for now and this is the universe they play in, so landing on it
// saves picking it again on each view. Change these two values to move it;
// should the universe close, the picker falls back to the first one of the
// community matching the interface language.
export const DEFAULT_UNIVERSE = { lang: 'fr', universe: '282' };

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

	// `undefined` while the list loads, and once it has loaded when that universe
	// has closed since.
	const preferred = useMemo(
		() =>
			(universes ?? []).find(
				(universe) =>
					universe.language === DEFAULT_UNIVERSE.lang &&
					String(universe.number) === DEFAULT_UNIVERSE.universe,
			),
		[universes],
	);

	// The parent's selection is empty on first paint, one render before the
	// effect below fills it. Falling back here keeps the dropdown from flashing
	// empty in the meantime.
	const activeLang =
		value.lang ||
		preferred?.language ||
		(languages.includes(lang) ? lang : languages[0]) ||
		'';

	const inLanguage = useMemo(
		() => (universes ?? []).filter((universe) => universe.language === activeLang),
		[universes, activeLang],
	);

	// Preselect DEFAULT_UNIVERSE, or else the first universe of the community
	// matching the interface language, so the view has something to show
	// immediately.
	useEffect(() => {
		if (!universes || universes.length === 0 || value.universe) return;
		const first = preferred ?? universes.find((universe) => universe.language === activeLang);
		if (first) onChange({ lang: first.language, universe: String(first.number) });
	}, [universes, activeLang]);

	// Coming back to the default community lands on the default universe rather
	// than on whichever one happens to be first.
	function handleLanguage(next) {
		const first =
			(next === DEFAULT_UNIVERSE.lang ? preferred : undefined) ??
			universes.find((universe) => universe.language === next);
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
