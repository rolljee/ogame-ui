import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

// Like the players search: the proxy needs a term — alliances.xml holds every
// alliance of the universe — so the request is fired on submit.
function AllianceSearch({ onSearch }) {
	const { t } = useI18n();
	const [query, setQuery] = useState('');

	function handleSubmit(event) {
		event.preventDefault();
		onSearch(query.trim());
	}

	return (
		<form className="pl-search-form" onSubmit={handleSubmit} role="search">
			<label className="field">
				<span className="field-label">
					<span aria-hidden="true">🔎</span>
					{t('al.search.label')}
				</span>
				<input
					type="search"
					autoComplete="off"
					placeholder={t('al.search.placeholder')}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
			</label>
			<button type="submit" className="btn">
				{t('al.search.submit')}
			</button>
		</form>
	);
}

export default AllianceSearch;
