'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingCart, 
  Truck, 
  MapPin, 
  Phone, 
  Lock, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  AlertTriangle,
  ArrowRight,
  PackageCheck
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
  // Passcode gate for admin restock
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Film inventory initial state
  const [filmInventory, setFilmInventory] = useState<FilmProduct[]>([
    { id: 'c2-carb-5', series: 'C2 Carbon', vlt: '5%', masterRollPrice: 307.00, linearFtPrice: 3.85, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-20', series: 'C2 Carbon', vlt: '20%', masterRollPrice: 307.00, linearFtPrice: 3.85, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-35', series: 'C2 Carbon', vlt: '35%', masterRollPrice: 307.00, linearFtPrice: 3.85, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-50', series: 'C2 Carbon', vlt: '50%', masterRollPrice: 307.00, linearFtPrice: 3.85, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-carb-70', series: 'C2 Carbon', vlt: '70%', masterRollPrice: 307.00, linearFtPrice: 3.85, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
    { id: 'c2-cer-5', series: 'C2 Ceramic', vlt: '5%', masterRollPrice: 446.00, linearFtPrice: 5.45, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-20', series: 'C2 Ceramic', vlt: '20%', masterRollPrice: 446.00, linearFtPrice: 5.45, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-35', series: 'C2 Ceramic', vlt: '35%', masterRollPrice: 446.00, linearFtPrice: 5.45, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-50', series: 'C2 Ceramic', vlt: '50%', masterRollPrice: 446.00, linearFtPrice: 5.45, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' },
    { id: 'c2-cer-70', series: 'C2 Ceramic', vlt: '70%', masterRollPrice: 446.00, linearFtPrice: 5.45, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' }
  ]);

  // Tools inventory with accurate baseline stock
  const [toolsInventory, setToolsInventory] = useState<ToolProduct[]>([
    { 
      id: 'hard-card-gold', 
      name: 'Pro Squeegee Hard Card (Gold 4")', 
      category: 'Hard Cards', 
      price: 4.25, 
      stockQty: 10, 
      description: 'Teflon-infused firm squeegee for shrinking & edges.' 
    },
    { 
      id: 'banana-buffers-10', 
      name: 'Banana Buffers Squeegee Wings (10/pk)', 
      category: 'Buffers', 
      price: 18.00, 
      stockQty: 1, 
      description: 'Felt wet-wing buffers for scratching prevention (Low Stock).' 
    },
    { 
      id: 'blade-pack-30', 
      name: '30° Stainless Snap Blades (50/pk)', 
      category: 'Cutting', 
      price: 16.50, 
      stockQty: 13, 
      description: 'Precision carbon & stainless snap-off blades.' 
    }
  ]);

  // Selection & Cart state
  const [activeTab, setActiveTab] = useState<'film' | 'tools'>('film');
  const [selectedFilmSeries, setSelectedFilmSeries] = useState<'C2 Carbon' | 'C2 Ceramic'>('C2 Ceramic');
  const [selectedVlt, setSelectedVlt] = useState<'5%' | '20%' | '35%' | '50%' | '70%'>('20%');
  const [orderType, setOrderType] = useState<'roll' | 'cut'>('roll');
  const [rollsCount, setRollsCount] = useState<number>(1);
  const [linearFeet, setLinearFeet] = useState<number>(25);

  const [cart, setCart] = useState<any[]>([]);

  // B2B Verification state
  const [shopName, setShopName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [tptLicense, setTptLicense] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'courier'>('pickup');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  // Restock form state
  const [restockTarget, setRestockTarget] = useState<string>('c2-cer-20');
  const [restockAmountFt, setRestockAmountFt] = useState<number>(100);

  // Active film selection
  const currentFilm = filmInventory.find(
    (f) => f.series === selectedFilmSeries && f.vlt === selectedVlt
  )!;

  // Pricing calculations
  const filmPrice = orderType === 'roll' 
    ? rollsCount * currentFilm.masterRollPrice 
    : linearFeet * currentFilm.linearFtPrice;

  const handleAddFilmToCart = () => {
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
  const isB2BValid = shopName.trim().length > 1 && contactName.trim().length > 1 && contactEmail.includes('@') && tptLicense.trim().length >= 6;

  // Admin Passcode Unlock (Passcode: 8923)
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt === '8923') {
      setAdminUnlocked(true);
      setPasscodeError(false);
      setPasscodeAttempt('');
    } else {
      setPasscodeError(true);
    }
  };

  // Inventory Receiving
  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    setFilmInventory((prev) =>
      prev.map((item) =>
        item.id === restockTarget
          ? { ...item, stockFt: item.stockFt + Number(restockAmountFt) }
          : item
      )
    );
  };

  // Submit Order Logic with live Resend order dispatch
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!isB2BValid) {
      alert('Verification Required: Please enter your Registered Business Name, Contact Info, and Arizona TPT Resale License #.');
      return;
    }

    const orderId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      shopName,
      contactName,
      contactEmail,
      tptLicense,
      fulfillmentType,
      items: [...cart],
      total: cartSubtotal,
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

    // Deduct film stock if available
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

    // Deduct tool stock
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
      {/* Top Dispatch Notification Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-[#121d24] border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">PRESCOTT VALLEY WHOLESALE HUB:</span>
            <span>Commercial Resale Distribution Only • Orders Verified via Arizona TPT</span>
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>B2B Portal Active</span>
            </div>
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

      {/* Hero / Quick Nav */}
      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Wholesale Product Catalog</h2>
            <p className="text-sm text-gray-400 mt-1">High-performance 40" wide Geoshield C2 Master Rolls &amp; Custom Linear Foot Cuts.</p>
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
                    <div className="mt-4 text-xs font-mono text-emerald-400">
                      Master Roll: $446.00 | $5.45 / linear ft
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
                    <div className="mt-4 text-xs font-mono text-emerald-400">
                      Master Roll: $307.00 | $3.85 / linear ft
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
                    <div className="mt-3 text-sm font-mono font-bold text-emerald-400">${currentFilm.masterRollPrice.toFixed(2)} / roll</div>
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
                    <div className="text-xs text-gray-400 mt-1">Order exact footage needed without carrying full roll stock.</div>
                    <div className="mt-3 text-sm font-mono font-bold text-emerald-400">${currentFilm.linearFtPrice.toFixed(2)} / ft</div>
                  </button>
                </div>

                {/* Quantity selector */}
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

            {/* Film Sidebar / Summary */}
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
                    <span className="text-gray-400">Prescott Hub Inventory:</span>
                    <span className={`font-mono text-xs font-semibold ${currentFilm.stockFt > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {currentFilm.stockFt > 0 ? `${currentFilm.stockFt} ft On Hand` : 'Allocated On-Demand'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-gray-400 font-medium">Config Subtotal:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">${filmPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleAddFilmToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Wholesale Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tools Catalog */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {toolsInventory.map((tool) => (
              <div key={tool.id} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-gray-800 text-emerald-400 font-mono px-2.5 py-1 rounded-md border border-gray-700">{tool.category}</span>
                    <span className={`text-xs font-mono font-semibold ${tool.stockQty <= 2 ? 'text-amber-400' : 'text-gray-400'}`}>
                      {tool.stockQty > 0 ? `${tool.stockQty} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-3">{tool.name}</h4>
                  <p className="text-xs text-gray-400 mt-2">{tool.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-lg font-black font-mono text-emerald-400">${tool.price.toFixed(2)}</div>
                  <button
                    onClick={() => handleAddToolToCart(tool)}
                    disabled={tool.stockQty <= 0}
                    className="bg-gray-800 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition disabled:opacity-40 disabled:hover:bg-gray-800"
                  >
                    Add Tool
                  </button>
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
                <div>Route: <span className="text-white">{lastOrderDetails.fulfillmentType === 'pickup' ? 'Prescott Valley Hub Pickup' : 'Courier Dispatch'}</span></div>
                <div>Subtotal: <span className="text-white font-bold">${lastOrderDetails.total.toFixed(2)}</span></div>
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
                    Your wholesale cart is empty. Choose a film configuration or tool above.
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
                    <div className="pt-4 border-t border-gray-800 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-gray-400">Subtotal:</span>
                      <span className="text-xl font-black font-mono text-emerald-400">${cartSubtotal.toFixed(2)}</span>
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
                      placeholder="e.g. Desert Tint Pros LLC"
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

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Fulfillment Route</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`p-3 rounded-lg border text-left text-xs transition ${
                        fulfillmentType === 'pickup' 
                          ? 'border-emerald-500 bg-emerald-950/30 text-white font-semibold' 
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                      <div>Prescott Valley Hub Pickup</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('courier')}
                      className={`p-3 rounded-lg border text-left text-xs transition ${
                        fulfillmentType === 'courier' 
                          ? 'border-emerald-500 bg-emerald-950/30 text-white font-semibold' 
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                      <div>Local Courier / Delivery</div>
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

        {/* Admin Inventory Restock Gate */}
        <div className="border border-gray-800 bg-[#161b22]/60 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Hub Inventory Receiving (Staff Only)</h4>
            </div>
            {!adminUnlocked && (
              <span className="text-xs text-gray-500 font-mono">Passcode Protected</span>
            )}
          </div>

          {!adminUnlocked ? (
            <form onSubmit={handlePasscodeSubmit} className="mt-4 flex items-center gap-3 max-w-sm">
              <input
                type="password"
                placeholder="Enter Staff Passcode"
                value={passcodeAttempt}
                onChange={(e) => setPasscodeAttempt(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                Unlock
              </button>
              {passcodeError && (
                <span className="text-xs text-rose-400 font-medium">Invalid</span>
              )}
            </form>
          ) : (
            <form onSubmit={handleRestock} className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Film Roll Target</label>
                <select
                  value={restockTarget}
                  onChange={(e) => setRestockTarget(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white focus:outline-none"
                >
                  {filmInventory.map((f) => (
                    <option key={f.id} value={f.id}>{f.series} - {f.vlt} (Currently: {f.stockFt} ft)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Add Footage (Ft)</label>
                <input
                  type="number"
                  step="50"
                  value={restockAmountFt}
                  onChange={(e) => setRestockAmountFt(Number(e.target.value))}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white font-mono w-24"
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-bold self-end"
              >
                Receive Stock
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}