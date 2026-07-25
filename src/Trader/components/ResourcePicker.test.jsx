import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, userEvent } from '../../test/utils';
import ResourcePicker from './ResourcePicker';
import { RESOURCES } from '../../components/constants';

describe('<ResourcePicker />', () => {
	it('renders one tile per resource, in canonical order', () => {
		renderWithI18n(<ResourcePicker selected={RESOURCES.deut} onSelect={() => {}} />);
		const names = screen.getAllByRole('button').map((b) => b.textContent);
		expect(names).toEqual(['Metal', 'Crystal', 'Deuterium']);
	});

	it('marks only the selected tile as pressed', () => {
		renderWithI18n(<ResourcePicker selected={RESOURCES.crystal} onSelect={() => {}} />);
		expect(screen.getByRole('button', { name: 'Crystal' })).toHaveAttribute(
			'aria-pressed',
			'true',
		);
		expect(screen.getByRole('button', { name: 'Metal' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('reports the clicked resource', async () => {
		const onSelect = vi.fn();
		const user = userEvent.setup();
		renderWithI18n(<ResourcePicker selected={RESOURCES.deut} onSelect={onSelect} />);

		await user.click(screen.getByRole('button', { name: 'Metal' }));

		expect(onSelect).toHaveBeenCalledExactlyOnceWith(RESOURCES.metal);
	});
});
