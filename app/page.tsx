"use client";

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
  const [activeTab, setActiveTab] = useState<'film' | 'tools' | 'admin'>('film'); 

  // Film Ordering Form State
  const [orderType, setOrderType] = useState<'roll' | 'cut'>('roll');
  const [selectedSeries, setSelectedSeries] = useState('C2 Ceramic');
  const [selectedVlt, setSelectedVlt] = useState('20%');
  const [rollQty, setRollQty] = useState(1);
  const [cutLengthFt, setCutLengthFt] = useState(25);

  // Admin Restock Form State
  const [restockItemId, setRestockItemId] = useState(INITIAL_FILM_INVENTORY[0].id);
  const [restockQtyInput, setRestockQtyInput] = useState(1);
  const [restockSuccessMsg, setRestockSuccessMsg] = useState<string | null>(null);

  // Special Order Modal State
  const [showSpecialOrderModal, setShowSpecialOrderModal] = useState(false);
  const [specialOrderReason, setSpecialOrderReason] = useState('60" Master Roll / Special Delivery');

  // Cart & Orders State
  const [cart, setCart] = useState<any[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  // Verified B2B Account Info & TPT / EIN Verification Gate
  const [shopName, setShopName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [tptLicense, setTptLicense] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');

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
    if (!primary40Product || !isStockAvailable || neededFt <= 0) return;

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
  const handleAddToolToCart = (tool: any) => {
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
  const handleRemoveFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Cart Subtotal
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cart]);

  // B2B validation check
  const isB2BValid = shopName.trim().length > 0 && 
                     contactName.trim().length > 0 && 
                     contactEmail.includes('@') && 
                     tptLicense.trim().length >= 8;

  // Submit Order Logic
  const handleCheckout = (e: React.FormEvent) => {
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

    setLastOrderDetails(orderPayload);
    setCart([]);
    setOrderSubmitted(true);
  };

  // Handle Restock / Receiving submission
  const handleReceiveShipment = (e: React.FormEvent) => {
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
      <header className="sticky