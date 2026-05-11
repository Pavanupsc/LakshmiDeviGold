import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import s from './AdminShared.module.css';

export default function Dashboard({ onNavigate }) {
  const { state, updateRates, calcProductPrice } = useStore();
  const [gold22, setGold22] = useState(state.rates.gold22);
  const [silver, setSilver] = useState(state.rates.silver);
  const [msg, setMsg] = useState('');

  const handleUpdate = () => {
    updateRates(parseFloat(gold22), parseFloat(silver));
    setMsg(`✅ All prices updated at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setMsg(''), 4000);
  };

  const recent = [...state.products].reverse().slice(0, 5);

  return (
    <div>
      {/* Stats */}
      <div className={s.statGrid}>
        <div className={s.statCard}><div className={s.statIco}>💍</div><div className={s.statVal}>{state.products.length}</div><div className={s.statLbl}>Total Products</div></div>
        <div className={s.statCard}><div className={s.statIco}>📁</div><div className={s.statVal}>{state.categories.length}</div><div className={s.statLbl}>Categories</div></div>
        <div className={s.statCard}><div className={s.statIco}>🏅</div><div className={s.statVal}>₹{state.rates.gold22.toLocaleString()}</div><div className={s.statLbl}>Gold 22K /gram</div></div>
        <div className={s.statCard}><div className={s.statIco}>🥈</div><div className={s.statVal}>₹{state.rates.silver}</div><div className={s.statLbl}>Silver /gram</div></div>
      </div>

      {/* Quick Rate Update */}
      <div className={s.rateCard}>
        <h3>⚡ QUICK RATE UPDATE — All prices recalculate instantly</h3>
        <div className={s.rateInputs}>
          <div className={s.rateField}>
            <label>22K GOLD (₹/gram)</label>
            <input type="number" value={gold22} onChange={e => setGold22(e.target.value)} placeholder="e.g. 6200" />
          </div>
          <div className={s.rateField}>
            <label>SILVER (₹/gram)</label>
            <input type="number" value={silver} onChange={e => setSilver(e.target.value)} placeholder="e.g. 95" />
          </div>
        </div>
        <button className={s.updateRateBtn} onClick={handleUpdate}>🔄 Update All Prices Now</button>
        <p className={s.rateMsg}>{msg}</p>
      </div>

      {/* Recent Products */}
      <div className={s.tableWrap}>
        <div className={s.tableHead}>
          <h3>Recent Products</h3>
          <button className={`${s.submitBtn}`} style={{ padding: '7px 16px', fontSize: '12px' }} onClick={() => onNavigate('add-product')}>+ Add Product</button>
        </div>
        {recent.length === 0
          ? <div className={s.empty}><div className={s.emptyIco}>📦</div><h3>No products yet</h3><p>Go to Add Product to get started</p></div>
          : (
            <div className={s.tableOuter}>
              <table>
                <thead><tr><th>Name</th><th>Metal</th><th>Weight</th><th>Price</th></tr></thead>
                <tbody>
                  {recent.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td><span className={`${s.badge} ${p.metal === 'silver' ? s.badgeSilver : s.badgeGold}`}>{p.metal.toUpperCase()}</span></td>
                      <td>{p.weight}g</td>
                      <td><strong style={{ color: 'var(--maroon)' }}>₹{calcProductPrice(p).toLocaleString()}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
