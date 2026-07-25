import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { STATUS_FLAGS } from '../model';

// The proxy needs a `search` term — a universe holds thousands of players — so
// the request is fired on submit rather than on every keystroke.
function PlayerSearch({ onSearch, statuses, onToggleStatus }) {
	const { t } = useI18n();
	const [query, setQuery] = useState('');

	function handleSubmit(event) {
		event.preventDefault();
		onSearch(query.trim());
	}

	return (
		<div className="pl-search">
			<form className="pl-search-form" onSubmit={handleSubmit} role="search">
				<label className="field">
					<span className="field-label">
						<span aria-hidden="true">🔎</span>
						{t('pl.search.label')}
					</span>
					<input
						type="search"
						autoComplete="off"
						placeholder={t('pl.search.placeholder')}
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</label>
				<button type="submit" className="btn">
					{t('pl.search.submit')}
				</button>
			</form>

			<div className="chips" role="group" aria-label={t('pl.filter.label')}>
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

export default PlayerSearch;
