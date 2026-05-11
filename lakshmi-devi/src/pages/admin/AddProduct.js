import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import s from './AdminShared.module.css';

export default function AddProduct() {
  const { state, calcGoldRate, addProduct } = useStore();
  const [form, setForm] = useState({ name: '', catId: '', metal: 'gold', carat: '22', weight: '', wastage: '', desc: '' });
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const gramRate = form.metal === 'silver' ? state.rates.silver : calcGoldRate(form.carat);
  const w = parseFloat(form.weight) || 0;
  const waste = parseFloat(form.wastage) || 0;
  const calcedPrice = w > 0 ? Math.round(gramRate * w * (1 + waste / 100)) : 0;

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setImages(imgs => [...imgs, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImg = (i) => setImages(imgs => imgs.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (!form.name.trim()) { setMsg('⚠️ Enter product name'); return; }
    if (!form.catId) { setMsg('⚠️ Select a category'); return; }
    if (!form.weight || parseFloat(form.weight) <= 0) { setMsg('⚠️ Enter valid weight'); return; }
    if (form.wastage === '') { setMsg('⚠️ Enter wastage %'); return; }
    addProduct({ ...form, catId: parseInt(form.catId), images });
    setForm({ name: '', catId: '', metal: 'gold', carat: '22', weight: '', wastage: '', desc: '' });
    setImages([]);
    setMsg('✅ Product added successfully!');
    setTimeout(() => setMsg(''), 4000);
  };

  const caratOptions = form.metal === 'silver'
    ? [{ v: '999', l: '999 Pure' }, { v: '925', l: '925 Sterling' }]
    : [{ v: '22', l: '22K' }, { v: '18', l: '18K' }, { v: '24', l: '24K' }];

  return (
    <div className={s.panelCard}>
      <h3>➕ Add New Product</h3>
      <div className={s.formRow}>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Product Name *</label>
          <input className={s.formInput} type="text" placeholder="e.g. Fancy Jhumka Set" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Category *</label>
          <select className={s.formSelect} value={form.catId} onChange={e => set('catId', e.target.value)}>
            <option value="">— Select Category —</option>
            {state.categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Metal Type *</label>
          <select className={s.formSelect} value={form.metal} onChange={e => { set('metal', e.target.value); set('carat', e.target.value === 'silver' ? '999' : '22'); }}>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Carat / Purity *</label>
          <select className={s.formSelect} value={form.carat} onChange={e => set('carat', e.target.value)}>
            {caratOptions.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Weight (grams) *</label>
          <input className={s.formInput} type="number" step="0.01" placeholder="e.g. 5.5" value={form.weight} onChange={e => set('weight', e.target.value)} />
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Wastage % *</label>
          <input className={s.formInput} type="number" step="0.1" placeholder="e.g. 12" value={form.wastage} onChange={e => set('wastage', e.target.value)} />
        </div>
      </div>

      {/* Price Preview */}
      <div className={s.pricePreview}>
        <p>Calculated Selling Price</p>
        <strong>{calcedPrice > 0 ? `₹${calcedPrice.toLocaleString()}` : 'Fill weight & wastage to preview'}</strong>
        {calcedPrice > 0 && (
          <p className={s.priceNote}>
            {form.weight}g × ₹{gramRate}/g + {form.wastage}% wastage = ₹{calcedPrice.toLocaleString()}
          </p>
        )}
      </div>

      <div className={s.formGroup}>
        <label className={s.formLabel}>Description</label>
        <textarea className={s.formTextarea} placeholder="Describe the product..." value={form.desc} onChange={e => set('desc', e.target.value)} />
      </div>

      <div className={s.formGroup}>
        <label className={s.formLabel}>Product Images / Videos</label>
        <div className={s.uploadZone}>
          <input type="file" accept="image/*,video/*" multiple onChange={handleImages} />
          <div className={s.uploadIco}>📸</div>
          <p><strong>Click to upload</strong> or drag & drop</p>
          <p style={{ marginTop: 4 }}>Images & Videos supported</p>
        </div>
        {images.length > 0 && (
          <div className={s.imgGrid}>
            {images.map((img, i) => (
              <div key={i} className={s.imgPrev}>
                <img src={img} alt={`preview-${i}`} />
                <button className={s.imgDel} onClick={() => removeImg(i)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={`${s.submitBtn} ${s.submitBtnFull}`} onClick={handleSubmit}>💾 Save Product</button>
      <p className={s.successMsg} style={{ marginTop: 10 }}>{msg}</p>
    </div>
  );
}
