import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import s from './AdminShared.module.css';

export default function SettingsPage() {
  const { state, saveSettings } = useStore();
  const [form, setForm] = useState({ ...state.settings });
  const [msg, setMsg] = useState('');

  const handleSave = () => {
    saveSettings(form);
    setMsg('✅ Settings saved successfully!');
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className={s.panelCard}>
      <h3>⚙️ Business Settings</h3>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Shop Name</label>
        <input className={s.formInput} type="text" value={form.shopName} onChange={e => setForm(f => ({ ...f, shopName: e.target.value }))} />
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel}>WhatsApp Number (with country code)</label>
        <input className={s.formInput} type="text" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="e.g. 919876543210" />
        <p style={{ fontSize: 10, color: 'var(--grey)', marginTop: 4 }}>Format: 91XXXXXXXXXX (no +, no spaces)</p>
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Address</label>
        <textarea className={s.formTextarea} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
      </div>
      <button className={`${s.submitBtn} ${s.submitBtnFull}`} onClick={handleSave}>💾 Save Settings</button>
      <p className={s.successMsg} style={{ marginTop: 10 }}>{msg}</p>
    </div>
  );
}
