import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RESOURCE_ORDER, RESOURCE_META } from '../resources';
import ResourceIcon from '../../components/ResourceIcon';

function ResourcePicker({ selected, onSelect }) {
	const { t } = useI18n();
	return (
		<div className="resource-grid">
			{RESOURCE_ORDER.map((resource) => {
				const meta = RESOURCE_META[resource];
				const active = resource === selected;
				return (
					<button
						key={resource}
						type="button"
						className={`resource-tile ${active ? 'is-active' : ''}`}
						style={{ '--res-color': meta.color }}
						aria-pressed={active}
						onClick={() => onSelect(resource)}
					>
						<ResourceIcon resource={resource} />
						{t(meta.labelKey)}
					</button>
				);
			})}
		</div>
	);
}

export default ResourcePicker;
