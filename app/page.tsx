"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Truck,
  WalletCards,
  Wine,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
  updated: string;
};

type Activity = {
  title: string;
  copy: string;
  time: string;
  tone: "green" | "amber" | "blue";
};

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const seedProducts: Product[] = [
  {id: 1, name: "Assyrtiko Santorini", sku: "WIN-ASS-750", category: "White wine", stock: 46, reorderLevel: 20, unitPrice: 18.4, supplier: "Aegean Cellars", updated: "8 min ago"},
  {id: 2, name: "Agiorgitiko Nemea", sku: "WIN-AGI-750", category: "Red wine", stock: 8, reorderLevel: 18, unitPrice: 13.8, supplier: "Nemea Estates", updated: "22 min ago"},
  {id: 3, name: "Xinomavro Reserve", sku: "WIN-XIN-750", category: "Red wine", stock: 4, reorderLevel: 12, unitPrice: 21.5, supplier: "Northern Vines", updated: "1 hr ago"},
  {id: 4, name: "Rosé Provence", sku: "WIN-ROS-750", category: "Rosé wine", stock: 28, reorderLevel: 15, unitPrice: 15.2, supplier: "Maison Lumière", updated: "2 hrs ago"},
  {id: 5, name: "Prosecco DOC", sku: "SPK-PRO-750", category: "Sparkling", stock: 9, reorderLevel: 14, unitPrice: 12.9, supplier: "Veneto Trade", updated: "3 hrs ago"},
  {id: 6, name: "Small Batch Dry Gin", sku: "SPI-GIN-700", category: "Spirits", stock: 17, reorderLevel: 10, unitPrice: 26.5, supplier: "Craft Distillers", updated: "Yesterday"},
];

const initialActivity: Activity[] = [
  {title: "Stock received", copy: "24 bottles of Assyrtiko Santorini", time: "08:42", tone: "green"},
  {title: "Low-stock alert", copy: "Xinomavro Reserve fell below threshold", time: "08:18", tone: "amber"},
  {title: "Expense approved", copy: "Supplier delivery · €186.40", time: "Yesterday", tone: "blue"},
];

const navigation = [
  {label: "Overview", icon: LayoutDashboard},
  {label: "Inventory", icon: Package},
  {label: "Purchase orders", icon: ShoppingCart},
  {label: "Expenses", icon: ReceiptText},
  {label: "Suppliers", icon: Truck},
];

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function stockState(product: Product) {
  if (product.stock <= product.reorderLevel / 2) return "Critical";
  if (product.stock <= product.reorderLevel) return "Low stock";
  return "Healthy";
}

