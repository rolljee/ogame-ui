import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RESOURCE_ORDER, RESOURCE_META, prettify } from '../resources';
import ResourceIcon from '../../components/ResourceIcon';
import CopyButton from '../../components/CopyButton';

function ResultPanel({ selected, amount, rate, outputs }) {
	const { t } = useI18n();
	// Keep display in canonical metal:crystal:deut order.
	const lines = RESOURCE_ORDER.filter((r) => r in outputs);
	const hasResult = lines.length > 0 && Number(amount) > 0;

	function buildCopyText() {
		const selectedLabel = t(RESOURCE_META[selected].labelKey);
		const against = lines
			.map((r) => `${prettify(outputs[r])} ${t(RESOURCE_META[r].labelKey)}`)
			.join('\n');
		return `${t('copy.trade')} (${rate}):\n${prettify(amount)} ${selectedLabel}\n\n${t('copy.against')}:\n${against}`;
	}

	return (
		<div className="result">
			<p className="result-title">{t('result.title')}</p>

			{!hasResult ? (
				<p className="result-empty">{t('result.empty')}</p>
			) : (
				<>
					<div className="result-lines">
						{lines.map((resource) => {
							const meta = RESOURCE_META[resource];
							return (
								<div className="result-line" key={resource} style={{ '--res-color': meta.color }}>
									<span className="res-name">
										<ResourceIcon resource={resource} size={24} />
										{t(meta.labelKey)}
									</span>
									<span className="res-amount">{prettify(outputs[resource])}</span>
								</div>
							);
						})}
					</div>

					<p className="result-for">
						{t('result.for')}{' '}
						<strong>
							{prettify(amount)} {t(RESOURCE_META[selected].labelKey)}
						</strong>
					</p>

					<CopyButton text={buildCopyText()} />
				</>
			)}
		</div>
	);
}

export default ResultPanel;
