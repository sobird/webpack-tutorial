/**
 * index.ts
 *
 * sobird<i@sobird.me> at 2019-11-08 15:11:12 build.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

module?.hot?.accept();
