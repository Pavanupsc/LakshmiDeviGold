import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const DEFAULT_STATE = {
  rates: { gold22: 6200, silver: 95 },
  categories: [
    { id: 1, name: 'Bangles', metal: 'gold', emoji: '💍' },
    { id: 2, name: 'Necklace', metal: 'gold', emoji: '📿' },
    { id: 3, name: 'Earrings', metal: 'gold', emoji: '✨' },
    { id: 4, name: 'Chains', metal: 'gold', emoji: '⛓️' },
    { id: 5, name: 'Rings', metal: 'both', emoji: '💍' },
    { id: 6, name: 'Silver Bangles', metal: 'silver', emoji: '🔘' },
  ],
  products: [],
  settings: {
    shopName: 'Lakshmi Devi Jewellers',
    whatsapp: '919876543210',
    address: 'Opposite Government High School, Darsi, Prakasam District, Andhra Pradesh',
  },
  wishlist: [],
  catIdCounter: 7,
  prodIdCounter: 1,
};

function loadState() {
  try {
    const s = localStorage.getItem('ldj_state');
    if (s) return { ...DEFAULT_STATE, ...JSON.parse(s) };
  } catch (e) {}
  return DEFAULT_STATE;
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem('ldj_state', JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const calcGoldRate = (carat) => {
    const r22 = state.rates.gold22;
    const c = Number(carat);
    if (c === 22) return r22;
    if (c === 18) return Math.round(r22 * 18 / 22);
    if (c === 24) return Math.round(r22 * 24 / 22);
    return r22;
  };

  const calcProductPrice = (product) => {
    const gramRate = product.metal === 'silver' ? state.rates.silver : calcGoldRate(product.carat);
    const w = parseFloat(product.weight) || 0;
    const waste = parseFloat(product.wastage) || 0;
    const metalCost = gramRate * w;
    return Math.round(metalCost + metalCost * (waste / 100));
  };

  const updateRates = (gold22, silver) => {
    setState(s => ({ ...s, rates: { gold22: gold22 || s.rates.gold22, silver: silver || s.rates.silver } }));
  };

  const addCategory = (cat) => {
    setState(s => ({
      ...s,
      categories: [...s.categories, { ...cat, id: s.catIdCounter }],
      catIdCounter: s.catIdCounter + 1,
    }));
  };

  const deleteCategory = (id) => {
    setState(s => ({ ...s, categories: s.categories.filter(c => c.id !== id) }));
  };

  const addProduct = (product) => {
    setState(s => ({
      ...s,
      products: [...s.products, { ...product, id: s.prodIdCounter, createdAt: new Date().toISOString() }],
      prodIdCounter: s.prodIdCounter + 1,
    }));
  };

  const deleteProduct = (id) => {
    setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
  };

  const toggleWishlist = (id) => {
    setState(s => ({
      ...s,
      wishlist: s.wishlist.includes(id) ? s.wishlist.filter(x => x !== id) : [...s.wishlist, id],
    }));
  };

  const saveSettings = (settings) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...settings } }));
  };

  const openWhatsApp = (msg) => {
    const wa = state.settings.whatsapp || '919876543210';
    const text = msg || `Hi! I am interested in your jewellery at ${state.settings.shopName}`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <StoreContext.Provider value={{
      state, calcGoldRate, calcProductPrice,
      updateRates, addCategory, deleteCategory,
      addProduct, deleteProduct, toggleWishlist,
      saveSettings, openWhatsApp,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
