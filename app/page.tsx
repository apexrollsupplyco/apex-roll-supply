"use client";

import React, { useState } from "react";

// --- TYPES ---
interface Product {
  id: string;
  name: string;
  category: "carbon" | "ceramic" | "architectural" | "tools";
  width: string;
  vlts: number[];
  type: "roll" | "cut" | "tool";
  rollPrice?: number;
  perFootPrice?: number;
  fixedPrice?: number;
  inStock: boolean;
  leadTime?: string;
  badge?: string;
  description: string;
}

interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  vlt?: number;
  width: string;
  orderType: "full_roll" | "linear_cut" | "tool";
  feet?: number;
  price: number;
  quantity: number;
}

// --- CATALOG DATA ---
const CATALOG: Product[] = [
  {
    id: "c2-carbon-40",
    name: "Apex C2 Carbon Series (40\" Hub Stock)",
    category: "carbon",
    width: "40\"",
    vlts: [5, 20, 35, 50, 70],
    type: "roll",
    rollPrice: 215,
    perFootPrice: 3.25,
    inStock: true,
    badge: "Same-Day Quad Cities Courier",
    description: "Deep nano-carbon matrix with neutral black tone. Zero color fade, non-reflective, signal friendly.",
  },
  {
    id: "c2-ceramic-40",
    name: "Apex C2 IR-Ceramic Series (40\" Hub Stock)",
    category: "ceramic",
    width: "40\"",
    vlts: [5, 20, 35, 50, 70],
    type: "roll",
    rollPrice: 345,
    perFootPrice: 4.75,
    inStock: true,
    badge: "High Heat Rejection Hub Stock",
    description: "Advanced nano-ceramic dispersion blocking up to 88% Infrared Heat (IRR). High optical clarity.",
  },
  {
    id: "c2-carbon-60",
    name: "Apex C2 Carbon Master Roll (60\" Specialty Line)",
    category: "carbon",
    width: "60\"",
    vlts: [5, 20, 35, 50],
    type: "roll",
    rollPrice: 320,
    inStock: false,
    leadTime: "2-3 Day Regional Dispatch",
    badge: "Specialty Master Roll",
    description: "Wide master rolls for oversized windshields, back glass, and seamless specialty runs.",
  },
  {
    id: "c2-ceramic-60",
    name: "Apex C2 IR-Ceramic Master Roll (60\" Specialty Line)",
    category: "ceramic",
    width: "60\"",
    vlts: [5, 20, 35, 50, 70],
    type: "roll",
    rollPrice: 485,
    inStock: false,
    leadTime: "2-3 Day Regional Dispatch",
    badge: "Specialty Master Roll",
    description: "Full 60-inch high IR-rejection master rolls for premium windshield brows and expansive glass surfaces.",
  },
  {
    id: "arch-solar-dual",
    name: "Architectural Solar Neutral Series (60\" Flat Glass)",
    category: "architectural",
    width: "60\"",
    vlts: [15, 25, 35],
    type: "roll",
    inStock: true,
    badge: "Commercial / Residential Direct",
    description: "Commercial-grade dual-reflective and neutral solar control films. Custom cut-to-spec dispatch.",
  },
  {
    id: "tool-nt-cutter",
    name: "NT Cutter Pro A-1 Stainless Steel Precision Knife",
    category: "tools",
    width: "Standard",
    vlts: [],
    type: "tool",
    fixedPrice: 18.5,
    inStock: true,
    badge: "Shop Essential",
    description: "Ultra-precise stainless steel auto-lock blade holder. Industry standard for plotter and glass trimming.",
  },
  {
    id: "tool-30-blades",
    name: "NT 30-Degree Stainless Replacement Blades (Pack of 50)",
    category: "tools",
    width: "Standard",
    vlts: [],
    type: "tool",
    fixedPrice: 22.0,
    inStock: true,
    badge: "Shop Essential",
    description: "High-grade tempered 30° snap-off blades for precision edge cutting without glass scoring.",
  },
  {
    id: "tool-banana-buffers",
    name: "Monkey Strips / Banana Buffers (10-Pack Wet Felt)",
    category: "tools",
    width: "Standard",
    vlts: [],
    type: "tool",
    fixedPrice: 14.0,
    inStock: true,
    badge: "Scratch-Free Prep",
    description: "Wet felt wing buffers designed to eliminate friction scratch lines during hard squeegee passes.",
  },
];

