import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AirProvider from "./moca/AirProvider";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AirProvider>
      <App />
    </AirProvider>
  </StrictMode>
);

