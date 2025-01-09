/* eslint-disable react/jsx-no-undef */
 // Highlights potential problems in the app.
import { createRoot } from 'react-dom/client'; // To render React components.
import './index.css'; // Global styles, including Tailwind CSS.
import App from './App.jsx'; // Main App component.

import { BrowserRouter } from 'react-router-dom'; // Correctly import BrowserRouter.

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <App />
    </BrowserRouter>

);
