import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { STATUS_FLAGS } from '../../components/status';
import { SORTS } from '../model';

// The whole roster is already in memory, so every control here filters in place
// — no submit, no request. `filters` is owned by the view.
//
// The galaxy and system fields are deliberately unbounded: a number the universe
// does not have simply matches nobody, which says so more clearly than a
// validation message, and it saves fetching the universe size just for a hint.
function PlayerFilters({ filters, onChange, onToggleStatus }) {
	const { t } = useI18n();

	const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value });

	return (
		<div className="pl-search">
			<div className="pl-filter-row">
				<label className="field pl-field-name">
					<span className="field-label">
						<span aria-hidden="true">🔎</span>
						{t('pl.search.label')}
					</span>
					<input
						type="search"
						autoComplete="off"
						placeholder={t('pl.search.placeholder')}
						value={filters.query}
						onChange={set('query')}
					/>
				</label>

				<label className="field pl-field-position">
					<span className="field-label">
						<span aria-hidden="true">🌌</span>
						{t('pl.filter.galaxy')}
					</span>
					<input
						type="number"
						inputMode="numeric"
						min="1"
						value={filters.galaxy}
						onChange={set('galaxy')}
					/>
				</label>

				<label className="field pl-field-position">
					<span className="field-label">
						<span aria-hidden="true">☀️</span>
						{t('pl.filter.system')}
					</span>
					<input
						type="number"
						inputMode="numeric"
						min="1"
						value={filters.system}
						onChange={set('system')}
					/>
				</label>
			</div>

			<div className="chips" role="group" aria-label={t('pl.filter.label')}>
				{STATUS_FLAGS.map(({ key, labelKey, icon }) => (
					<button
						key={key}
						type="button"
						className={`chip ${filters.statuses.includes(key) ? 'is-active' : ''}`}
						aria-pressed={filters.statuses.includes(key)}
						onClick={() => onToggleStatus(key)}
					>
						<span aria-hidden="true">{icon}</span> {t(labelKey)}
					</button>
				))}
			</div>

			<div className="pl-sort" role="group" aria-label={t('pl.sort.label')}>
				<span className="pl-sort-label">{t('pl.sort.label')}</span>
				{SORTS.map(({ key, labelKey }) => (
					<button
						key={key}
						type="button"
						className={`chip ${filters.sort === key ? 'is-active' : ''}`}
						aria-pressed={filters.sort === key}
						onClick={() => onChange({ ...filters, sort: key })}
					>
						{t(labelKey)}
					</button>
				))}
			</div>
		</div>
	);
}

export default PlayerFilters;
