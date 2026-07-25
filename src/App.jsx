import React, { useState } from 'react';
import { useI18n } from './i18n/I18nContext';
import { LANGUAGES } from './i18n/translations';
import Trader from './Trader/Trader';
import Moonbreak from './Moonbreak/Moonbreak';
import ServerSettings from './ServerSettings/ServerSettings';

const TOOLS = [
	{ id: 'trader', labelKey: 'nav.trader', Component: Trader },
	{ id: 'moonbreak', labelKey: 'nav.moonbreak', Component: Moonbreak },
	{ id: 'server', labelKey: 'nav.server', Component: ServerSettings },
];

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

function ToolNav({ current, onSelect }) {
	const { t } = useI18n();
	return (
		<nav className="tool-nav" aria-label={t('nav.label')}>
			{TOOLS.map(({ id, labelKey }) => (
				<button
					key={id}
					type="button"
					className={id === current ? 'is-active' : ''}
					aria-current={id === current ? 'page' : undefined}
					onClick={() => onSelect(id)}
				>
					{t(labelKey)}
				</button>
			))}
		</nav>
	);
}

function App() {
	const { t } = useI18n();
	const [tool, setTool] = useState(TOOLS[0].id);
	const { Component } = TOOLS.find(({ id }) => id === tool);

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

				<ToolNav current={tool} onSelect={setTool} />

				<main className="card">
					<Component />
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
