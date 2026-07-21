import React from 'react';
import { useI18n } from './i18n/I18nContext';
import { LANGUAGES } from './i18n/translations';
import Trader from './Trader/Trader';

function LangToggle() {
	const { lang, setLang, t } = useI18n();
	return (
		<div className="lang-toggle" role="group" aria-label={t('lang.label')}>
			{LANGUAGES.map(({ code, label }) => (
				<button
					key={code}
					type="button"
					className={code === lang ? 'is-active' : ''}
					aria-pressed={code === lang}
					onClick={() => setLang(code)}
				>
					{label}
				</button>
			))}
		</div>
	);
}

function App() {
	const { t } = useI18n();
	return (
		<>
			<div className="starfield" aria-hidden="true" />
			<div className="app-shell">
				<header className="app-header">
					<div className="brand">
						<div className="brand-logo" aria-hidden="true">🚀</div>
						<div>
							<div className="brand-name">{t('brand')}</div>
							<div className="brand-tagline">{t('tagline')}</div>
						</div>
					</div>
					<LangToggle />
				</header>

				<main className="card">
					<Trader />
				</main>

				<footer className="app-footer">
					<a href="https://ogame.gameforge.com" target="_blank" rel="noopener noreferrer">
						OGame
					</a>{' '}
					· fan-made tool
				</footer>
			</div>
		</>
	);
}

export default App;
