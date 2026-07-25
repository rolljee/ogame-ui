import React, { useState, useMemo } from 'react';
import OgameTrader from 'ogamejs/trades';

import { useI18n } from '../i18n/I18nContext';
import { RESOURCES } from '../components/constants';
import { RESOURCE_ORDER } from './resources';
import ResourcePicker from './components/ResourcePicker';
import AmountInput from './components/AmountInput';
import RateSelector from './components/RateSelector';
import SplitControl from './components/SplitControl';
import ResultPanel from './components/ResultPanel';

const DEFAULT_RATE = '2:1.5:1';

function otherResources(selected) {
	return RESOURCE_ORDER.filter((r) => r !== selected);
}

// Convert the selected resource amount into the two other resources using the
// pure calculation helpers from ogamejs. Returns { resourceKey: amount }.
function computeOutputs(selected, amount, rate, percents) {
	const value = Number(amount) || 0;
	if (!value) return {};

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
		<>
			<p className="calc-intro">{t('calc.intro')}</p>

			<section className="section">
				<div className="section-head">
					<span className="section-step">1</span>
					<h2 className="section-title">{t('step.resource')}</h2>
				</div>
				<p className="help">{t('step.resource.help')}</p>
				<ResourcePicker selected={selected} onSelect={handleSelect} />
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">2</span>
					<h2 className="section-title">{t('step.amount')}</h2>
				</div>
				<p className="help">{t('step.amount.help')}</p>
				<AmountInput resource={selected} value={amount} onChange={setAmount} />
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">3</span>
					<h2 className="section-title">{t('step.rate')}</h2>
				</div>
				<p className="help">{t('step.rate.help')}</p>
				<RateSelector rate={rate} onChange={setRate} />
			</section>

			<section className="section">
				<div className="section-head">
					<span className="section-step">4</span>
					<h2 className="section-title">{t('step.split')}</h2>
				</div>
				<p className="help">{t('step.split.help')}</p>
				<SplitControl others={others} percents={percents} onChange={handleSplitChange} />
			</section>

			<ResultPanel selected={selected} amount={amount} rate={rate} outputs={outputs} />
		</>
	);
}

export default Trader;
