import React, { useState } from 'react';
import Dashboard from './Dashboard';
import RatesPage from './RatesPage';
import AddProduct from './AddProduct';
import ProductsTable from './ProductsTable';
import CategoriesPage from './CategoriesPage';
import SettingsPage from './SettingsPage';
import styles from './Admin.module.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', ico: '📊' },
  { id: 'rates', label: 'Update Rates', ico: '💰' },
  { id: 'add-product', label: 'Add Product', ico: '➕' },
  { id: 'products', label: 'All Products', ico: '💍' },
  { id: 'categories', label: 'Categories', ico: '📁' },
  { id: 'settings', label: 'Settings', ico: '⚙️' },
];

const PAGE_TITLES = { dashboard: 'Dashboard', rates: 'Update Rates', 'add-product': 'Add Product', products: 'All Products', categories: 'Categories', settings: 'Settings' };

export default function AdminPanel({ onBack }) {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />;
      case 'rates': return <RatesPage />;
      case 'add-product': return <AddProduct />;
      case 'products': return <ProductsTable />;
      case 'categories': return <CategoriesPage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={styles.adminWrap}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarBrand}>
          <h2>🪔 Lakshmi Devi</h2>
          <p>Jewellers Admin</p>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV.map(n => (
            <button key={n.id} className={`${styles.sidebarLink} ${page === n.id ? styles.sidebarLinkActive : ''}`}
              onClick={() => { setPage(n.id); setSidebarOpen(false); }}>
              <span className={styles.slIco}>{n.ico}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarUser}><strong>Admin</strong>Lakshmi Devi Jewellers</div>
          <button className={styles.logoutBtn} onClick={onBack}>🏪 View Store</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.adminMain}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <h1 className={styles.pageTitle}>{PAGE_TITLES[page]}</h1>
              <p className={styles.pageSub}>Lakshmi Devi Jewellers Admin</p>
            </div>
          </div>
          <button className={styles.backBtn} onClick={onBack}>← View Store</button>
        </div>
        <div className={styles.pageContent}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
