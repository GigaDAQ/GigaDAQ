import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import store from './store.ts';
import './index.css'
import { Provider } from 'react-redux';
import { Buffer } from 'buffer';

// Make Buffer global available
window.Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    
  </StrictMode>,
)
