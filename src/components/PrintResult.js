import React from 'react';
import CopyButton from './CopyButton';
import { RESOURCES } from './constants';

class PrintResult extends React.Component {
	prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}
	getText(metalText, crystalText, deutText, selected) {
		let text = '';
		if (selected === RESOURCES.deut) {
			text = `Trade:\n${deutText} deut\n\nAgainst:\n${metalText} metal\n${crystalText} crystal`;
		} else if (selected === RESOURCES.crystal) {
			text = `Trade:\n${crystalText} crystal\n\nAgainst:\n${metalText} metal\n${deutText} deut`;
		} else if (selected === RESOURCES.metal) {
			text = `Trade:\n${metalText} metal\n\nAgainst:\n${deutText} deut\n${crystalText} crystal`;
		} else {
			text = 'Nothing to sell yet';
		}

		return text;
	}
	render() {
		const { metal, crystal, deut, selected, textColor } = this.props;
		const deutText = this.prettify(deut);
		const metalText = this.prettify(metal);
		const crystalText = this.prettify(crystal);
		const text = this.getText(metalText, crystalText, deutText, selected);

		return (
			<div className={`col-lg-12 ${textColor}`}>
				<div>deut: {deutText}</div>
				<div>metal: {metalText}</div>
				<div>crystal: {crystalText}</div>
				<CopyButton text={text} />
			</div>
		);
	}
}

export default PrintResult;
