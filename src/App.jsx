import React, { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';
import { useI18n } from './i18n/I18nContext';
import { LANGUAGES } from './i18n/translations';
import { UniverseProvider, UniverseSelect, useUniverse } from './universe/UniverseContext';
import Trader from './Trader/Trader';
import Moonbreak from './Moonbreak/Moonbreak';
import Expeditions from './Expeditions/Expeditions';
import MoonLock from './MoonLock/MoonLock';
import Players from './Players/Players';
import GalaxyMap from './GalaxyMap/GalaxyMap';
import Alliances from './Alliances/Alliances';
import ServerSettings from './ServerSettings/ServerSettings';

// Grouped as the index shows them: what you compute, then what you look up in
// a universe's live data.
const GROUPS = [
	{
		labelKey: 'nav.group.calc',
		tools: [
			{ id: 'trader', labelKey: 'nav.trader', introKey: 'calc.intro', Component: Trader },
			{ id: 'moonbreak', labelKey: 'nav.moonbreak', introKey: 'mb.intro', Component: Moonbreak },
			{
				id: 'expeditions',
				labelKey: 'nav.expeditions',
				introKey: 'exp.intro',
				live: true,
				Component: Expeditions,
			},
			{ id: 'moonlock', labelKey: 'nav.moonlock', introKey: 'ml.intro', live: true, Component: MoonLock },
		],
	},
	{
		labelKey: 'nav.group.data',
		tools: [
			{ id: 'players', labelKey: 'nav.players', introKey: 'pl.intro', live: true, Component: Players },
			{ id: 'alliances', labelKey: 'nav.alliances', introKey: 'al.intro', live: true, Component: Alliances },
			{ id: 'galaxymap', labelKey: 'nav.galaxymap', introKey: 'gm.intro', live: true, Component: GalaxyMap },
			{ id: 'server', labelKey: 'nav.server', introKey: 'srv.intro', live: true, Component: ServerSettings },
		],
	},
];

const TOOLS = GROUPS.flatMap(({ tools }) => tools);

// Each tool has its own address, so it can be bookmarked or shared, and the
// browser's back button walks through the tools that were opened.
function readRoute() {
	const id = window.location.hash.replace(/^#\/?/, '');
	return TOOLS.some((tool) => tool.id === id) ? id : TOOLS[0].id;
}

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
			{GROUPS.map(({ labelKey, tools }) => (
				<div className="tool-nav-group" key={labelKey}>
					<h2 className="tool-nav-title">{t(labelKey)}</h2>
					<ul>
						{tools.map(({ id, labelKey: toolLabel }) => (
							<li key={id}>
								<a
									href={`#/${id}`}
									className={id === current ? 'is-active' : ''}
									aria-current={id === current ? 'page' : undefined}
									onClick={() => onSelect(id)}
								>
									{t(toolLabel)}
								</a>
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}

function ToolHeader({ tool }) {
	const { t } = useI18n();
	const { selection, dataAge } = useUniverse();
	const [open, setOpen] = useState(false);

	return (
		<header className="tool-head">
			<div className="tool-head-row">
				<div className="tool-title-row">
					<h1 className="tool-title">{t(tool.labelKey)}</h1>
					<button
						type="button"
						className="btn-text"
						aria-expanded={open}
						aria-controls="tool-intro"
						onClick={() => setOpen((value) => !value)}
					>
						{t(open ? 'intro.hide' : 'intro.show')}
					</button>
				</div>
				{/* The report is stamped with the universe its data comes from. */}
				{tool.live && selection.universe && (
					<p className="tool-stamp">
						{t('srv.subtitle', {
							number: selection.universe,
							lang: selection.lang.toUpperCase(),
						})}
						{dataAge !== null && ` · ${t('universe.age', { hours: dataAge })}`}
					</p>
				)}
			</div>
			<p className="tool-intro" id="tool-intro" hidden={!open}>
				{t(tool.introKey)}
			</p>
		</header>
	);
}

function App() {
	const { t } = useI18n();
	const [toolId, setToolId] = useState(readRoute);
	const tool = TOOLS.find(({ id }) => id === toolId);
	const { Component } = tool;

	useEffect(() => {
		const onHashChange = () => setToolId(readRoute());
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

	useEffect(() => {
		document.title = `${t(tool.labelKey)} · ${t('brand')}`;
	}, [tool, t]);

	return (
		<UniverseProvider>
			<div className="app-shell">
				<aside className="index">
					<div className="brand">
						<img
							className="brand-logo"
							src={`${import.meta.env.BASE_URL}icon-192.png`}
							alt=""
							width="36"
							height="36"
						/>
						<div className="brand-text">
							<div className="brand-name">{t('brand')}</div>
							<div className="brand-tagline">{t('tagline')}</div>
						</div>
						<LangToggle />
					</div>

					<section className="index-universe" aria-label={t('universe.label')}>
						<h2 className="tool-nav-title">{t('universe.label')}</h2>
						<UniverseSelect />
					</section>

					<ToolNav current={toolId} onSelect={setToolId} />

					<footer className="index-footer">
						<p>
							<a href="https://ogame.gameforge.com" target="_blank" rel="noopener noreferrer">
								OGame
							</a>{' '}
							· {t('footer.fanMade')}
						</p>
						<a
							className="support-link"
							href="https://buymeacoffee.com/rolljee"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Coffee size={16} aria-hidden="true" /> {t('footer.support')}
						</a>
					</footer>
				</aside>

				<main className="desk">
					<ToolHeader key={toolId} tool={tool} />
					<Component />
				</main>
			</div>
		</UniverseProvider>
	);
}

export default App;
