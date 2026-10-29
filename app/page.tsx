'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingCart, 
  Truck, 
  MapPin, 
  Phone, 
  Lock, 
  Unlock,
  CheckCircle2, 
  Layers, 
  Wrench, 
  PackageCheck,
  Eye,
  PlusCircle,
  Compass,
  X,
  KeyRound
} from 'lucide-react';

interface FilmProduct {
  id: string;
  series: 'C2 Carbon' | 'C2 Ceramic';
  vlt: '5%' | '20%' | '35%' | '50%' | '70%';
  masterRollPrice: number;
  linearFtPrice: number;
  stockFt: number;
  description: string;
}

interface ToolProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQty: number;
  description: string;
}

export default function ApexPortal() {
  // B2B Pricing Access State
  const [pricingUnlocked, setPricingUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Quick Unlock Modal Form State
  const [quickShopName, setQuickShopName] = useState('');
  const [quickTpt, setQuickTpt] = useState('');
  const [quickEmail, setQuickEmail] = useState('');

  // Admin restock portal state (Passcode: 8923)
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Film inventory (+8% wholesale adjustment)
  const [filmInventory, setFilmInventory] = useState<FilmProduct[]>([
    { id: 'c2-carb-5', series: 'C2 Carbon', vlt: '5%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-20', series: 'C2 Carbon', vlt: '20%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-35', series: 'C2 Carbon', vlt: '35%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-50', series: 'C2 Carbon', vlt: '50%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-70', series: 'C2 Carbon', vlt: '70%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-cer-5', series: 'C2 Ceramic', vlt: '5%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 49, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-20', series: 'C2 Ceramic', vlt: '20%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-35', series: 'C2 Ceramic', vlt: '35%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 28, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-50', series: 'C2 Ceramic', vlt: '50%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 50, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-70', series: 'C2 Ceramic', vlt: '70%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 56, description: 'Nano-ceramic heat rejection formulation.' }
  ]);

  // Shop tools and consumables
  const [toolsInventory, setToolsInventory] = useState<ToolProduct[]>([
    { 
      id: 'nt-cutter-pro-a1p', 
      name: 'NT Cutter Pro A-1P "Red Dot" Knife', 
      category: 'Knives', 
      price: 10.00, 
      stockQty: 10, 
      description: 'Auto-lock precision stainless steel graphic knife with 30° angle.' 
    },
    { 
      id: 'banana-buffers-10pk', 
      name: 'Banana Buffers Squeegee Wings (10/pk)', 
      category: 'Buffers', 
      price: 16.00, 
      stockQty: 12, 
      description: 'Pre-cut wet-wing felt buffers for streak-free, scratchless squeegee glide.' 
    },
    { 
      id: 'blade-pack-30deg', 
      name: '30° Precision Snap-Off Blades (Pack)', 
      category: 'Blades', 
      price: 12.00, 
      stockQty: 13, 
      description: 'Ultra-sharp 30-degree segment blades for intricate automotive edge trimming.' 
    },
    { 
      id: 'nt-cutter-ba50ss', 
      name: 'NT Cutter BA-50SS 9mm Stainless Blades (50/pk)', 
      category: 'Blades', 
      price: 25.00, 
      stockQty: 1, 
      description: 'Rust-resistant 58-degree surgical stainless blades (Low Stock).' 
    },
    { 
      id: 'hard-card-gold-4in', 
      name: '3M Pro Squeegee Hard Card (Gold 4")', 
      category: 'Hard Cards', 
      price: 5.00, 
      stockQty: 10, 
      description: 'Teflon-infused firm hard card for corner setting and shrinking edges.' 
    }
  ]);

  // Catalog tab selection
  const [activeTab, setActiveTab] = useState<'film' | 'tools'>('film');
  const [selectedFilmSeries, setSelectedFilmSeries] = useState<'C2 Carbon' | 'C2 Ceramic'>('C2 Ceramic');
  const [selectedVlt, setSelectedVlt] = useState<'5%' | '20%' | '35%' | '50%' | '70%'>('20%');
  const [orderType, setOrderType] = useState<'roll' | 'cut'>('roll');
  const [rollsCount, setRollsCount] = useState<number>(1);
  const [linearFeet, setLinearFeet] = useState<number>(25);

  const [cart, setCart] = useState<any[]>([]);

  // B2B Checkout state
  const [shopName, setShopName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [tptLicense, setTptLicense] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'local-quad' | 'extended'>('local-quad');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  // Restock form state
  const [restockItemType, setRestockItemType] = useState<'film' | 'tool'>('film');
  const [restockTarget, setRestockTarget] = useState<string>('c2-cer-20');
  const [restockAmount, setRestockAmount] = useState<number>(100);

  // Active film selection
  const currentFilm = filmInventory.find(
    (f) => f.series === selectedFilmSeries && f.vlt === selectedVlt
  )!;

  // Pricing calculations
  const filmPrice = orderType === 'roll' 
    ? rollsCount * currentFilm.masterRollPrice 
    : linearFeet * currentFilm.linearFtPrice;

  // Handle Quick B2B Unlock
  const handleQuickUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickShopName.trim().length > 1 && quickTpt.trim().length >= 6) {
      setPricingUnlocked(true);
      setShowUnlockModal(false);
      setShopName(quickShopName);
      setTptLicense(quickTpt);
      if (quickEmail) setContactEmail(quickEmail);
    } else {
      alert('Please enter a valid Shop Name and Arizona TPT Resale License #.');
    }
  };

  const handleAddFilmToCart = () => {
    if (!pricingUnlocked && !adminUnlocked) {
      setShowUnlockModal(true);
      return;
    }
    const newItem = {
      id: `cart-${Date.now()}`,
      category: 'Film',
      productId: currentFilm.id,
      series: currentFilm.series,
      vlt: currentFilm.vlt,
      orderType,
      rolls: orderType === 'roll' ? rollsCount : 0,
      linearFt: orderType === 'roll' ? rollsCount * 100 : linearFeet,
      unitPrice: orderType === 'roll' ? currentFilm.masterRollPrice : currentFilm.linearFtPrice,
      totalPrice: filmPrice
    };
    setCart((prev) => [...prev, newItem]);
  };

  const handleAddToolToCart = (tool: ToolProduct) => {
    if (!pricingUnlocked && !adminUnlocked) {
      setShowUnlockModal(true);
      return;
    }
    if (tool.stockQty <= 0) return;
    const existingIndex = cart.findIndex((item) => item.productId === tool.id);
    if (existingIndex > -1) {
      if (cart[existingIndex].quantity >= tool.stockQty) {
        alert(`Only ${tool.stockQty} unit(s) available in stock.`);
        return;
      }
      setCart((prev) => {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * tool.price;
        return updated;
      });
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          category: 'Tool',
          productId: tool.id,
          name: tool.name,
          quantity: 1,
          unitPrice: tool.price,
          totalPrice: tool.price
        }
      ]);
    }
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = fulfillmentType === 'extended' ? 50.00 : 0.00;
  const finalOrderTotal = cartSubtotal + deliveryFee;

  const isB2BValid = shopName.trim().length > 1 && contactName.trim().length > 1 && contactEmail.includes('@') && tptLicense.trim().length >= 6;
  const isUnlocked = pricingUnlocked || adminUnlocked;

  // Passcode unlock (8923)
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt === '8923') {
      setAdminUnlocked(true);
      setPricingUnlocked(true);
      setPasscodeError(false);
      setPasscodeAttempt('');
    } else {
      setPasscodeError(true);
    }
  };

  // Inventory Receiving
  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockItemType === 'film') {
      setFilmInventory((prev) =>
        prev.map((item) =>
          item.id === restockTarget
            ? { ...item, stockFt: item.stockFt + Number(restockAmount) }
            : item
        )
      );
    } else {
      setToolsInventory((prev) =>
        prev.map((item) =>
          item.id === restockTarget
            ? { ...item, stockQty: item.stockQty + Number(restockAmount) }
            : item
        )
      );
    }
  };

  // Order Submit
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!isB2BValid) {
      alert('Verification Required: Please enter your Registered Business Name, Contact Info, and Arizona TPT Resale License #.');
      return;
    }

    const orderId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;

    const fulfillmentDescription = 
      fulfillmentType === 'pickup' 
        ? 'Prescott Valley Hub Pickup (Free)' 
        : fulfillmentType === 'local-quad' 
        ? 'Quad Cities Local Courier (Prescott Valley, Prescott, Chino Valley, Dewey) - FREE'
        : 'Extended Regional Delivery (Outside Quad Cities) - $50.00 Fee Applied';

    const orderPayload = {
      orderId,
      shopName,
      contactName,
      contactEmail,
      tptLicense,
      fulfillmentType: fulfillmentDescription,
      subtotal: cartSubtotal,
      deliveryFee,
      total: finalOrderTotal,
      items: [...cart],
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      console.log('Order email dispatch response:', data);
    } catch (err) {
      console.error('Failed to trigger email notification:', err);
    }

    setFilmInventory((prev) => {
      const updated = [...prev];
      cart.forEach((cartItem) => {
        if (cartItem.category === 'Film') {
          const idx = updated.findIndex((inv) => inv.id === cartItem.productId);
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              stockFt: Math.max(0, updated[idx].stockFt - cartItem.linearFt)
            };
          }
        }
      });
      return updated;
    });

    setToolsInventory((prev) => {
      const updated = [...prev];
      cart.forEach((cartItem) => {
        if (cartItem.category === 'Tool') {
          const idx = updated.findIndex((tool) => tool.id === cartItem.productId);
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              stockQty: Math.max(0, updated[idx].stockQty - cartItem.quantity)
            };
          }
        }
      });
      return updated;
    });

    setLastOrderDetails(orderPayload);
    setCart([]);
    setOrderSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 font-sans selection:bg-emerald-500 selection:text-white pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-[#121d24] border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">PRESCOTT VALLEY WHOLESALE HUB:</span>
            <span>Commercial Resale Distribution • Free Quad Cities Delivery • Verified Licensed Accounts</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1 font-mono"><Phone className="w-3.5 h-3.5 text-emerald-400" /> Dispatch: (928) 420-3903</span>
            <span>|</span>
            <span className="text-gray-400">orders@apexrollsupply.com</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-gray-800 bg-[#161b22]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-950">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">APEX ROLL SUPPLY CO.</h1>
              <p className="text-xs text-gray-400 tracking-tight">Window Tint Distribution &amp; Linear Supply Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 px-3 py-1.5 rounded-full text-xs font-semibold">
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wholesale Rates Active</span>
              </div>
            ) : (
              <button
                onClick={() => setShowUnlockModal(true)}
                className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlock Wholesale Pricing</span>
              </button>
            )}

            <a 
              href="#cart-section" 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.length})</span>
            </a>
          </div>
        </div>
      </header>

      {/* Quick B2B Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowUnlockModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Commercial Account Verification</h3>
                <p className="text-xs text-gray-400">Enter shop credentials to view dealer rates &amp; roll pricing.</p>
              </div>
            </div>

            <form onSubmit={handleQuickUnlockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Registered Shop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Desert Tint Works"
                  value={quickShopName}
                  onChange={(e) => setQuickShopName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Arizona TPT Resale License # *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21000000"
                  value={quickTpt}
                  onChange={(e) => setQuickTpt(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Shop Email (Optional)</label>
                <input
                  type="email"
                  placeholder="orders@yourshop.com"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Reveal Wholesale Rates
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Wholesale Product Catalog</h2>
            <p className="text-sm text-gray-400 mt-1">
              High-performance 40" wide Geoshield C2 Master Rolls &amp; Custom Linear Foot Cuts.
            </p>
          </div>
          <div className="flex gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('film')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'film' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Window Film
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'tools' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Shop Supplies &amp; Tools
            </button>
          </div>
        </div>

        {/* Tab 1: Film Catalog */}
        {activeTab === 'film' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Choose Series */}
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs">1</span>
                  Select Film Series
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedFilmSeries('C2 Ceramic')}
                    className={`p-4 rounded-xl border text-left transition ${
                      selectedFilmSeries === 'C2 Ceramic'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-white text-base">C2 Ceramic Series</div>
                      <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">Most Popular</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Ultra-high IR rejection, ceramic nano-particles, true neutral-black tone.</p>
                    <div className="mt-4 text-xs font-mono flex items-center gap-2">
                      <span className="text-gray-400">Master Roll:</span>
                      <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'filter blur-sm select-none text-emerald-300'}>
                        {isUnlocked ? '$481.68' : '$48X.XX'}
                      </span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-400">Cut:</span>
                      <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'filter blur-sm select-none text-emerald-300'}>
                        {isUnlocked ? '$5.89 / ft' : '$X.XX / ft'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedFilmSeries('C2 Carbon')}
                    className={`p-4 rounded-xl border text-left transition ${
                      selectedFilmSeries === 'C2 Carbon'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-white text-base">C2 Carbon Series</div>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">Value Performance</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Advanced carbon dye formulation. Signal friendly with color-stable guarantee.</p>
                    <div className="mt-4 text-xs font-mono flex items-center gap-2">
                      <span className="text-gray-400">Master Roll:</span>
                      <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'filter blur-sm select-none text-emerald-300'}>
                        {isUnlocked ? '$331.56' : '$33X.XX'}
                      </span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-400">Cut:</span>
                      <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'filter blur-sm select-none text-emerald-300'}>
                        {isUnlocked ? '$4.16 / ft' : '$X.XX / ft'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Choose VLT Shade */}
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs">2</span>
                  Select Visible Light Transmission (VLT)
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {(['5%', '20%', '35%', '50%', '70%'] as const).map((shade) => (
                    <button
                      key={shade}
                      onClick={() => setSelectedVlt(shade)}
                      className={`py-3 px-2 rounded-xl border text-center transition ${
                        selectedVlt === shade
                          ? 'border-emerald-500 bg-emerald-900/30 text-white font-bold ring-1 ring-emerald-500'
                          : 'border-gray-800 bg-gray-900 text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      <div className="text-lg font-black">{shade}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase">
                        {shade === '5%' ? 'Limo' : shade === '20%' ? 'Factory' : shade === '35%' ? 'Legal' : shade === '50%' ? 'Light' : 'Shield'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Format */}
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs">3</span>
                  Select Order Format (40" Width)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setOrderType('roll')}
                    className={`p-4 rounded-xl border text-left transition ${
                      orderType === 'roll'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
                    }`}
                  >
                    <div className="font-bold text-white">Full Master Roll (100 ft)</div>
                    <div className="text-xs text-gray-400 mt-1">40" x 100' factory sealed box. Best volume pricing.</div>
                    <div className="mt-3 text-sm font-mono font-bold">
                      <span className={isUnlocked ? 'text-emerald-400' : 'filter blur-sm select-none text-emerald-300'}>
                        {isUnlocked ? `$${currentFilm.masterRollPrice.toFixed(2)} / roll` : '$4XX.XX / roll'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setOrderType('cut')}
                    className={`p-4 rounded-xl border text-left transition ${
                      orderType === 'cut'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
                    }`}
                  >
                    <div className="font-bold text-white">Custom Linear Foot Cut</div>
                    <div className="text-xs text-gray-400 mt-1">Order exact yardage needed without carrying full roll stock.</div>
                    <div className="mt-3 text-sm font-mono font-bold">
                      <span className={isUnlocked ? 'text-emerald-400' : 'filter blur-sm select-none text-emerald-300'}>
                        {isUnlocked ? `$${currentFilm.linearFtPrice.toFixed(2)} / ft` : '$X.XX / ft'}
                      </span>
                    </div>
                  </button>
                </div>

                {orderType === 'roll' ? (
                  <div className="flex items-center gap-4 bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                    <span className="text-sm font-medium text-gray-300">Rolls Count:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setRollsCount(Math.max(1, rollsCount - 1))}
                        className="w-8 h-8 rounded-lg bg-gray-800 text-white font-bold hover:bg-gray-700 transition"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-lg w-8 text-center">{rollsCount}</span>
                      <button 
                        onClick={() => setRollsCount(rollsCount + 1)}
                        className="w-8 h-8 rounded-lg bg-gray-800 text-white font-bold hover:bg-gray-700 transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto font-mono">Total Footage: {rollsCount * 100} Linear Ft</span>
                  </div>
                ) : (
                  <div className="space-y-3 bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300 font-medium">Desired Length:</span>
                      <span className="font-mono text-emerald-400 font-bold text-base">{linearFeet} Linear Feet</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      step="5" 
                      value={linearFeet}
                      onChange={(e) => setLinearFeet(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                      <span>10 ft</span>
                      <span>25 ft</span>
                      <span>50 ft</span>
                      <span>75 ft</span>
                      <span>90 ft</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Configuration Summary</h3>
                <div className="space-y-3 text-sm border-b border-gray-800 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Series:</span>
                    <span className="font-semibold text-white">{currentFilm.series}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">VLT Tint:</span>
                    <span className="font-semibold text-white">{currentFilm.vlt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Width:</span>
                    <span className="font-semibold text-white">40" Commercial Width</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Package:</span>
                    <span className="font-semibold text-white">
                      {orderType === 'roll' ? `${rollsCount} x Master Roll (100')` : `${linearFeet} Linear Feet`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prescott Hub Status:</span>
                    {adminUnlocked ? (
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/50">
                        {currentFilm.stockFt} ft Live
                      </span>
                    ) : (
                      <span className={`font-mono text-xs font-semibold ${currentFilm.stockFt > 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                        {currentFilm.stockFt > 0 ? 'In Stock • Hub Ready' : 'Allocated On-Demand'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-gray-400 font-medium">Config Subtotal:</span>
                  <div className="text-2xl font-black font-mono">
                    <span className={isUnlocked ? 'text-emerald-400' : 'filter blur-sm select-none text-emerald-300'}>
                      {isUnlocked ? `$${filmPrice.toFixed(2)}` : '$2XX.XX'}
                    </span>
                  </div>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={handleAddFilmToCart}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Wholesale Cart
                  </button>
                ) : (
                  <button
                    onClick={() => setShowUnlockModal(true)}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <Lock className="w-5 h-5" />
                    Unlock B2B Price to Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tools Catalog with Blurred Pricing */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {toolsInventory.map((tool) => (
              <div key={tool.id} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-gray-800 text-emerald-400 font-mono px-2.5 py-1 rounded-md border border-gray-700">{tool.category}</span>
                    {adminUnlocked ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/50">
                        {tool.stockQty} Qty Live
                      </span>
                    ) : (
                      <span className={`text-xs font-mono font-semibold ${tool.stockQty <= 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {tool.stockQty > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mt-3">{tool.name}</h4>
                  <p className="text-xs text-gray-400 mt-2">{tool.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-lg font-black font-mono">
                    <span className={isUnlocked ? 'text-emerald-400' : 'filter blur-sm select-none text-emerald-300'}>
                      {isUnlocked ? `$${tool.price.toFixed(2)}` : '$1X.XX'}
                    </span>
                  </div>
                  {isUnlocked ? (
                    <button
                      onClick={() => handleAddToolToCart(tool)}
                      disabled={tool.stockQty <= 0}
                      className="bg-gray-800 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition disabled:opacity-40 disabled:hover:bg-gray-800"
                    >
                      Add Tool
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowUnlockModal(true)}
                      className="bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                    >
                      Unlock Price
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart & B2B Verification Section */}
        <div id="cart-section" className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 lg:p-8 mb-12">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Wholesale Order Checkout</h3>
            <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full font-mono ml-auto">
              {cart.length} Item{cart.length !== 1 ? 's' : ''} Selected
            </span>
          </div>

          {orderSubmitted && lastOrderDetails ? (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-6 text-center my-4 space-y-4">
              <PackageCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <div>
                <h4 className="text-lg font-bold text-white">Wholesale Order Confirmed: {lastOrderDetails.orderId}</h4>
                <p className="text-xs text-emerald-300 mt-1">Verification details dispatched to <span className="font-mono font-bold">orders@apexrollsupply.com</span></p>
              </div>
              <div className="text-left max-w-md mx-auto bg-gray-900/80 p-4 rounded-lg border border-gray-800 text-xs font-mono space-y-1.5 text-gray-300">
                <div>Shop: <span className="text-white font-semibold">{lastOrderDetails.shopName}</span></div>
                <div>TPT Resale #: <span className="text-emerald-400">{lastOrderDetails.tptLicense}</span></div>
                <div>Fulfillment: <span className="text-white">{lastOrderDetails.fulfillmentType}</span></div>
                {lastOrderDetails.deliveryFee > 0 && (
                  <div>Regional Surcharge: <span className="text-amber-400 font-bold">+$50.00</span></div>
                )}
                <div>Total Dispatched: <span className="text-emerald-400 font-bold">${lastOrderDetails.total.toFixed(2)}</span></div>
              </div>
              <button 
                onClick={() => setOrderSubmitted(false)}
                className="text-xs text-gray-400 hover:text-white underline pt-2"
              >
                Submit another wholesale order
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Cart items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Order Items</h4>
                {cart.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-gray-800 rounded-xl text-gray-500 text-sm">
                    Your wholesale cart is empty. Unlock pricing to add rolls or shop tools.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div key={item.id} className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl flex justify-between items-center text-sm">
                        <div>
                          <div className="font-bold text-white">
                            {item.category === 'Film' ? `${item.series} (${item.vlt} VLT)` : item.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.category === 'Film' 
                              ? (item.orderType === 'roll' ? `${item.rolls}x 40" x 100' Master Roll` : `40" Cut: ${item.linearFt} Linear Ft`)
                              : `Qty: ${item.quantity}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-emerald-400">${item.totalPrice.toFixed(2)}</span>
                          <button 
                            onClick={() => setCart((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-xs text-rose-400 hover:text-rose-300 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-800 space-y-1.5">
                      <div className="flex justify-between items-baseline text-sm">
                        <span className="text-gray-400">Items Subtotal:</span>
                        <span className="font-mono text-white font-semibold">${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-sm">
                        <span className="text-gray-400">Delivery / Dispatch:</span>
                        <span className={`font-mono font-semibold ${deliveryFee > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {deliveryFee > 0 ? '+$50.00 (Extended Regional)' : '$0.00 (Free Local / Pickup)'}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-gray-800/60">
                        <span className="text-base font-bold text-gray-200">Total:</span>
                        <span className="text-2xl font-black font-mono text-emerald-400">${finalOrderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: B2B License Verification Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Arizona B2B Resale Verification
                </h4>
                <p className="text-[11px] text-gray-500">Commercial resale purchases require a registered AZ shop name and active TPT license.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Registered Shop Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. High Desert Tint Works"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Contact Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lead Installer"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Shop Email *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="shop@domain.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Arizona TPT Resale License # *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 21000000"
                      value={tptLicense}
                      onChange={(e) => setTptLicense(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* 3-Tier Fulfillment Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Fulfillment &amp; Delivery Option</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('local-quad')}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition flex items-start gap-3 ${
                        fulfillmentType === 'local-quad' 
                          ? 'border-emerald-500 bg-emerald-950/30 text-white font-semibold' 
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>Quad Cities Local Courier</span>
                          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">FREE DELIVERY</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">Complimentary route delivery to Prescott Valley, Prescott, Chino Valley &amp; Dewey-Humboldt.</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('extended')}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition flex items-start gap-3 ${
                        fulfillmentType === 'extended' 
                          ? 'border-emerald-500 bg-emerald-950/30 text-white font-semibold' 
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>Extended Regional Courier (Outside Quad Cities)</span>
                          <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">+$50.00 FEE</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">Surrounding areas outside Quad Cities (Verde Valley, Sedona, Cottonwood, Camp Verde, etc.).</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition flex items-start gap-3 ${
                        fulfillmentType === 'pickup' 
                          ? 'border-emerald-500 bg-emerald-950/30 text-white font-semibold' 
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>Prescott Valley Hub Pickup</span>
                          <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-mono">FREE PICKUP</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">Will-call dock pickup at the Prescott Valley distribution facility.</div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0 || !isB2BValid}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-md mt-4"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Wholesale Order for Dispatch
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Admin Inventory & Staff Portal */}
        <div className="border border-gray-800 bg-[#161b22]/90 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              {adminUnlocked ? (
                <Unlock className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <h4 className="text-base font-bold text-white">Admin Hub Inventory &amp; Receiving Portal</h4>
                <p className="text-xs text-gray-400">Live inventory tracking, automated daily audits, and restock management (Staff Restricted)</p>
              </div>
            </div>
            {adminUnlocked ? (
              <button 
                onClick={() => setAdminUnlocked(false)} 
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition"
              >
                Lock Portal
              </button>
            ) : (
              <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2.5 py-1 rounded border border-gray-800">Passcode Protected</span>
            )}
          </div>

          {!adminUnlocked ? (
            <div className="mt-6 max-w-sm">
              <form onSubmit={handlePasscodeSubmit} className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Enter Staff Passcode"
                  value={passcodeAttempt}
                  onChange={(e) => setPasscodeAttempt(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono w-full"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
                >
                  Unlock
                </button>
              </form>
              {passcodeError && (
                <p className="text-xs text-rose-400 font-medium mt-2">Passcode incorrect. Please try again.</p>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              {/* Live Hub Stock Table */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider">Live Hub Stock Overview</h5>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Film Footage Dashboard */}
                  <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4">
                    <h6 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-3 flex items-center justify-between">
                      <span>C2 Ceramic Series Stock</span>
                      <span className="font-mono text-[10px] text-gray-400">Total Footage</span>
                    </h6>
                    <div className="space-y-2">
                      {filmInventory.filter(f => f.series === 'C2 Ceramic').map((film) => (
                        <div key={film.id} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-800/60 last:border-0">
                          <span className="text-gray-300 font-medium">{film.vlt} VLT Nano-Ceramic</span>
                          <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                            film.stockFt === 0 
                              ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40' 
                              : film.stockFt < 30 
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40' 
                              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                          }`}>
                            {film.stockFt} Linear Ft
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tool Units Dashboard */}
                  <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4">
                    <h6 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-3 flex items-center justify-between">
                      <span>Shop Consumables &amp; Blades</span>
                      <span className="font-mono text-[10px] text-gray-400">Units on Hand</span>
                    </h6>
                    <div className="space-y-2">
                      {toolsInventory.map((tool) => (
                        <div key={tool.id} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-800/60 last:border-0">
                          <span className="text-gray-300 font-medium truncate max-w-[200px]">{tool.name}</span>
                          <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                            tool.stockQty <= 2 
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40' 
                              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                          }`}>
                            {tool.stockQty} In Stock
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Receive Stock Form */}
              <div className="border-t border-gray-800 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider">Quick Receiving / Add Stock</h5>
                </div>
                <form onSubmit={handleRestock} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs items-end">
                  <div>
                    <label className="block text-gray-400 mb-1">Target Category</label>
                    <select
                      value={restockItemType}
                      onChange={(e) => {
                        const type = e.target.value as 'film' | 'tool';
                        setRestockItemType(type);
                        setRestockTarget(type === 'film' ? filmInventory[0].id : toolsInventory[0].id);
                        setRestockAmount(type === 'film' ? 100 : 5);
                      }}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="film">Window Film (Linear Ft)</option>
                      <option value="tool">Shop Supplies / Tools (Qty)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Product Item</label>
                    <select
                      value={restockTarget}
                      onChange={(e) => setRestockTarget(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                    >
                      {restockItemType === 'film' ? (
                        filmInventory.map((f) => (
                          <option key={f.id} value={f.id}>{f.series} - {f.vlt} (Currently: {f.stockFt} ft)</option>
                        ))
                      ) : (
                        toolsInventory.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} (Currently: {t.stockQty} qty)</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">
                      {restockItemType === 'film' ? 'Add Footage (Linear Ft)' : 'Add Quantity (Units)'}
                    </label>
                    <input
                      type="number"
                      step={restockItemType === 'film' ? '10' : '1'}
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-bold transition shadow-sm"
                  >
                    Receive Stock
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}