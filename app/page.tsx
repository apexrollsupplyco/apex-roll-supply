import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Scissors, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Search, 
  Layers, 
  Phone, 
  Clock, 
  Building2, 
  PhoneCall, 
  X, 
  Wrench,
  ArrowDownCircle,
  FileCheck
} from 'lucide-react';

// Primary Film Inventory Database - 40" Master Rolls (5%, 20%, 35%, 75%)
const INITIAL_FILM_INVENTORY = [
  // C2 CERAMIC (40" Master Rolls)
  { id: 'c2c-05-40', series: 'C2 Ceramic', vlt: '5%', width: 40, stockFt: 650, priceMasterRoll: 310, pricePerFt: 3.60 },
  { id: 'c2c-20-40', series: 'C2 Ceramic', vlt: '20%', width: 40, stockFt: 820, priceMasterRoll: 310, pricePerFt: 3.60 },
  { id: 'c2c-35-40', series: 'C2 Ceramic', vlt: '35%', width: 40, stockFt: 450, priceMasterRoll: 310, pricePerFt: 3.60 },
  { id: 'c2c-75-40', series: 'C2 Ceramic', vlt: '75%', width: 40, stockFt: 310, priceMasterRoll: 330, pricePerFt: 3.90 },

  // C2 CARBON (40" Master Rolls)
  { id: 'c2cb-05-40', series: 'C2 Carbon', vlt: '5%', width: 40, stockFt: 900, priceMasterRoll: 235, pricePerFt: 2.85 },
  { id: 'c2cb-20-40', series: 'C2 Carbon', vlt: '20%', width: 40, stockFt: 610, priceMasterRoll: 235, pricePerFt: 2.85 },
  { id: 'c2cb-35-40', series: 'C2 Carbon', vlt: '35%', width: 40, stockFt: 480, priceMasterRoll: 235, pricePerFt: 2.85 },
  { id: 'c2cb-75-40', series: 'C2 Carbon', vlt: '75%', width: 40, stockFt: 290, priceMasterRoll: 250, pricePerFt: 3.10 }
];

// Installer Tools Inventory - Exact Shop On-Hand Counts
const INITIAL_TOOLS_INVENTORY = [
  { 
    id: 'tool-nt-bad21p', 
    name: 'NT Cutter 30° Precision Blades (BAD-21P)', 
    category: 'Blades', 
    stockQty: 13, 
    detail: '13 packs available (130 blades total)',
    unitPrice: 16.50, 
    description: 'Ultra-sharp 30-degree segment blades for intricate tint trimming and precision cutting.' 
  },
  { 
    id: 'tool-banana-buffers', 
    name: 'Banana Buffers (Winged Squeegee Felt)', 
    category: 'Buffers & Felt', 
    stockQty: 12, 
    detail: '12 packs available (120 buffers total)',
    unitPrice: 18.00, 
    description: 'Squeegee wing buffer pads to prevent scratches on glass during heat shrinking and tucking.' 
  },
  { 
    id: 'tool-nt-reddot', 
    name: 'NT Cutter Pro A-1P "Red Dot" Knives', 
    category: 'Knives', 
    stockQty: 10, 
    detail: '10 units available',
    unitPrice: 14.50, 
    description: 'The industry-standard Stainless Steel Auto-Lock 9mm utility knife favored by master installers.' 
  },
  { 
    id: 'tool-nt-ba50ss', 
    name: 'NT Cutter BA-50SS Stainless Steel Blades', 
    category: 'Blades', 
    stockQty: 1, 
    detail: '1 pack available (50 blades total)',
    unitPrice: 24.00, 
    description: 'High-grade stainless steel 58° snap-off blades designed specifically to avoid scoring automotive glass.' 
  }
];

