import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import styles from './Storefront.module.css';

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&h=450&fit=crop&q=90', title: 'Bridal Collection 2026', sub: 'Crafted with love, worn with pride', cta: 'Shop Now' },
  { img: 'https://images.unsplash.com/photo-1573408301185-9519f94bf03d?w=900&h=450&fit=crop&q=90', title: 'Pure Gold Bangles', sub: 'Festival Special — Pure 22K Gold', cta: 'Explore' },
  { img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&h=450&fit=crop&q=90', title: 'Temple Jewellery', sub: 'Everyday Elegance, Timeless Craft', cta: 'View All' },
];

function HeroBanner() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={styles.hero}>
      {SLIDES.map((s, i) => (
        <div key={i} className={`${styles.slide} ${i === cur ? styles.slideActive : ''}`}>
          <img src={s.img} alt={s.title} />
          <div className={styles.slideOv} />
        </div>
      ))}
      <div className={styles.slideContent}>
        <p className={styles.slideSub}>{SLIDES[cur].sub}</p>
        <h1 className={styles.slideTitle}>{SLIDES[cur].title}</h1>
        <button className={styles.ctaBtn}>{SLIDES[cur].cta} →</button>
      </div>
      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button key={i} className={`${styles.dot} ${i === cur ? styles.dotActive : ''}`} onClick={() => setCur(i)} />
        ))}
      </div>
    </div>
  );
}

