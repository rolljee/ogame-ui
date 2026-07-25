import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, fireEvent, userEvent } from '../test/utils';
import Trader from './Trader';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));

// The amount field is the page's only text input; the custom-rate fields are
// number inputs.
function amountField() {
	return screen.getByRole('textbox');
}

describe('<Trader />', () => {
	it('starts on deuterium with an even split and no result', () => {
		renderWithI18n(<Trader />);
		expect(screen.getByRole('button', { name: 'Deuterium' })).toHaveAttribute(
			'aria-pressed',
			'true',
		);
		expect(screen.getAllByRole('slider')).toHaveLength(2);
		expect(screen.getByText('Enter an amount to see the result.')).toBeInTheDocument();
	});

	it('converts deuterium into the two other resources', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Trader />);

		await user.type(amountField(), '10000');

		// 10 000 deut at 2:1.5:1, split 50/50 -> 10 000 metal + 7 500 crystal.
		expect(screen.getByText('10.000')).toBeInTheDocument();
		expect(screen.getByText('7.500')).toBeInTheDocument();
	});

	it('recomputes when the rate changes', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Trader />);
		await user.type(amountField(), '10000');

		await user.click(screen.getByRole('button', { name: '2.5 : 1.6 : 1' }));

		// The metal side follows the rate: 10 000 x 2.5 x 50%.
		expect(screen.getByText('12.500')).toBeInTheDocument();
	});

	it('recomputes when the split moves', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Trader />);
		await user.type(amountField(), '10000');

		fireEvent.change(screen.getByRole('slider', { name: 'Metal' }), { target: { value: '100' } });

		expect(screen.getByRole('slider', { name: 'Metal' })).toHaveValue('100');
		expect(screen.getByRole('slider', { name: 'Crystal' })).toHaveValue('0');
		expect(screen.getByText('20.000')).toBeInTheDocument();
	});

	it('keeps the two split shares complementary', () => {
		renderWithI18n(<Trader />);

		fireEvent.change(screen.getByRole('slider', { name: 'Metal' }), { target: { value: '30' } });

		expect(screen.getByRole('slider', { name: 'Crystal' })).toHaveValue('70');
	});

	it('offers the two other resources after switching the traded one', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Trader />);

		await user.click(screen.getByRole('button', { name: 'Metal' }));

		expect(screen.getByRole('slider', { name: 'Crystal' })).toHaveValue('50');
		expect(screen.getByRole('slider', { name: 'Deuterium' })).toHaveValue('50');
		expect(screen.queryByRole('slider', { name: 'Metal' })).not.toBeInTheDocument();
	});

	it('converts metal too, keeping the amount', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Trader />);
		await user.type(amountField(), '10000');

		await user.click(screen.getByRole('button', { name: 'Metal' }));

		// 10 000 metal at 2:1.5:1 -> 2 500 deut and 3 750 crystal, split 50/50.
		expect(screen.getByText('2.500')).toBeInTheDocument();
		expect(screen.getByText('3.750')).toBeInTheDocument();
	});

	it('converts crystal too', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Trader />);
		await user.type(amountField(), '10000');

		await user.click(screen.getByRole('button', { name: 'Crystal' }));

		// 10 000 crystal at 2:1.5:1 -> 6 667 metal and 3 333 deut, split 50/50.
		expect(screen.getByText('6.667')).toBeInTheDocument();
		expect(screen.getByText('3.333')).toBeInTheDocument();
	});

	it('clamps the split to 0-100 whatever the slider reports', () => {
		renderWithI18n(<Trader />);

		fireEvent.change(screen.getByRole('slider', { name: 'Metal' }), { target: { value: '150' } });

		expect(screen.getByRole('slider', { name: 'Metal' })).toHaveValue('100');
		expect(screen.getByRole('slider', { name: 'Crystal' })).toHaveValue('0');
	});
});
