import React, { useId, useMemo, useState } from 'react';
import { ClipboardPaste } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { countParts, parseSpyReport } from '../spyReport';

// Fills the defender from an espionage report pasted from the game. What the
// report shows is read as it is pasted, so the player sees what will be filled
// before filling it.
function SpyImport({ onImport }) {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState('');
	const [done, setDone] = useState(null);
	const fieldId = useId();
	const helpId = useId();

	const found = useMemo(() => parseSpyReport(text), [text]);
	const counts = found ? countParts(found) : null;

	function close() {
		setOpen(false);
		setText('');
	}

	function apply() {
		if (!found) return;
		onImport(found);
		setDone(counts);
		close();
	}

	if (!open) {
		return (
			<div className="cs-spy">
				<button
					type="button"
					className="btn btn-quiet cs-spy-open"
					onClick={() => {
						setDone(null);
						setOpen(true);
					}}
				>
					<ClipboardPaste size={16} aria-hidden="true" />
					{t('cs.spy.open')}
				</button>
				{done && (
					<p className="cs-spy-status" role="status">
						{t('cs.spy.done', done)}
						{done.techs === 0 && ` ${t('cs.spy.keptTechs')}`}
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="cs-spy is-open">
			<label className="cs-spy-label" htmlFor={fieldId}>
				{t('cs.spy.label')}
			</label>
			<p className="help" id={helpId}>
				{t('cs.spy.help')}
			</p>
			<textarea
				id={fieldId}
				className="cs-spy-text"
				rows={6}
				value={text}
				aria-describedby={helpId}
				autoFocus
				spellCheck={false}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Escape') close();
				}}
			/>
			<p className="cs-spy-found" role="status">
				{text.trim() === '' ? '' : counts ? t('cs.spy.found', counts) : t('cs.spy.nothing')}
			</p>
			<div className="cs-actions">
				<button type="button" className="btn" disabled={!found} onClick={apply}>
					{t('cs.spy.apply')}
				</button>
				<button type="button" className="btn btn-quiet" onClick={close}>
					{t('cs.spy.cancel')}
				</button>
			</div>
		</div>
	);
}

export default SpyImport;
