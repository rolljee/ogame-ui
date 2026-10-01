import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import UniversePicker from '../components/UniversePicker';

// The universe is picked once, in the shell, and shared by every view that
// reads live data. It is remembered across visits: a player comes back to the
// same universe far more often than not.
export const UNIVERSE_STORAGE_KEY = 'og_ui_universe';

const EMPTY = { lang: '', universe: '' };

function readStored() {
	try {
		const stored = JSON.parse(localStorage.getItem(UNIVERSE_STORAGE_KEY));
		if (stored && typeof stored.lang === 'string' && typeof stored.universe === 'string') {
			return { lang: stored.lang, universe: stored.universe };
		}
	} catch {
		// Unreadable or blocked storage: start from the default universe.
	}
	return EMPTY;
}

const UniverseContext = createContext({
	selection: EMPTY,
	setSelection: () => {},
	dataAge: null,
	setDataAge: () => {},
});

export function UniverseProvider({ children }) {
	const [selection, setSelectionState] = useState(readStored);
	// How old, in hours, the galaxy dump the open view reads is; the shell
	// stamps it on the report header. Views that read no dump leave it null.
	const [dataAge, setDataAge] = useState(null);

	const setSelection = useCallback((next) => {
		setSelectionState(next);
		try {
			localStorage.setItem(UNIVERSE_STORAGE_KEY, JSON.stringify(next));
		} catch {
			// Remembering is a convenience; the selection still applies.
		}
	}, []);

	const value = useMemo(
		() => ({ selection, setSelection, dataAge, setDataAge }),
		[selection, setSelection, dataAge],
	);
	return <UniverseContext.Provider value={value}>{children}</UniverseContext.Provider>;
}

export function useUniverse() {
	return useContext(UniverseContext);
}

// Publishes a view's data age to the header for as long as the view is open.
export function useDataAge(age) {
	const { setDataAge } = useContext(UniverseContext);
	useEffect(() => {
		setDataAge(age);
		return () => setDataAge(null);
	}, [age, setDataAge]);
}

// The picker bound to the shared selection.
export function UniverseSelect() {
	const { selection, setSelection } = useUniverse();
	return <UniversePicker value={selection} onChange={setSelection} />;
}
