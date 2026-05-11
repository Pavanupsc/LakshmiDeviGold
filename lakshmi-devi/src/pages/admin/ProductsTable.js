import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import s from './AdminShared.module.css';

export default function ProductsTable() {
  const { state, deleteProduct, calcProductPrice } = useStore();
  const [search, setSearch] = useState('');

  const filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={s.tableWrap}>
      <div className={s.tableHead}>
        <h3>All Products ({state.products.length})</h3>
        <input className={s.tableSearch} type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0
        ? <div className={s.empty}><div className={s.emptyIco}>📦</div><h3>No products found</h3><p>{search ? 'Try a different search' : 'Add products from Add Product page'}</p></div>
        : (
          <div className={s.tableOuter}>
            <table>
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Metal</th><th>Carat</th><th>Weight</th><th>Wastage</th><th>Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {[...filtered].reverse().map(p => {
                  const price = calcProductPrice(p);
                  const cat = state.categories.find(c => c.id === p.catId);
                  return (
                    <tr key={p.id}>
                      <td>
                        {p.images && p.images[0]
                          ? <img src={p.images[0]} alt={p.name} className={s.prodThumb} />
                          : <div className={s.thumbPlaceholder}>💍</div>}
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td style={{ fontSize: 11, color: 'var(--grey)' }}>{cat ? `${cat.emoji} ${cat.name}` : '—'}</td>
                      <td><span className={`${s.badge} ${p.metal === 'silver' ? s.badgeSilver : s.badgeGold}`}>{p.metal.toUpperCase()}</span></td>
                      <td>{p.metal === 'silver' ? p.carat : `${p.carat}K`}</td>
                      <td>{p.weight}g</td>
                      <td>{p.wastage}%</td>
                      <td><strong style={{ color: 'var(--maroon)' }}>₹{price.toLocaleString()}</strong></td>
                      <td>
                        <button className={`${s.tblAction} ${s.tblDel}`} onClick={() => { if (window.confirm('Delete this product?')) deleteProduct(p.id); }}>🗑 Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
