import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, fireEvent, userEvent } from '../../test/utils';
import AmountInput from './AmountInput';
import { RESOURCES } from '../../components/constants';

describe('<AmountInput />', () => {
	it('labels the field with the selected resource', () => {
		renderWithI18n(<AmountInput resource={RESOURCES.deut} value="" onChange={() => {}} />);
		expect(screen.getByText('Deuterium')).toBeInTheDocument();
	});

	// The field is a text input, not a number one: it shows grouped digits.
	it('groups the value it displays', () => {
		renderWithI18n(<AmountInput resource={RESOURCES.metal} value="1234567" onChange={() => {}} />);
		expect(screen.getByRole('textbox')).toHaveValue('1.234.567');
	});

	it('stays empty rather than showing a 0', () => {
		renderWithI18n(<AmountInput resource={RESOURCES.metal} value="" onChange={() => {}} />);
		expect(screen.getByRole('textbox')).toHaveValue('');
	});

	it('reports each keystroke as raw digits', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		renderWithI18n(<AmountInput resource={RESOURCES.metal} value="" onChange={onChange} />);

		await user.type(screen.getByRole('textbox'), '12');

		// The field is controlled and `value` never changes here, so each
		// keystroke reports a single character.
		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onChange).toHaveBeenNthCalledWith(1, '1');
		expect(onChange).toHaveBeenNthCalledWith(2, '2');
	});

	it('strips anything that is not a digit, so a pasted amount survives', () => {
		const onChange = vi.fn();
		renderWithI18n(<AmountInput resource={RESOURCES.metal} value="" onChange={onChange} />);

		fireEvent.change(screen.getByRole('textbox'), { target: { value: '1.234.567 metal' } });

		expect(onChange).toHaveBeenCalledExactlyOnceWith('1234567');
	});
});
