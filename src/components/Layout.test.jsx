import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithI18n, screen, userEvent } from '../test/utils';
import { Group, NeedsUniverse } from './Layout';

describe('<Group />', () => {
	it('keeps its help folded until asked for', async () => {
		const user = userEvent.setup();
		renderWithI18n(
			<Group title="Amount" help="How much to trade.">
				<input aria-label="amount" />
			</Group>,
		);

		expect(screen.getByRole('heading', { name: 'Amount' })).toBeInTheDocument();
		expect(screen.getByText('How much to trade.')).not.toBeVisible();

		await user.click(screen.getByRole('button', { name: 'Show help' }));

		expect(screen.getByText('How much to trade.')).toBeVisible();
		expect(screen.getByRole('button', { name: 'Hide help' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
	});

	it('has no help button without help', () => {
		renderWithI18n(<Group title="Amount">content</Group>);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});

describe('<NeedsUniverse />', () => {
	it('points at the picker while no universe is chosen', () => {
		renderWithI18n(<NeedsUniverse>data</NeedsUniverse>);
		expect(screen.getByText('Pick a universe in the menu to load its data.')).toBeInTheDocument();
		expect(screen.queryByText('data')).not.toBeInTheDocument();
	});
});
