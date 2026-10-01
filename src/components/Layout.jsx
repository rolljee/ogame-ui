import React, { useId, useState } from 'react';
import { CircleHelp } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { useUniverse } from '../universe/UniverseContext';

// The two halves of a tool: the settings on one side, the report they produce
// on the other. `layout="stack"` puts the report under the settings, for the
// views whose main content needs the full width (the galaxy map).
export function ToolGrid({ settings, report, layout = 'split' }) {
	return (
		<div className={`tool-grid tool-grid-${layout}`}>
			<div className="tool-settings">{settings}</div>
			<div className="tool-report">{report}</div>
		</div>
	);
}

// One labelled block of settings. Players know the game, so the explanation
// stays folded behind a help button instead of sitting between every field.
export function Group({ title, help, children }) {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const helpId = useId();

	return (
		<section className="group">
			<div className="group-head">
				<h2 className="group-title">{title}</h2>
				{help && (
					<button
						type="button"
						className="help-toggle"
						aria-expanded={open}
						aria-controls={helpId}
						aria-label={t(open ? 'help.hide' : 'help.show')}
						title={t(open ? 'help.hide' : 'help.show')}
						onClick={() => setOpen((value) => !value)}
					>
						<CircleHelp size={18} aria-hidden="true" />
					</button>
				)}
			</div>
			{help && (
				<p className="group-help" id={helpId} hidden={!open}>
					{help}
				</p>
			)}
			{children}
		</section>
	);
}

// A help button that unfolds a note in place; for explanations inside a
// report, where there is no settings block to hang them on.
export function HelpNote({ children }) {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const noteId = useId();

	return (
		<>
			<button
				type="button"
				className="help-toggle"
				aria-expanded={open}
				aria-controls={noteId}
				aria-label={t(open ? 'help.hide' : 'help.show')}
				title={t(open ? 'help.hide' : 'help.show')}
				onClick={() => setOpen((value) => !value)}
			>
				<CircleHelp size={18} aria-hidden="true" />
			</button>
			<p className="group-help help-note" id={noteId} hidden={!open}>
				{children}
			</p>
		</>
	);
}

// Shown in place of a data view's content while no universe is picked: the
// picker lives in the shell, so say where to find it.
export function NeedsUniverse({ children }) {
	const { t } = useI18n();
	const { selection } = useUniverse();
	if (!selection.universe) {
		return <p className="empty-note">{t('universe.none')}</p>;
	}
	return children;
}
