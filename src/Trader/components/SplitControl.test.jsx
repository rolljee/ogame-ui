import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, fireEvent } from '../../test/utils';
import SplitControl from './SplitControl';
import { RESOURCES } from '../../components/constants';

const others = [RESOURCES.metal, RESOURCES.crystal];
const percents = { metal: 70, crystal: 30, deut: 0 };

describe('<SplitControl />', () => {
	it('renders one slider per receiving resource', () => {
		renderWithI18n(<SplitControl others={others} percents={percents} onChange={() => {}} />);
		expect(screen.getAllByRole('slider')).toHaveLength(2);
		expect(screen.getByRole('slider', { name: 'Metal' })).toHaveValue('70');
		expect(screen.getByRole('slider', { name: 'Crystal' })).toHaveValue('30');
	});

	it('shows the percentages as text', () => {
		renderWithI18n(<SplitControl others={others} percents={percents} onChange={() => {}} />);
		expect(screen.getByText('70%')).toBeInTheDocument();
		expect(screen.getByText('30%')).toBeInTheDocument();
	});

	it('reports the resource and its new value as a number', () => {
		const onChange = vi.fn();
		renderWithI18n(<SplitControl others={others} percents={percents} onChange={onChange} />);

		// Dragging a range input is not something userEvent can express.
		fireEvent.change(screen.getByRole('slider', { name: 'Metal' }), { target: { value: '25' } });

		expect(onChange).toHaveBeenCalledExactlyOnceWith(RESOURCES.metal, 25);
	});

	it('treats a missing percentage as 0', () => {
		renderWithI18n(<SplitControl others={others} percents={{}} onChange={() => {}} />);
		expect(screen.getByRole('slider', { name: 'Metal' })).toHaveValue('0');
	});
});
