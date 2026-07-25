import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { useI18n } from '../i18n/I18nContext';

// `labelKey` lets a view name what is being copied; the confirmation is shared.
function CopyButton({ text, labelKey = 'result.copy' }) {
	const { t } = useI18n();
	const [copied, setCopied] = useState(false);

	function handleClick() {
		copy(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1800);
	}

	return (
		<button
			type="button"
			className={`btn btn-copy ${copied ? 'is-copied' : ''}`}
			onClick={handleClick}
		>
			{copied ? `✓ ${t('result.copied')}` : t(labelKey)}
		</button>
	);
}

export default CopyButton;
