import React from 'react';
import { createRoot } from 'react-dom/client';
import './app.scss';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';

const root = createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<I18nProvider>
			<App />
		</I18nProvider>
	</React.StrictMode>
);
