import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ResourceIcon from './ResourceIcon';
import { RESOURCES } from './constants';

describe('<ResourceIcon />', () => {
	it('draws a path for every known resource', () => {
		for (const resource of Object.values(RESOURCES)) {
			const { container, unmount } = render(<ResourceIcon resource={resource} />);
			expect(container.querySelector('path')).toHaveAttribute('d', expect.stringMatching(/^M/));
			unmount();
		}
	});

	it('is decorative, so it stays out of the accessibility tree', () => {
		const { container } = render(<ResourceIcon resource={RESOURCES.metal} />);
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('honours the requested size', () => {
		const { container } = render(<ResourceIcon resource={RESOURCES.metal} size={20} />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '20');
		expect(svg).toHaveAttribute('height', '20');
	});

	it('renders nothing for an unknown resource', () => {
		const { container } = render(<ResourceIcon resource="antimatter" />);
		expect(container).toBeEmptyDOMElement();
	});
});
