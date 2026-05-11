import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import s from './AdminShared.module.css';

export default function RatesPage() {
  const { state, updateRates } = useStore();
  const [gold22, setGold22] = useState(state.rates.gold22);
  const [silver, setSilver] = useState(state.rates.silver);
  const [msg, setMsg] = useState('');

  const handleSave = () => {
    const g = parseFloat(gold22);
    const sv = parseFloat(silver);
    if (!g || g <= 0) { setMsg('⚠️ Enter valid gold rate'); return; }
    if (!sv || sv <= 0) { setMsg('⚠️ Enter valid silver rate'); return; }
    updateRates(g, sv);
    setMsg(`✅ Rates saved at ${new Date().toLocaleTimeString()} — all product prices updated!`);
    setTimeout(() => setMsg(''), 5000);
  };

  const r22 = parseFloat(gold22) || state.rates.gold22;
  const derived = [
    { label: 'Gold 24K', val: `₹${Math.round(r22 * 24 / 22).toLocaleString()}/g` },
    { label: 'Gold 22K', val: `₹${r22.toLocaleString()}/g` },
    { label: 'Gold 18K', val: `₹${Math.round(r22 * 18 / 22).toLocaleString()}/g` },
    { label: 'Silver', val: `₹${(parseFloat(silver) || state.rates.silver).toLocaleString()}/g` },
  ];

  return (
    <div>
      <div className={s.panelCard}>
        <h3>💰 Daily Rate Management</h3>
        <p style={{ fontSize: 12, color: 'var(--grey)', marginBottom: 18 }}>
          Update rates once — every product price auto-recalculates based on grams, carat & wastage.
          <br /><strong style={{ color: 'var(--maroon)' }}>Formula: Price = (Rate × Weight) + (Rate × Wastage%)</strong>
        </p>
        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>22K Gold Rate (₹/gram) *</label>
            <input className={s.formInput} type="number" value={gold22} onChange={e => setGold22(e.target.value)} placeholder="e.g. 6200" />
            <p style={{ fontSize: 10, color: 'var(--grey)', marginTop: 4 }}>18K and 24K are auto-derived from this</p>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Silver Rate (₹/gram) *</label>
            <input className={s.formInput} type="number" value={silver} onChange={e => setSilver(e.target.value)} placeholder="e.g. 95" />
          </div>
        </div>
        <button className={`${s.submitBtn} ${s.submitBtnFull}`} onClick={handleSave}>🔄 Update All Prices Now</button>
        <p className={s.successMsg}>{msg}</p>
      </div>

      <div className={s.panelCard}>
        <h3>📋 Live Rate Preview</h3>
        <div className={s.ratesGrid}>
          {derived.map(r => (
            <div key={r.label} className={s.rateDisplay}>
              <p>{r.label}</p>
              <strong>{r.val}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
