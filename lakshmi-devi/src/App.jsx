import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Storefront from './pages/store/Storefront';
import AdminPanel from './pages/admin/AdminPanel';
import './index.css';
export default function App() {
  const [view, setView] = useState('store');
  const [preview, setPreview] = useState('system'); // 'system' | 'mobile'

  const togglePreview = () => setPreview(p => (p === 'mobile' ? 'system' : 'mobile'));
  return (
    <StoreProvider>
      <div className={`appShell ${preview === 'mobile' ? 'appShellMobile' : 'appShellSystem'}`}>
        <div className="previewToggle" role="group" aria-label="Preview mode">
          <button
            type="button"
            className={`previewBtn ${preview === 'system' ? 'previewBtnActive' : ''}`}
            onClick={() => setPreview('system')}
          >
            🖥️ System
          </button>
          <button
            type="button"
            className={`previewBtn ${preview === 'mobile' ? 'previewBtnActive' : ''}`}
            onClick={() => setPreview('mobile')}
          >
            📱 Mobile
          </button>
        </div>

      {view === 'store'
        ? <Storefront onAdminClick={() => setView('admin')} preview={preview} onTogglePreview={togglePreview} />
        : <AdminPanel onBack={() => setView('store')} preview={preview} onTogglePreview={togglePreview} />}
      </div>
    </StoreProvider>
  );
}
