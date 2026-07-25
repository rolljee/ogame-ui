import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, userEvent } from '../../test/utils';
import ResultPanel from './ResultPanel';
import { RESOURCES } from '../../components/constants';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));
const copy = (await import('copy-to-clipboard')).default;

const props = {
	selected: RESOURCES.deut,
	amount: '10000',
	rate: '2:1.5:1',
	outputs: { metal: 10000, crystal: 7500 },
};

describe('<ResultPanel />', () => {
	it('prompts for an amount when there is nothing to show', () => {
		renderWithI18n(<ResultPanel {...props} amount="" outputs={{}} />);
		expect(screen.getByText('Enter an amount to see the result.')).toBeInTheDocument();
	});

	it('stays empty when outputs exist but the amount is zero', () => {
		renderWithI18n(<ResultPanel {...props} amount="0" />);
		expect(screen.getByText('Enter an amount to see the result.')).toBeInTheDocument();
	});

	it('lists the received resources, formatted', () => {
		renderWithI18n(<ResultPanel {...props} />);
		expect(screen.getByText('10.000')).toBeInTheDocument();
		expect(screen.getByText('7.500')).toBeInTheDocument();
	});

	it('lists them in canonical order and skips the traded resource', () => {
		renderWithI18n(<ResultPanel {...props} />);
		const names = screen
			.getAllByText(/^(Metal|Crystal|Deuterium)$/)
			.map((node) => node.textContent);
		expect(names).toEqual(['Metal', 'Crystal']);
	});

	it('recalls what was traded', () => {
		renderWithI18n(<ResultPanel {...props} />);
		expect(screen.getByText('10.000 Deuterium')).toBeInTheDocument();
	});

	it('copies a summary of the trade', async () => {
		const user = userEvent.setup();
		renderWithI18n(<ResultPanel {...props} />);

		await user.click(screen.getByRole('button', { name: 'Copy summary' }));

		expect(copy).toHaveBeenCalledOnce();
		const text = copy.mock.calls[0][0];
		expect(text).toContain('Trade (2:1.5:1)');
		expect(text).toContain('10.000 Deuterium');
		expect(text).toContain('10.000 Metal');
		expect(text).toContain('7.500 Crystal');
	});

	it('confirms the copy to the user', async () => {
		const user = userEvent.setup();
		renderWithI18n(<ResultPanel {...props} />);

		await user.click(screen.getByRole('button', { name: 'Copy summary' }));

		expect(screen.getByRole('button', { name: '✓ Copied!' })).toBeInTheDocument();
	});
});