export default function Home() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeError, setPasscodeError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Selection states per product
  const [selectedVlts, setSelectedVlts] = useState<Record<string, number>>({
    "c2-carbon-40": 20,
    "c2-ceramic-40": 20,
    "c2-carbon-60": 20,
    "c2-ceramic-60": 20,
    "arch-solar-dual": 25,
  });

  const [cutLengths, setCutLengths] = useState<Record<string, number>>({
    "c2-carbon-40": 15,
    "c2-ceramic-40": 15,
  });

  // Cart & Fulfillment
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"free_local" | "extended" | "pickup">("free_local");

  // Shop Checkout State
  const [shopName, setShopName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tptNumber, setTptNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Authentication Check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "APEX2026" || passcode.trim() === "8923") {
      setIsAuthenticated(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid shop passcode. Please enter a valid dealer passcode or call dispatch.");
    }
  };

  const setVlt = (productId: string, vlt: number) => {
    setSelectedVlts((prev) => ({ ...prev, [productId]: vlt }));
  };

  const setLength = (productId: string, length: number) => {
    setCutLengths((prev) => ({ ...prev, [productId]: Math.max(5, length) }));
  };

  // Add items to cart
  const addToCart = (product: Product, mode: "roll" | "cut" | "tool") => {
    const vlt = selectedVlts[product.id];
    let price = 0;
    let name = product.name;
    let feet: number | undefined = undefined;

    if (mode === "roll") {
      price = product.rollPrice || 0;
      name = `${product.name} - ${vlt}% VLT (100' Full Roll)`;
    } else if (mode === "cut") {
      const len = cutLengths[product.id] || 10;
      feet = len;
      price = (product.perFootPrice || 0) * len;
      name = `${product.name} - ${vlt}% VLT (${len}' Linear Cut)`;
    } else if (mode === "tool") {
      price = product.fixedPrice || 0;
      name = product.name;
    }

    const cartId = `${product.id}-${mode}-${vlt || "none"}-${feet || "roll"}`;
    const existing = cart.find((item) => item.cartId === cartId);

    if (existing) {
      setCart(cart.map((item) => (item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([
        ...cart,
        {
          cartId,
          productId: product.id,
          name,
          vlt,
          width: product.width,
          orderType: mode === "roll" ? "full_roll" : mode === "cut" ? "linear_cut" : "tool",
          feet,
          price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Pricing computations
  const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === "extended" ? 50 : 0;
  const orderTotal = itemsSubtotal + deliveryCost;

  // Handle Order Submit
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tptNumber.trim()) {
      alert("Arizona TPT Resale License is required for tax-exempt B2B wholesale fulfillment.");
      return;
    }
    setOrderSubmitted(true);
  };

  // FILTER PRODUCTS
  const filteredProducts = CATALOG.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  // --- PASSCODE GATE ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(185,28,28,0.15),rgba(255,255,255,0))] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#14151a] border border-red-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1215] border border-red-900/60 flex items-center justify-center p-2 mb-4 shadow-lg shadow-red-950">
              <img src="/logo.png" alt="Apex Roll Supply Co." className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white uppercase">Apex Roll Supply Co.</h1>
            <p className="text-xs text-red-400 font-semibold tracking-wide uppercase mt-1">
              Wholesale Window Film Distribution Hub
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              Serving Prescott Valley, Prescott, Chino Valley &amp; Northern Arizona
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Dealer Access Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter shop passcode..."
                className="w-full px-4 py-3 rounded-xl bg-[#0d0e12] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-base"
                autoFocus
              />
              {passcodeError && <p className="text-xs text-red-500 font-medium mt-2">{passcodeError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-950 transition uppercase tracking-wider text-sm min-h-[48px]"
            >
              Enter Wholesale Portal
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">Need shop credentials or dealer onboarding?</p>
            <div className="flex flex-col gap-1 mt-2">
              <a
                href="tel:9284203903"
                className="text-xs font-bold text-red-400 hover:text-red-300 transition tracking-wide"
              >
                Dispatch Desk: (928) 420-3903
              </a>
              <span className="text-[11px] text-zinc-500">orders@apexrollsupply.com • Prescott Valley, AZ</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- MAIN PORTAL VIEW ---
  return (
    <main className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col pb-24 md:pb-12">
      {/* 1. RESPONSIVE TOP DISPATCH STRIP */}
      <div className="bg-[#1c0507] border-b border-red-950/80 text-xs text-zinc-300 py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span>
            <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs">
              PRESCOTT VALLEY WHOLESALE HUB
            </span>
            <span className="hidden md:inline text-zinc-400">
              • 40" Hub Inventory • 60" Custom Lines • Free Quad Cities Delivery
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <a
              href="tel:9284203903"
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold transition py-1 px-2 rounded-lg bg-red-950/40 border border-red-900/40 sm:bg-transparent sm:border-none"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Dispatch: (928) 420-3903
            </a>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-zinc-400">orders@apexrollsupply.com</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY BRAND HEADER */}
      <header className="border-b border-red-950/60 bg-[#14151a]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14151a] border border-red-900/50 flex items-center justify-center p-1 overflow-hidden shadow-lg shadow-red-950 shrink-0">
              <img src="/logo.png" alt="Apex Roll Supply Co." className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wider text-white uppercase leading-none">
                Apex Roll Supply Co.
              </h1>
              <p className="text-[10px] sm:text-xs text-red-300/80 tracking-tight mt-1">
                Window Tint Distribution &amp; Linear Supply Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#checkout"
              className="flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 border border-red-800/60 px-3.5 py-2 rounded-xl text-white font-semibold text-xs transition"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="hidden sm:inline">Cart:</span>
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. LOGISTICAL VALUE PROPOSITION STRIP */}
      <section className="border-b border-zinc-800/80 bg-[#101115] py-3 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-center sm:text-left text-xs text-zinc-300">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-red-500 font-bold">✔</span>
            <span>
              <strong className="text-white">Local PV Hub:</strong> No out-of-state freight delays
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-red-500 font-bold">✔</span>
            <span>
              <strong className="text-white">Custom Footage:</strong> 100' Master Boxes or Linear Cuts
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-red-500 font-bold">✔</span>
            <span>
              <strong className="text-white">Courier Dispatch:</strong> Free Quad Cities delivery routes
            </span>
          </div>
        </div>
      </section>

      {/* 4. MAIN INVENTORY & WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* CATALOG COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Hub Inventory" },
              { id: "carbon", label: "C2 Carbon Film" },
              { id: "ceramic", label: "C2 IR-Ceramic" },
              { id: "architectural", label: "Architectural Solar" },
              { id: "tools", label: "Shop Tools & Blades" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition min-h-[40px] ${
                  activeCategory === tab.id
                    ? "bg-red-600 text-white shadow-md shadow-red-950"
                    : "bg-[#14151a] text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PRODUCT CARDS */}
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const currentVlt = selectedVlts[product.id];
              const currentCut = cutLengths[product.id] || 15;

              return (
                <div
                  key={product.id}
                  className="bg-[#14151a] border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950/60 text-red-300 border border-red-900/40">
                          {product.badge}
                        </span>
                        {product.inStock ? (
                          <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Hub Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {product.leadTime}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">{product.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{product.description}</p>
                    </div>

                    {/* PRICING DISPLAY */}
                    <div className="text-left sm:text-right shrink-0">
                      {product.rollPrice && (
                        <div className="text-lg font-black text-white">
                          ${product.rollPrice}{" "}
                          <span className="text-xs font-normal text-zinc-400">/ 100' Roll</span>
                        </div>
                      )}
                      {product.perFootPrice && (
                        <div className="text-xs font-semibold text-red-400">
                          ${product.perFootPrice.toFixed(2)} / linear ft cut
                        </div>
                      )}
                      {product.fixedPrice && (
                        <div className="text-lg font-black text-white">${product.fixedPrice.toFixed(2)}</div>
                      )}
                    </div>
                  </div>

                  {/* VLT SELECTOR (TOUCH FRIENDLY 44PX TARGETS) */}
                  {product.vlts.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-zinc-800/80">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        Select Shade (VLT %):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.vlts.map((vlt) => (
                          <button
                            key={vlt}
                            onClick={() => setVlt(product.id, vlt)}
                            className={`min-w-[48px] min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border transition flex items-center justify-center ${
                              currentVlt === vlt
                                ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950"
                                : "bg-[#0d0e12] text-zinc-300 border-zinc-800 hover:border-zinc-700 active:bg-zinc-800"
                            }`}
                          >
                            {vlt}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION CONTROLS */}
                  <div className="pt-3 border-t border-zinc-800/80">
                    {product.category === "architectural" ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0e12] p-3 rounded-xl border border-zinc-800">
                        <span className="text-xs text-zinc-400">
                          Flat glass rolls require custom linear glass mapping &amp; project dispatch.
                        </span>
                        <a
                          href="tel:9284203903"
                          className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition text-center min-h-[44px] flex items-center justify-center"
                        >
                          Call Dispatch for Quote
                        </a>
                      </div>
                    ) : product.type === "tool" ? (
                      <button
                        onClick={() => addToCart(product, "tool")}
                        className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-950 transition min-h-[44px]"
                      >
                        Add to Order +
                      </button>
                    ) : (
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* LINEAR CUT CONTROL */}
                        {product.perFootPrice && (
                          <div className="flex items-center gap-2 bg-[#0d0e12] p-2 rounded-xl border border-zinc-800">
                            <span className="text-xs font-semibold text-zinc-300 pl-2">Cut:</span>
                            <button
                              onClick={() => setLength(product.id, currentCut - 5)}
                              className="w-9 h-9 rounded-lg bg-[#14151a] hover:bg-zinc-800 border border-zinc-700 text-white font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-xs font-black text-white">{currentCut} ft</span>
                            <button
                              onClick={() => setLength(product.id, currentCut + 5)}
                              className="w-9 h-9 rounded-lg bg-[#14151a] hover:bg-zinc-800 border border-zinc-700 text-white font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                            <button
                              onClick={() => addToCart(product, "cut")}
                              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition ml-1 min-h-[40px]"
                            >
                              Add Cut (${(product.perFootPrice * currentCut).toFixed(2)})
                            </button>
                          </div>
                        )}

                        {/* FULL ROLL BUTTON */}
                        {product.rollPrice && (
                          <button
                            onClick={() => addToCart(product, "roll")}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-950 transition min-h-[44px]"
                          >
                            Order 100' Full Box (${product.rollPrice})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORDER SUMMARY & CHECKOUT COLUMN */}
        <div id="checkout" className="lg:col-span-4 space-y-6">
          <div className="bg-[#14151a] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl sticky top-24">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>Wholesale Order</span>
              <span className="text-xs font-normal text-zinc-400">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </h2>

            {/* CART ITEMS */}
            {cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Cart is empty. Select rolls, linear cuts, or tools from the catalog.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80 my-4 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartId} className="py-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-zinc-200">{item.name}</div>
                      <div className="text-[11px] text-zinc-400">
                        ${item.price.toFixed(2)} each × {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-zinc-800 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartQty(item.cartId, -1)}
                          className="w-6 h-6 bg-[#0d0e12] hover:bg-zinc-800 text-zinc-400 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.cartId, 1)}
                          className="w-6 h-6 bg-[#0d0e12] hover:bg-zinc-800 text-zinc-400 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-zinc-600 hover:text-red-400 transition text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FULFILLMENT METHOD SELECTION */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Fulfillment Route
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-zinc-800 bg-[#0d0e12] cursor-pointer hover:border-zinc-700">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "free_local"}
                    onChange={() => setDeliveryMethod("free_local")}
                    className="mt-0.5 text-red-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-white">Quad Cities Courier (Free)</div>
                    <div className="text-[11px] text-zinc-400">Prescott Valley, Prescott, Chino Valley</div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-zinc-800 bg-[#0d0e12] cursor-pointer hover:border-zinc-700">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "extended"}
                    onChange={() => setDeliveryMethod("extended")}
                    className="mt-0.5 text-red-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-white">Extended Regional (+$50)</div>
                    <div className="text-[11px] text-zinc-400">Verde Valley, Cottonwood, Sedona Route</div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-zinc-800 bg-[#0d0e12] cursor-pointer hover:border-zinc-700">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="mt-0.5 text-red-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-white">Hub Dock Pickup (Free)</div>
                    <div className="text-[11px] text-zinc-400">Prescott Valley Hub will call when staged</div>
                  </div>
                </label>
              </div>
            </div>

            {/* TOTALS */}
            <div className="pt-4 border-t border-zinc-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Material Subtotal:</span>
                <span className="font-bold text-white">${itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Courier / Dispatch:</span>
                <span className="font-bold text-white">
                  {deliveryCost === 0 ? "FREE" : `$${deliveryCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>AZ TPT Wholesale Resale:</span>
                <span className="font-bold text-emerald-400">Tax Exempt</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                <span>Estimated Total:</span>
                <span className="text-red-500">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CHECKOUT FORM */}
            {!orderSubmitted ? (
              <form onSubmit={handleOrderSubmit} className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase">Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Apex Tint Studio"
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0e12] border border-zinc-800 text-white text-base focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase">Contact *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Shop Lead"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0e12] border border-zinc-800 text-white text-base focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(928) 000-0000"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0e12] border border-zinc-800 text-white text-base focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase">
                    AZ TPT License # (Required) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tptNumber}
                    onChange={(e) => setTptNumber(e.target.value)}
                    placeholder="Enter AZ Resale License #"
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0e12] border border-zinc-800 text-white text-base focus:outline-none focus:border-red-600"
                  />
                </div>

                {deliveryMethod !== "pickup" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Street address in Quad Cities / Verde Valley"
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0e12] border border-zinc-800 text-white text-base focus:outline-none focus:border-red-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase">Order Instructions</label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Gate code, bay delivery notes..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0e12] border border-zinc-800 text-white text-base focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950 transition min-h-[48px]"
                >
                  Submit Wholesale Order
                </button>
              </form>
            ) : (
              <div className="mt-5 p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-white">Order Received by Dispatch</h4>
                <p className="text-xs text-zinc-400">
                  Apex courier dispatch has received the order for {shopName}. A route confirmation has been queued for{" "}
                  {phone}.
                </p>
                <button
                  onClick={() => {
                    setOrderSubmitted(false);
                    setCart([]);
                  }}
                  className="mt-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  Place Another Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. MOBILE STICKY ORDER BAR (FLOATING AT BOTTOM ON SMALL SCREENS) */}
      {cart.length > 0 && !orderSubmitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121316]/95 backdrop-blur-md border-t border-red-900/60 p-3 px-4 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items Selected
            </div>
            <div className="text-lg font-black text-white">${orderTotal.toFixed(2)}</div>
          </div>
          <a
            href="#checkout"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-lg shadow-red-950 transition flex items-center gap-2 min-h-[44px]"
          >
            <span>Review Order</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      )}
    </main>
  );
}