function GoldTicker() {
  const { state } = useStore();
  const r22 = state.rates.gold22;
  const rates = [
    { k: '24K', v: Math.round(r22 * 24 / 22) },
    { k: '22K', v: r22 },
    { k: '18K', v: Math.round(r22 * 18 / 22) },
    { k: 'Silver', v: state.rates.silver },
  ];
  return (
    <div className={styles.ticker}>
      <div className={styles.tickerLbl}>🪙 GOLD</div>
      {rates.map(r => (
        <div key={r.k} className={styles.tickCell}>
          <span className={styles.tickRate}>₹{r.v.toLocaleString()}</span>
          <span className={styles.tickK}>{r.k}</span>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const { state, calcProductPrice, toggleWishlist, openWhatsApp } = useStore();
  const price = calcProductPrice(product);
  const wishlisted = state.wishlist.includes(product.id);
  const metal = product.metal === 'silver' ? 'Silver' : `${product.carat}K Gold`;
  const waMsg = `Hi! I am interested in *${product.name}* (${metal}, ${product.weight}g) priced at ₹${price.toLocaleString()} at ${state.settings.shopName}, Darsi.`;

  return (
    <div className={styles.prodCard}>
      <div className={styles.prodImg}>
        {product.images && product.images[0]
          ? <img src={product.images[0]} alt={product.name} />
          : <div className={styles.noImg}>💍</div>}
        <button className={`${styles.wlBtn} ${wishlisted ? styles.wlActive : ''}`} onClick={() => toggleWishlist(product.id)}>
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      <div className={styles.prodBody}>
        <p className={styles.prodName}>{product.name}</p>
        <p className={styles.prodMeta}>{metal} · {product.weight}g</p>
        <p className={styles.prodPrice}>₹{price.toLocaleString()}</p>
        <button className={styles.waBtn} onClick={() => openWhatsApp(waMsg)}>
          💬 Contact on WhatsApp
        </button>
      </div>
    </div>
  );
}

export default function Storefront({ onAdminClick, preview = 'system' }) {
  const { state, openWhatsApp } = useStore();
  const [metal, setMetal] = useState('gold');
  const [activeCat, setActiveCat] = useState('all');
  const [activeTab, setActiveTab] = useState('home');

  const filteredCats = state.categories.filter(c => c.metal === metal || c.metal === 'both');
  const products = state.products.filter(p =>
    p.metal === metal && (activeCat === 'all' || p.catId === parseInt(activeCat))
  );

  const switchMetal = (m) => { setMetal(m); setActiveCat('all'); };

  return (
    <div className={`${styles.app} ${styles[`app_${preview}`]}`}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.brand}>🪔 <span>Lakshmi Devi</span></div>
        <div className={styles.navRight}>
          <button className={styles.navBtn}>🔍</button>
          <button className={styles.navBtn}>♡</button>
          <button className={styles.adminBtn} onClick={onAdminClick}>Admin ⚙️</button>
        </div>
      </nav>

      <main className={styles.main} id="top">
        <GoldTicker />

        {/* Metal Toggle */}
        <div className={styles.metalToggle}>
          <button className={`${styles.mtBtn} ${metal === 'gold' ? styles.mtActive : ''}`} onClick={() => switchMetal('gold')}>Gold</button>
          <button className={`${styles.mtBtn} ${styles.mtSilver} ${metal === 'silver' ? styles.mtSilverActive : ''}`} onClick={() => switchMetal('silver')}>Silver</button>
        </div>

        <HeroBanner />

        {/* Trust Strip */}
        <div className={styles.trustStrip} id="about">
          {[{ ico: '🔒', t: 'BIS Hallmark', d: 'Certified' }, { ico: '💯', t: 'Pure Gold', d: 'Guaranteed' }, { ico: '🏪', t: 'Since 2000', d: 'Trusted' }, { ico: '💬', t: 'WhatsApp', d: 'Quick Order' }].map(b => (
            <div key={b.t} className={styles.trustItem}>
              <span className={styles.trustIco}>{b.ico}</span>
              <p className={styles.trustT}>{b.t}</p>
              <p className={styles.trustD}>{b.d}</p>
            </div>
          ))}
        </div>

        {/* Category Pills */}
        <div className={styles.section}>
          <div className={styles.secHead}>
            <div className={styles.secAccRow}><div className={styles.secAcc} /><h2 className={styles.secTitle}>Browse</h2></div>
          </div>
        </div>
        <div className={styles.catPills}>
          <button className={`${styles.catPill} ${activeCat === 'all' ? styles.catPillActive : ''}`} onClick={() => setActiveCat('all')}>All</button>
          {filteredCats.map(c => (
            <button key={c.id} className={`${styles.catPill} ${activeCat === String(c.id) ? styles.catPillActive : ''}`} onClick={() => setActiveCat(String(c.id))}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* Products */}
        <section className={styles.section} id="collections">
          <div className={styles.secHead}>
            <div className={styles.secAccRow}><div className={styles.secAcc} /><h2 className={styles.secTitle}>🔥 Trending</h2></div>
          </div>
          {products.length === 0
            ? (<div className={styles.empty}><div className={styles.emptyIco}>💍</div><h3>No products yet</h3><p>Add products from the Admin Panel</p></div>)
            : (<div className={styles.prodGrid}>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>)
          }
        </section>

        {/* Marquee */}
        <div className={styles.marquee}>
          <div className={styles.marqueeInner}>
            {[1, 2, 3, 4].map(i => (
              <span key={i}>Lakshmi Devi Jewellers · Darsi, Andhra Pradesh · BIS Hallmarked · WhatsApp Orders · 22K & 18K Gold · Pure Silver · &nbsp;</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerBrand}>🪔 Lakshmi Devi Jewellers</div>
          <p className={styles.footerAddr}>Opposite Government High School<br />Darsi, Prakasam District, Andhra Pradesh</p>
          <div className={styles.footerLinks}>
            <a href="#about">About</a>
            <a href="#collections">Collections</a>
            <a href={`https://wa.me/${state.settings.whatsapp || '919876543210'}`} target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
          <p className={styles.footerCopy}>© 2026 Lakshmi Devi Jewellers. All rights reserved.</p>
        </footer>
      </main>

      {/* Bottom Tabs */}
      <div className={`${styles.bottomTabs} ${styles[`bottomTabs_${preview}`]}`}>
        {[{ l: 'Home', i: '🏠', k: 'home' }, { l: 'Gold', i: '🏅', k: 'gold' }, { l: 'Silver', i: '🥈', k: 'silver' }, { l: 'Location', i: '📍', k: 'loc' }, { l: 'Contact', i: '💬', k: 'contact' }].map(t => (
          <button key={t.k} className={`${styles.tab} ${activeTab === t.k ? styles.tabActive : ''}`}
            onClick={() => {
              setActiveTab(t.k);
              if (t.k === 'gold') switchMetal('gold');
              if (t.k === 'silver') switchMetal('silver');
              if (t.k === 'contact') openWhatsApp('');
              if (t.k === 'loc') window.open(`https://maps.google.com/?q=${encodeURIComponent(state.settings.address)}`, '_blank');
            }}>
            <span className={styles.tabIco}>{t.i}</span>
            <span className={styles.tabLabel}>{t.l}</span>
          </button>
        ))}
      </div>

      {/* Float WA */}
      <button className={`${styles.waFloat} ${styles[`waFloat_${preview}`]}`} onClick={() => openWhatsApp('')}>💬</button>
    </div>
  );
}