export default function SupplyPilot() {
  const [products, setProducts] = useState(seedProducts);
  const [activities, setActivities] = useState(initialActivity);
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [token, setToken] = useState("");
  const [dataMode, setDataMode] = useState<"demo" | "connected">("demo");

  useEffect(() => {
    if (!apiBase) return;
    const connect = async () => {
      const login = await fetch(`${apiBase}/auth/token`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: "demo", password: "supplypilot"}),
      });
      if (!login.ok) throw new Error("Login failed");
      const credentials = (await login.json()) as {accessToken: string};
      setToken(credentials.accessToken);
      const response = await fetch(`${apiBase}/api/products`, {
        headers: {Authorization: `Bearer ${credentials.accessToken}`},
      });
      if (!response.ok) throw new Error("Inventory request failed");
      const remoteProducts = (await response.json()) as Product[];
      if (remoteProducts.length) setProducts(remoteProducts);
      setDataMode("connected");
    };
    connect().catch(() => setDataMode("demo"));
  }, []);

  const lowStock = useMemo(
    () => products.filter((product) => stockState(product) !== "Healthy"),
    [products],
  );
  const criticalStock = useMemo(
    () => products.filter((product) => stockState(product) === "Critical"),
    [products],
  );
  const totalUnits = useMemo(
    () => products.reduce((sum, product) => sum + product.stock, 0),
    [products],
  );
  const inventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.stock * product.unitPrice, 0),
    [products],
  );
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        `${product.name} ${product.sku} ${product.category} ${product.supplier}`
          .toLowerCase()
          .includes(query);
      return matchesQuery && (!lowOnly || stockState(product) !== "Healthy");
    });
  }, [products, search, lowOnly]);

  function navigate(label: string) {
    setActiveNav(label);
    setSidebarOpen(false);
    const target = label === "Overview" ? "top" : label.toLowerCase().replace(" ", "-");
    document.getElementById(target)?.scrollIntoView({behavior: "smooth"});
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const draft: Product = {
      id: Date.now(),
      name: String(form.get("name")),
      sku: String(form.get("sku")).toUpperCase(),
      category: String(form.get("category")),
      stock: Number(form.get("stock")),
      reorderLevel: Number(form.get("reorderLevel")),
      unitPrice: Number(form.get("unitPrice")),
      supplier: String(form.get("supplier")),
      updated: "Just now",
    };

    let created = draft;
    if (apiBase && token) {
      try {
        const response = await fetch(`${apiBase}/api/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
        });
        if (response.ok) created = (await response.json()) as Product;
      } catch {
        setDataMode("demo");
      }
    }

    setProducts((current) => [created, ...current]);
    setActivities((current) => [
      {
        title: "Inventory item created",
        copy: `${created.name} · ${created.stock} units`,
        time: "Just now",
        tone: "green",
      },
      ...current,
    ]);
    setModalOpen(false);
    showToast(`${created.name} added to inventory`);
  }

  function createOrder() {
    setActivities((current) => [
      {
        title: "Purchase order drafted",
        copy: `PO-1049 · ${lowStock.length} low-stock products`,
        time: "Just now",
        tone: "blue",
      },
      ...current,
    ]);
    showToast("Purchase order PO-1049 created");
  }

  return (
    <div className="appShell" id="top">
      <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <span className="brandMark"><Boxes size={20} /></span>
          <span>SupplyPilot</span>
        </div>
        <button className="sidebarClose" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
          <X size={20} />
        </button>
        <p className="navLabel">Workspace</p>
        <nav>
          {navigation.map(({label, icon: Icon}) => (
            <button
              key={label}
              className={activeNav === label ? "navItem active" : "navItem"}
              onClick={() => navigate(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Inventory" && <b>{lowStock.length}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebarCard">
          <div className="spark"><Sparkles size={17} /></div>
          <small>SMART RESTOCK</small>
          <strong>Save 12% on next month&apos;s purchasing</strong>
          <p>SupplyPilot found 3 products that can be bundled.</p>
          <button onClick={createOrder}>Review suggestion <ArrowUpRight size={14} /></button>
        </div>
        <div className="sidebarBottom">
          <button><Settings size={17} /> Settings</button>
          <div className="userBlock">
            <span>GK</span>
            <div><strong>Georgios K.</strong><small>Owner workspace</small></div>
            <MoreHorizontal size={17} />
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="mainArea">
        <header className="topbar">
          <button className="mobileMenu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <div className="searchBox">
            <Search size={18} />
            <input
              aria-label="Search inventory"
              placeholder="Search products, suppliers, orders..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topActions">
            <span className={dataMode === "connected" ? "mode connected" : "mode"}>
              <i /> {dataMode === "connected" ? "API connected" : "Live demo"}
            </span>
            <button className="iconButton" aria-label="Notifications"><Bell size={19} /><i /></button>
            <button className="profileButton"><span>GK</span><ChevronDown size={15} /></button>
          </div>
        </header>

        <div className="content">
          <section className="welcome">
            <div>
              <p><CalendarDays size={15} /> THURSDAY, 31 JULY</p>
              <h1>Good morning, Georgios.</h1>
              <span>Here&apos;s what needs your attention today.</span>
            </div>
            <button className="primaryButton" onClick={() => setModalOpen(true)}>
              <Plus size={18} /> Add inventory item
            </button>
          </section>

          <section className="metrics" aria-label="Inventory summary">
            <article>
              <div className="metricIcon green"><WalletCards size={19} /></div>
              <p>Inventory value</p>
              <h2>{euro.format(inventoryValue)}</h2>
              <span className="up"><TrendingUp size={14} /> 8.4% this month</span>
            </article>
            <article>
              <div className="metricIcon blue"><Wine size={19} /></div>
              <p>Units in stock</p>
              <h2>{totalUnits}</h2>
              <span>Across {products.length} active SKUs</span>
            </article>
            <article>
              <div className="metricIcon amber"><AlertTriangle size={19} /></div>
              <p>Low-stock items</p>
              <h2>{lowStock.length}</h2>
              <span className="warning">2 require action today</span>
            </article>
            <article>
              <div className="metricIcon violet"><CircleDollarSign size={19} /></div>
              <p>Monthly expenses</p>
              <h2>€4,280</h2>
              <span className="up"><TrendingUp size={14} /> 4.1% under budget</span>
            </article>
          </section>

          <section className="attention">
            <div className="attentionCopy">
              <div className="attentionIcon"><AlertTriangle size={23} /></div>
              <div>
                <small>RESTOCK RECOMMENDATION</small>
                <h2>{lowStock.length} products need attention</h2>
                <p>Create one consolidated order and keep your best sellers available.</p>
              </div>
            </div>
            <div className="attentionProducts">
              {lowStock.slice(0, 3).map((product) => (
                <span key={product.id}>{product.name.charAt(0)}</span>
              ))}
              <b>€642 estimated</b>
            </div>
            <button onClick={createOrder}>Create purchase order <ArrowUpRight size={16} /></button>
          </section>

          <div className="dashboardGrid">
            <section className="panel inventoryPanel" id="inventory">
              <div className="panelHead">
                <div><small>INVENTORY</small><h2>Stock overview</h2></div>
                <div className="panelActions">
                  <button className={lowOnly ? "filter active" : "filter"} onClick={() => setLowOnly(!lowOnly)}>
                    <AlertTriangle size={15} /> Low stock
                  </button>
                  <button className="more" aria-label="More inventory actions"><MoreHorizontal size={19} /></button>
                </div>
              </div>
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr><th>Product</th><th>Stock</th><th>Status</th><th>Value</th><th /></tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((product) => {
                      const state = stockState(product);
                      return (
                        <tr key={product.id}>
                          <td>
                            <span className={`productIcon ${product.category.includes("Red") ? "red" : product.category.includes("Spirit") ? "spirit" : ""}`}>
                              <Wine size={16} />
                            </span>
                            <div><strong>{product.name}</strong><small>{product.sku} · {product.supplier}</small></div>
                          </td>
                          <td><strong>{product.stock}</strong><small>Reorder at {product.reorderLevel}</small></td>
                          <td><span className={`status ${state.toLowerCase().replace(" ", "")}`}><i />{state}</span></td>
                          <td><strong>{euro.format(product.stock * product.unitPrice)}</strong><small>{euro.format(product.unitPrice)} / unit</small></td>
                          <td><button aria-label={`Actions for ${product.name}`}><MoreHorizontal size={18} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!visibleProducts.length && <div className="empty">No inventory items match this filter.</div>}
              </div>
              <div className="panelFoot">
                <span>Showing {visibleProducts.length} of {products.length} products</span>
                <button onClick={() => {setLowOnly(false); setSearch("");}}>View all inventory <ArrowUpRight size={14} /></button>
              </div>
            </section>

            <section className="panel healthPanel">
              <div className="panelHead"><div><small>STOCK HEALTH</small><h2>Availability</h2></div><button className="more"><MoreHorizontal size={19} /></button></div>
              <div className="donutWrap">
                <div className="donut"><div><strong>82%</strong><span>healthy</span></div></div>
                <div className="legend">
                  <p><i className="healthyDot" /><span>Healthy</span><strong>{products.length - lowStock.length}</strong></p>
                  <p><i className="lowDot" /><span>Low stock</span><strong>{lowStock.length - criticalStock.length}</strong></p>
                  <p><i className="criticalDot" /><span>Critical</span><strong>{criticalStock.length}</strong></p>
                </div>
              </div>
              <div className="healthNote"><Check size={16} /><span><strong>Most categories are covered.</strong> Red wine needs the next restock.</span></div>
            </section>
          </div>

          <div className="lowerGrid">
            <section className="panel expensePanel" id="expenses">
              <div className="panelHead">
                <div><small>EXPENSES</small><h2>Monthly spend</h2></div>
                <button className="monthButton">Last 6 months <ChevronDown size={14} /></button>
              </div>
              <div className="expenseSummary"><h3>€4,280</h3><span>€720 below budget</span></div>
              <div className="barChart" aria-label="Monthly expense chart">
                {[48, 64, 56, 78, 69, 58].map((height, index) => (
                  <div key={index}><span style={{height: `${height}%`}} className={index === 3 ? "peak" : ""} /><small>{["Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}</small></div>
                ))}
              </div>
            </section>

            <section className="panel ordersPanel" id="purchase-orders">
              <div className="panelHead"><div><small>PURCHASE ORDERS</small><h2>In progress</h2></div><button onClick={createOrder}><Plus size={15} /> New</button></div>
              <div className="order">
                <span className="orderIcon"><ClipboardCheck size={18} /></span>
                <div><strong>PO-1048</strong><small>Nemea Estates · 42 units</small></div>
                <div><strong>€684</strong><span className="orderStatus transit">In transit</span></div>
              </div>
              <div className="order">
                <span className="orderIcon purple"><Truck size={18} /></span>
                <div><strong>PO-1047</strong><small>Veneto Trade · 30 units</small></div>
                <div><strong>€387</strong><span className="orderStatus pending">Approved</span></div>
              </div>
              <button className="textButton">View purchase orders <ArrowUpRight size={14} /></button>
            </section>

            <section className="panel activityPanel" id="suppliers">
              <div className="panelHead"><div><small>ACTIVITY</small><h2>Recent updates</h2></div><button className="more"><MoreHorizontal size={19} /></button></div>
              <div className="activityList">
                {activities.slice(0, 3).map((activity, index) => (
                  <div className="activity" key={`${activity.title}-${index}`}>
                    <i className={activity.tone} />
                    <div><strong>{activity.title}</strong><span>{activity.copy}</span></div>
                    <small>{activity.time}</small>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="modalLayer" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modalBackdrop" onClick={() => setModalOpen(false)} aria-label="Close dialog" />
          <form className="modal" onSubmit={addProduct}>
            <div className="modalHead">
              <div><small>NEW INVENTORY ITEM</small><h2 id="modal-title">Add product</h2></div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={19} /></button>
            </div>
            <div className="formGrid">
              <label className="wide">Product name<input name="name" required placeholder="e.g. Moschofilero Mantinia" autoFocus /></label>
              <label>SKU<input name="sku" required placeholder="WIN-MOS-750" /></label>
              <label>Category<select name="category" defaultValue="White wine"><option>White wine</option><option>Red wine</option><option>Rosé wine</option><option>Sparkling</option><option>Spirits</option></select></label>
              <label>Opening stock<input name="stock" type="number" min="0" defaultValue="24" required /></label>
              <label>Reorder level<input name="reorderLevel" type="number" min="1" defaultValue="12" required /></label>
              <label>Unit price (€)<input name="unitPrice" type="number" min="0" step="0.01" defaultValue="14.50" required /></label>
              <label>Supplier<input name="supplier" required placeholder="Supplier name" /></label>
            </div>
            <div className="modalActions">
              <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="saveButton" type="submit"><Plus size={16} /> Add to inventory</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="toast"><Check size={16} /><span>{toast}</span></div>}
    </div>
  );
}