export default function App() {
  // Inventory state
  const [filmInventory, setFilmInventory] = useState(INITIAL_FILM_INVENTORY);
  const [toolsInventory, setToolsInventory] = useState(INITIAL_TOOLS_INVENTORY);
  
  // Tab State ('film', 'tools', or 'admin')
  const [activeTab, setActiveTab] = useState('film'); 

  // Film Ordering Form State
  const [orderType, setOrderType] = useState('roll'); // 'roll' or 'cut'
  const [selectedSeries, setSelectedSeries] = useState('C2 Ceramic');
  const [selectedVlt, setSelectedVlt] = useState('20%');
  const [rollQty, setRollQty] = useState(1);
  const [cutLengthFt, setCutLengthFt] = useState(25);

  // Admin Restock Form State
  const [restockItemId, setRestockItemId] = useState(INITIAL_FILM_INVENTORY[0].id);
  const [restockQtyInput, setRestockQtyInput] = useState(1);
  const [restockSuccessMsg, setRestockSuccessMsg] = useState(null);

  // Special Order Modal State
  const [showSpecialOrderModal, setShowSpecialOrderModal] = useState(false);
  const [specialOrderReason, setSpecialOrderReason] = useState('60" Master Roll / Special Delivery');

  // Cart & Orders State
  const [cart, setCart] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Verified B2B Account Info & TPT / EIN Verification Gate
  const [shopName, setShopName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [tptLicense, setTptLicense] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('pickup');

  // Inventory Filter State
  const [stockSearch, setStockSearch] = useState('');
  const [stockSeriesFilter, setStockSeriesFilter] = useState('All');

  // Primary 40" stock reference for calculations
  const primary40Product = useMemo(() => {
    return filmInventory.find(
      (item) => item.series === selectedSeries && item.vlt === selectedVlt && item.width === 40
    );
  }, [filmInventory, selectedSeries, selectedVlt]);

  const availableSeries = ['C2 Ceramic', 'C2 Carbon'];
  const availableVlts = ['5%', '20%', '35%', '75%'];

  // Calculations for current selection
  const neededFt = orderType === 'roll' ? rollQty * 100 : Number(cutLengthFt) || 0;
  const isStockAvailable = primary40Product ? primary40Product.stockFt >= neededFt : false;
  
  const estimatedItemPrice = useMemo(() => {
    if (!primary40Product) return 0;
    if (orderType === 'roll') {
      return rollQty * primary40Product.priceMasterRoll;
    } else {
      return neededFt * primary40Product.pricePerFt;
    }
  }, [primary40Product, orderType, rollQty, neededFt]);

  const handleOpenSpecialOrder = (reason = '60" Master Rolls & Specialty Series') => {
    setSpecialOrderReason(reason);
    setShowSpecialOrderModal(true);
  };

  // Add Film Item to Cart
  const handleAddToCart = () => {
    if (!primary40Product) return;
    if (!isStockAvailable) return;
    if (neededFt <= 0) return;

    const newItem = {
      cartId: Date.now(),
      category: 'Film',
      productId: primary40Product.id,
      series: primary40Product.series,
      vlt: primary40Product.vlt,
      width: 40,
      orderType: orderType,
      rolls: orderType === 'roll' ? rollQty : 0,
      linearFt: neededFt,
      unitPrice: orderType === 'roll' ? primary40Product.priceMasterRoll : primary40Product.pricePerFt,
      totalPrice: estimatedItemPrice
    };

    setCart((prev) => [...prev, newItem]);
  };

  // Add Tool Item to Cart
  const handleAddToolToCart = (tool) => {
    if (tool.stockQty <= 0) return;

    const existingIdx = cart.findIndex((item) => item.productId === tool.id);
    if (existingIdx !== -1) {
      const currentQty = cart[existingIdx].quantity;
      if (currentQty >= tool.stockQty) {
        alert(`Cannot add more than the ${tool.stockQty} available in stock.`);
        return;
      }
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * tool.unitPrice }
            : item
        )
      );
    } else {
      const newItem = {
        cartId: Date.now(),
        category: 'Tool',
        productId: tool.id,
        name: tool.name,
        quantity: 1,
        unitPrice: tool.unitPrice,
        totalPrice: tool.unitPrice
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Cart Subtotal
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cart]);

  // Is B2B form valid?
  const isB2BValid = shopName.trim().length > 0 && 
                     contactName.trim().length > 0 && 
                     contactEmail.includes('@') && 
                     tptLicense.trim().length >= 8;

  // Submit Order Logic with dispatch notification to orders@apexrollsupply.com
  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!isB2BValid) {
      alert('Please complete all Business Account verification fields (Shop Name, Contact Name, Valid Email, and Arizona TPT / Wholesale ID) before submitting.');
      return;
    }

    const orderId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;

    // Deduct film stock
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

    // Dispatch notification to orders@apexrollsupply.com
    console.log(`[DISPATCH NOTIFICATION SENT TO orders@apexrollsupply.com]:`, orderPayload);

    setLastOrderDetails(orderPayload);
    setCart([]);
    setOrderSubmitted(true);
  };

  // Handle Restock / Receiving submission
  const handleReceiveShipment = (e) => {
    e.preventDefault();
    const qty = Number(restockQtyInput);
    if (qty <= 0) return;

    const filmMatch = filmInventory.find((f) => f.id === restockItemId);
    if (filmMatch) {
      const addedFt = qty * 100;
      setFilmInventory((prev) =>
        prev.map((item) =>
          item.id === restockItemId ? { ...item, stockFt: item.stockFt + addedFt } : item
        )
      );
      setRestockSuccessMsg(`Successfully received ${qty} roll(s) (${addedFt} ft) of ${filmMatch.series} ${filmMatch.vlt}! Live stock updated.`);
    } else {
      const toolMatch = toolsInventory.find((t) => t.id === restockItemId);
      if (toolMatch) {
        setToolsInventory((prev) =>
          prev.map((item) =>
            item.id === restockItemId ? { ...item, stockQty: item.stockQty + qty } : item
          )
        );
        setRestockSuccessMsg(`Successfully received ${qty} pack(s)/unit(s) of ${toolMatch.name}! Live stock updated.`);
      }
    }
    setRestockQtyInput(1);
  };

  // Filtered Stock Table
  const filteredInventory = useMemo(() => {
    return filmInventory.filter((item) => {
      const matchesSeries = stockSeriesFilter === 'All' || item.series === stockSeriesFilter;
      const matchesSearch = 
        item.series.toLowerCase().includes(stockSearch.toLowerCase()) || 
        item.vlt.includes(stockSearch);
      return matchesSeries && matchesSearch;
    });
  }, [filmInventory, stockSeriesFilter, stockSearch]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Notification Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-[#121d24] border-b border-emerald-800/40 text-xs text-emerald-300 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">PRESCOTT VALLEY WHOLESALE HUB:</span>
            <span>Verified Commercial Window Film & Tool Distribution.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1"><Phone size={13} className="text-emerald-400"/> (928) 775-ROLL</span>
            <span className="flex items-center gap-1"><Clock size={13} className="text-teal-400"/> orders@apexrollsupply.com</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#121824]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <Layers className="h-6 w-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider uppercase text-white">APEX ROLL SUPPLY CO.</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">WHOLESALE</span>
              </div>
              <p className="text-xs text-gray-400">Quad-City Installer Portal & 40" Film Distribution Center</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-gray-300">
              <FileCheck size={14} className="text-emerald-400" />
              <span>B2B Verification Gate Active</span>
            </div>

            {/* Hub Receiving Admin Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'film' : 'admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <ArrowDownCircle size={15} />
              <span>{activeTab === 'admin' ? 'Exit Admin' : 'Hub Receiving Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Special Order Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Special Order Only
                </span>
                <span className="text-xs text-gray-400">Tesla / Oversized Panoramic Glass</span>
              </div>
              <h2 className="text-lg font-bold text-white">Need 60" Master Rolls or Apex Tier / Pro Nano Film?</h2>
              <p className="text-xs text-gray-300">
                All standard online rolls and linear cuts are 40" wide. 60" rolls and specialty lines require direct phone ordering with dispatch.
              </p>
            </div>
            <button
              onClick={() => handleOpenSpecialOrder('60" Master Rolls & Specialty Series')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0"
            >
              <PhoneCall size={16} />
              <span>Call Dispatch for 60" Rolls</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('film')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'film'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Scissors size={18} />
            <span>40" Window Film & Cuts</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'tools'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Wrench size={18} />
            <span>Installer Blades, Knives & Tools</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'admin'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDownCircle size={18} />
            <span>Hub Receiving & Restock</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'film' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Film Configurator */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">40" Film Order Configurator</h3>
                      <p className="text-xs text-gray-400">Master Rolls or Custom Linear Cuts (Full 40" Width)</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-800 text-emerald-400 font-semibold px-2.5 py-1 rounded-md border border-slate-700">
                    40" Standard Width
                  </span>
                </div>

                {/* 1. Order Type */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    1. Select Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType('roll')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        orderType === 'roll'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">Full 40" x 100' Master Roll</div>
                        <div className="text-xs text-gray-400">Best wholesale rate</div>
                      </div>
                      <Layers className={orderType === 'roll' ? 'text-emerald-400' : 'text-gray-600'} size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('cut')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        orderType === 'cut'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">Linear Foot Cut (40" Wide)</div>
                        <div className="text-xs text-gray-400">Full 40" width cut to length</div>
                      </div>
                      <Scissors className={orderType === 'cut' ? 'text-emerald-400' : 'text-gray-600'} size={20} />
                    </button>
                  </div>
                </div>

                {/* 2. Series Selection */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    2. Select Film Line
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableSeries.map((series) => (
                      <button
                        key={series}
                        type="button"
                        onClick={() => setSelectedSeries(series)}
                        className={`p-3 rounded-xl border font-bold text-sm transition-all text-center ${
                          selectedSeries === series
                            ? 'bg-slate-800 border-emerald-500 text-emerald-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {series}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. VLT Shade Selection */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    3. Select VLT Shade
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableVlts.map((vlt) => (
                      <button
                        key={vlt}
                        type="button"
                        onClick={() => setSelectedVlt(vlt)}
                        className={`py-2.5 rounded-lg border font-extrabold text-sm transition-all ${
                          selectedVlt === vlt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-950 border-slate-800 text-gray-300 hover:border-slate-700'
                        }`}
                      >
                        {vlt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Quantity / Footage controls */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                  {orderType === 'roll' ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400">Number of 40" x 100 Ft Master Rolls</label>
                        <p className="text-xs text-gray-500 mt-0.5">Total linear footage: {rollQty * 100} ft</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setRollQty((q) => Math.max(1, q - 1))}
                          className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-base w-8 text-center">{rollQty}</span>
                        <button
                          type="button"
                          onClick={() => setRollQty((q) => q + 1)}
                          className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-gray-400">Linear Foot Cut Length (40" Width)</label>
                        <span className="text-xs font-bold text-emerald-400">{cutLengthFt} Linear Feet @ 40" Wide</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={cutLengthFt}
                        onChange={(e) => setCutLengthFt(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                        <span>5 ft</span>
                        <span>25 ft</span>
                        <span>50 ft</span>
                        <span>100 ft</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price & Stock Status */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-400">Current Price</div>
                    <div className="text-2xl font-extrabold text-emerald-400">
                      ${estimatedItemPrice.toFixed(2)}
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        ({orderType === 'roll' ? `$${primary40Product?.priceMasterRoll}/roll` : `$${primary40Product?.pricePerFt.toFixed(2)}/ft @ 40"`})
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center gap-1.5">
                      {isStockAvailable ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-semibold">
                            In Stock ({primary40Product?.stockFt} ft 40" stock available in PV Hub)
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={13} className="text-amber-400" />
                          <span className="text-xs text-amber-400 font-semibold">
                            Footage low/insufficient in local stock
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isStockAvailable || neededFt <= 0}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                    <span>Add to Order Cart</span>
                  </button>
                </div>

              </div>

              {/* Live Inventory Reference Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Package className="text-emerald-400" size={18} />
                    <h3 className="text-sm font-bold text-white">Live 40" Inventory Stock Monitor</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Filter VLT/Series..."
                        value={stockSearch}
                        onChange={(e) => setStockSearch(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-slate-800 uppercase text-[10px]">
                        <th className="pb-2">Series</th>
                        <th className="pb-2">VLT</th>
                        <th className="pb-2">Roll Width</th>
                        <th className="pb-2">Available 40" Stock</th>
                        <th className="pb-2">40" Roll Price</th>
                        <th className="pb-2 text-right">40" Cut Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 font-semibold text-white">{item.series}</td>
                          <td className="py-2.5 text-emerald-400 font-bold">{item.vlt}</td>
                          <td className="py-2.5 font-mono">40"</td>
                          <td className="py-2.5">
                            <span className={`font-semibold ${item.stockFt > 300 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {item.stockFt} ft
                            </span>
                          </td>
                          <td className="py-2.5 font-mono text-gray-300">${item.priceMasterRoll}</td>
                          <td className="py-2.5 font-mono text-right text-gray-300">${item.pricePerFt.toFixed(2)}/ft</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Verified B2B Order Summary & Checkout */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="text-emerald-400" size={20} />
                    <h3 className="text-base font-bold text-white">Wholesale Order Summary</h3>
                  </div>
                  <span className="text-xs bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-800">
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} Item(s)
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl my-4">
                    <ShoppingCart className="mx-auto text-gray-600 mb-2" size={32} />
                    <p className="text-sm text-gray-400 font-medium">Your wholesale cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4 my-4">
                    <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                      {cart.map((item) => (
                        <div key={item.cartId} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-start">
                          <div className="space-y-1">
                            {item.category === 'Film' ? (
                              <>
                                <div className="font-bold text-sm text-white">
                                  {item.series} <span className="text-emerald-400">{item.vlt} VLT</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {item.orderType === 'roll' 
                                    ? `${item.rolls} x 40" x 100' Master Roll` 
                                    : `40" Wide Cut x ${item.linearFt} Linear Feet`}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-bold text-sm text-white">{item.name}</div>
                                <div className="text-xs text-gray-400">Quantity: {item.quantity}</div>
                              </>
                            )}
                            <div className="text-xs text-gray-500 font-mono">${item.totalPrice.toFixed(2)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.cartId)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* B2B VERIFICATION GATE FORM */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <FileCheck size={14} />
                        <span>Installer Account Verification Gate</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Shop / Business Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. High Desert Tint & Wrap"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Contact Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="Full Name"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Business Email *</label>
                            <input
                              type="email"
                              required
                              placeholder="shop@domain.com"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Arizona TPT / Wholesale ID (Min 8 Digits) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 21458923-AZ"
                            value={tptLicense}
                            onChange={(e) => setTptLicense(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Fulfillment Route
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setFulfillmentType('pickup')}
                          className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                            fulfillmentType === 'pickup'
                              ? 'bg-slate-800 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-gray-400'
                          }`}
                        >
                          <MapPin size={14} />
                          <span>Shop Pickup (PV)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFulfillmentType('delivery')}
                          className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                            fulfillmentType === 'delivery'
                              ? 'bg-slate-800 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-gray-400'
                          }`}
                        >
                          <Truck size={14} />
                          <span>Local Courier</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Order Amount</span>
                        <span className="text-2xl font-extrabold text-emerald-400">${cartSubtotal.toFixed(2)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={!isB2BValid}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isB2BValid ? 'Submit Order to orders@apexrollsupply.com' : 'Complete Verification Fields to Order'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : activeTab === 'tools' ? (
          /* TOOLS & ACCESSORIES TAB - EXACT SHOP INVENTORY */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Installer Blades, Knives & Accessories</h3>
                <p className="text-xs text-gray-400">Current on-hand inventory at Prescott Valley hub</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {toolsInventory.map((tool) => (
                <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                        {tool.category}
                      </span>
                      <span className={`text-xs font-semibold ${tool.stockQty > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tool.stockQty > 0 ? `${tool.stockQty} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base">{tool.name}</h4>
                    <p className="text-xs text-emerald-300 font-mono font-medium">{tool.detail}</p>
                    <p className="text-xs text-gray-400 leading-relaxed pt-1">{tool.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-white">${tool.unitPrice.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => handleAddToolToCart(tool)}
                      disabled={tool.stockQty <= 0}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Plus size={14} />
                      <span>Add Tool</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* HUB RECEIVING & RESTOCK ADMIN TAB */
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <ArrowDownCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Hub Inventory Receiving & Restock Portal</h3>
                  <p className="text-xs text-gray-400">Log arriving master rolls or tool shipments to instantly update live stock</p>
                </div>
              </div>

              {restockSuccessMsg && (
                <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>{restockSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleReceiveShipment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Select Item Arriving in Shipment
                  </label>
                  <select
                    value={restockItemId}
                    onChange={(e) => setRestockItemId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <optgroup label="40" Master Roll Films">
                      {filmInventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.series} - {item.vlt} (Current: {item.stockFt} ft in stock)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Installer Tools & Accessories">
                      {toolsInventory.map((tool) => (
                        <option key={tool.id} value={tool.id}>
                          {tool.name} (Current: {tool.stockQty} in stock)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Quantity Received (Rolls / Packs / Units)
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setRestockQtyInput((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700 text-base"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={restockQtyInput}
                      onChange={(e) => setRestockQtyInput(Math.max(1, Number(e.target.value)))}
                      className="w-24 text-center bg-slate-950 border border-slate-800 text-white text-base font-bold rounded-xl py-2.5 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setRestockQtyInput((q) => q + 1)}
                      className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700 text-base"
                    >
                      +
                    </button>
                    <span className="text-xs text