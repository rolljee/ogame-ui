import React from 'react';
import { RESOURCE_META } from '../Trader/resources';

const PATHS = {
	// stylised metal ingot / cube
	metal: 'M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Zm0 2.3L6 8.1v7.8l6 3.4 6-3.4V8.1l-6-3.3Z',
	// crystal gem
	crystal: 'M7 3h10l4 6-9 12L3 9l4-6Zm.9 2L5.4 8.7 12 17.4l6.6-8.7L16.1 5H7.9Z',
	// deuterium droplet
	deut: 'M12 2.5c0 0 7 8.4 7 12.5a7 7 0 0 1-14 0C5 10.9 12 2.5 12 2.5Z',
};

function ResourceIcon({ resource, size = 34, className = '' }) {
	const meta = RESOURCE_META[resource];
	if (!meta) return null;
	return (
		<svg
			className={`res-icon ${className}`}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			style={{ '--res-color': meta.color, color: meta.color }}
			fill="currentColor"
			aria-hidden="true"
		>
			<path d={PATHS[meta.key]} />
		</svg>
	);
}

export default ResourceIcon;
