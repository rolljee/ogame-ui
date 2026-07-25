import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act } from 'react';
import { renderWithI18n, screen, fireEvent, userEvent } from '../../test/utils';
import CopyButton from './CopyButton';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));
const copy = (await import('copy-to-clipboard')).default;

afterEach(() => {
	vi.useRealTimers();
});

describe('<CopyButton />', () => {
	it('copies the given text', async () => {
		const user = userEvent.setup();
		renderWithI18n(<CopyButton text="hello" />);

		await user.click(screen.getByRole('button'));

		expect(copy).toHaveBeenCalledExactlyOnceWith('hello');
	});

	it('goes back to its idle label after a while', () => {
		vi.useFakeTimers();
		renderWithI18n(<CopyButton text="hello" />);

		// fireEvent rather than userEvent: the latter awaits real timers.
		fireEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('button')).toHaveTextContent('Copied!');

		act(() => {
			vi.advanceTimersByTime(1800);
		});

		expect(screen.getByRole('button')).toHaveTextContent('Copy summary');
	});
});
