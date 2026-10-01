import React, { useState, useMemo } from 'react';
import OgameTrader from 'ogamejs/trades';

import { useI18n } from '../i18n/I18nContext';
import { RESOURCES } from '../components/constants';
import { RESOURCE_ORDER } from './resources';
import { isValidRate } from './rate';
import ResourcePicker from './components/ResourcePicker';
import AmountInput from './components/AmountInput';
import RateSelector from './components/RateSelector';
import SplitControl from './components/SplitControl';
import ResultPanel from './components/ResultPanel';
import { Group, ToolGrid } from '../components/Layout';

const DEFAULT_RATE = '2:1.5:1';

function otherResources(selected) {
	return RESOURCE_ORDER.filter((r) => r !== selected);
}

// Convert the selected resource amount into the two other resources using the
// pure calculation helpers from ogamejs. Returns { resourceKey: amount }, or an
// empty object when there is nothing to convert or the rate is unusable — the
// library answers a zeroed or emptied rate with `Infinity` or 0, so it never
// sees one (see `rate.js`).
function computeOutputs(selected, amount, rate, percents) {
	const value = Number(amount) || 0;
	if (!value || !isValidRate(rate)) return {};

	if (selected === RESOURCES.deut) {
		const { metal, crystal } = OgameTrader.sellDeut(value, percents.metal, percents.crystal, rate);
		return { metal, crystal };
	}
	if (selected === RESOURCES.metal) {
		const { crystal, deut } = OgameTrader.sellMetal(value, percents.deut, percents.crystal, rate);
		return { crystal, deut };
	}
	const { metal, deut } = OgameTrader.sellCrystal(value, percents.deut, percents.metal, rate);
	return { metal, deut };
}

function Trader() {
	const { t } = useI18n();
	const [selected, setSelected] = useState(RESOURCES.deut);
	const [amount, setAmount] = useState('');
	const [rate, setRate] = useState(DEFAULT_RATE);
	const [percents, setPercents] = useState({ metal: 50, crystal: 50, deut: 0 });

	const others = otherResources(selected);

	function handleSelect(resource) {
		if (resource === selected) return;
		setSelected(resource);
		const [a, b] = otherResources(resource);
		setPercents({ metal: 0, crystal: 0, deut: 0, [a]: 50, [b]: 50 });
	}

	function handleSplitChange(resource, value) {
		const [a, b] = others;
		const other = a === resource ? b : a;
		const v = Math.max(0, Math.min(100, Math.round(value)));
		setPercents((prev) => ({ ...prev, [resource]: v, [other]: 100 - v }));
	}

	const outputs = useMemo(
		() => computeOutputs(selected, amount, rate, percents),
		[selected, amount, rate, percents],
	);

	return (
		<ToolGrid
			settings={
				<>
					<Group title={t('step.resource')} help={t('step.resource.help')}>
						<ResourcePicker selected={selected} onSelect={handleSelect} />
					</Group>

					<Group title={t('step.amount')} help={t('step.amount.help')}>
						<AmountInput resource={selected} value={amount} onChange={setAmount} />
					</Group>

					<Group title={t('step.rate')} help={t('step.rate.help')}>
						<RateSelector rate={rate} onChange={setRate} />
						{/* An emptied or zeroed field used to reach the calculation and come
						    back as 0 or Infinity; say the rate is unusable instead. */}
						{!isValidRate(rate) && (
							<p className="api-error" role="alert">
								{t('step.rate.invalid')}
							</p>
						)}
					</Group>

					<Group title={t('step.split')} help={t('step.split.help')}>
						<SplitControl others={others} percents={percents} onChange={handleSplitChange} />
					</Group>
				</>
			}
			report={<ResultPanel selected={selected} amount={amount} rate={rate} outputs={outputs} />}
		/>
	);
}

export default Trader;
