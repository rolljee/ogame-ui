import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, fireEvent, userEvent } from '../../test/utils';
import RateSelector from './RateSelector';
import { RATES } from '../../components/constants';

describe('<RateSelector />', () => {
	it('renders a chip per preset, spaced for readability', () => {
		renderWithI18n(<RateSelector rate="2:1.5:1" onChange={() => {}} />);
		for (const { rate } of RATES) {
			expect(screen.getByRole('button', { name: rate.replace(/:/g, ' : ') })).toBeInTheDocument();
		}
	});

	it('highlights the active preset only', () => {
		renderWithI18n(<RateSelector rate="2:1.5:1" onChange={() => {}} />);
		expect(screen.getByRole('button', { name: '2 : 1.5 : 1' })).toHaveClass('is-active');
		expect(screen.getByRole('button', { name: '2.5 : 1.6 : 1' })).not.toHaveClass('is-active');
	});

	it('reports the preset behind a chip', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		renderWithI18n(<RateSelector rate="2:1.5:1" onChange={onChange} />);

		await user.click(screen.getByRole('button', { name: '1.8 : 1.4 : 1' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith('1.8:1.4:1');
	});

	it('splits the rate across the three inputs, in metal:crystal:deut order', () => {
		renderWithI18n(<RateSelector rate="3:2:1" onChange={() => {}} />);
		const [metal, crystal, deut] = screen.getAllByRole('spinbutton');
		expect(metal).toHaveValue(3);
		expect(crystal).toHaveValue(2);
		expect(deut).toHaveValue(1);
	});

	it('rebuilds the whole rate string when one part changes', () => {
		const onChange = vi.fn();
		renderWithI18n(<RateSelector rate="2:1.5:1" onChange={onChange} />);

		const [metal] = screen.getAllByRole('spinbutton');
		// The input is controlled by the parent, so typing would append to the
		// unchanged '2'; set the value in one go instead.
		fireEvent.change(metal, { target: { value: '3' } });

		expect(onChange).toHaveBeenCalledExactlyOnceWith('3:1.5:1');
	});

	it('keeps the custom section closed on a preset, open otherwise', () => {
		const { unmount } = renderWithI18n(<RateSelector rate="2:1.5:1" onChange={() => {}} />);
		expect(screen.getByText('Custom rate').closest('details')).not.toHaveAttribute('open');

		unmount();
		renderWithI18n(<RateSelector rate="4:3:2" onChange={() => {}} />);
		expect(screen.getByText('Custom rate').closest('details')).toHaveAttribute('open');
	});
});
