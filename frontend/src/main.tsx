/// <reference lib="dom" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import './index.css'
import { Provider } from'react-redux'
import store from './app/store'

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://revenue-monitoring-backend.onrender.com');

console.log('BASE_URL:', BASE_URL);
//declare let window: any;

declare global {
  interface Window {
    process?: {
      env: {
        NODE_ENV: 'development' | 'production' | 'test';
        [key: string]: string | undefined;
      };
    };
  }
}


window.process = {
  env: {
    NODE_ENV: 'development', // or set dynamically based on actual environment
  },
};


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);


