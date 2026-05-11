import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import s from './AdminShared.module.css';

export default function CategoriesPage() {
  const { state, addCategory, deleteCategory } = useStore();
  const [form, setForm] = useState({ name: '', metal: 'gold', emoji: '' });
  const [msg, setMsg] = useState('');

  const handleAdd = () => {
    if (!form.name.trim()) { setMsg('⚠️ Enter a category name'); return; }
    addCategory({ name: form.name.trim(), metal: form.metal, emoji: form.emoji.trim() || '📦' });
    setForm({ name: '', metal: 'gold', emoji: '' });
    setMsg('✅ Category added!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <div className={s.panelCard}>
        <h3>➕ Add Category</h3>
        <div className={s.formRow}>
          <div className={s.formGroup} style={{ marginBottom: 0 }}>
            <label className={s.formLabel}>Category Name *</label>
            <input className={s.formInput} type="text" placeholder="e.g. Bangles" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className={s.formGroup} style={{ marginBottom: 0 }}>
            <label className={s.formLabel}>Metal Type</label>
            <select className={s.formSelect} value={form.metal} onChange={e => setForm(f => ({ ...f, metal: e.target.value }))}>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div className={s.formGroup} style={{ marginTop: 12 }}>
          <label className={s.formLabel}>Emoji Icon</label>
          <input className={s.formInput} type="text" placeholder="e.g. 💍" maxLength={4} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={{ width: 80 }} />
        </div>
        <button className={s.submitBtn} onClick={handleAdd}>+ Add Category</button>
        <p className={s.successMsg} style={{ marginTop: 10 }}>{msg}</p>
      </div>

      <div className={s.panelCard}>
        <h3>📁 Existing Categories ({state.categories.length})</h3>
        {state.categories.length === 0
          ? <div className={s.empty} style={{ padding: 20 }}><p>No categories yet</p></div>
          : (
            <div className={s.catList}>
              {state.categories.map(c => (
                <div key={c.id} className={s.catListItem}>
                  <div>
                    <div className={s.catName}>{c.emoji} {c.name}</div>
                    <div className={s.catType}>{c.metal.charAt(0).toUpperCase() + c.metal.slice(1)}</div>
                  </div>
                  <button className={`${s.tblAction} ${s.tblDel}`} onClick={() => { if (window.confirm('Delete this category?')) deleteCategory(c.id); }}>🗑 Delete</button>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
