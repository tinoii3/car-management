import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      {}
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </StrictMode>
);
