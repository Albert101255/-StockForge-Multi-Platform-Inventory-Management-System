import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Seed demo data for GitHub Pages or offline exploration
const INITIAL_DEMO_ITEMS = [
  { id: 1, name: 'Precision Screwdriver Kit (64-in-1)', sku: 'TOOL-64-SCR', categoryId: 1, category: { id: 1, name: 'Tools' }, quantity: 38, minQuantity: 10, unitPrice: 24.99, deletedAt: null, updatedAt: new Date().toISOString() },
  { id: 2, name: 'Thermal Grizzly Kryonaut 1g', sku: 'COOL-TG-KRYO', categoryId: 2, category: { id: 2, name: 'Cooling' }, quantity: 4, minQuantity: 15, unitPrice: 11.50, deletedAt: null, updatedAt: new Date().toISOString() },
  { id: 3, name: 'Cat6 Shielded Ethernet Cable 15m', sku: 'NET-CAT6-15M', categoryId: 3, category: { id: 3, name: 'Networking' }, quantity: 82, minQuantity: 20, unitPrice: 14.99, deletedAt: null, updatedAt: new Date().toISOString() },
  { id: 4, name: 'SanDisk 128GB Extreme MicroSD', sku: 'STOR-SD-128', categoryId: 4, category: { id: 4, name: 'Storage' }, quantity: 5, minQuantity: 12, unitPrice: 19.99, deletedAt: null, updatedAt: new Date().toISOString() },
  { id: 5, name: 'Raspberry Pi 4 Model B (8GB)', sku: 'SBC-RPI4-8GB', categoryId: 5, category: { id: 5, name: 'Embedded' }, quantity: 14, minQuantity: 5, unitPrice: 75.00, deletedAt: null, updatedAt: new Date().toISOString() },
  { id: 6, name: 'Anker USB-C to HDMI 4K Adapter', sku: 'ACC-ANK-HDMI', categoryId: 6, category: { id: 6, name: 'Adapters' }, quantity: 29, minQuantity: 8, unitPrice: 17.99, deletedAt: null, updatedAt: new Date().toISOString() }
];

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Tools', _count: { items: 12 } },
  { id: 2, name: 'Cooling', _count: { items: 6 } },
  { id: 3, name: 'Networking', _count: { items: 18 } },
  { id: 4, name: 'Storage', _count: { items: 9 } },
  { id: 5, name: 'Embedded', _count: { items: 14 } },
  { id: 6, name: 'Adapters', _count: { items: 7 } }
];

function getDemoItems() {
  const stored = localStorage.getItem('stockforge_items');
  if (!stored) {
    localStorage.setItem('stockforge_items', JSON.stringify(INITIAL_DEMO_ITEMS));
    return INITIAL_DEMO_ITEMS;
  }
  return JSON.parse(stored);
}

function saveDemoItems(items) {
  localStorage.setItem('stockforge_items', JSON.stringify(items));
}

// Request interceptor to attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful mock fallback for GitHub Pages
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method?.toLowerCase() || 'get';

    // If server is unreachable or offline, provide seamless client-side demo responses
    if (!error.response || error.code === 'ERR_NETWORK' || window.location.hostname.includes('github.io')) {
      if (url.includes('/auth/login')) {
        const demoUser = { id: 1, name: 'Abraham Albert (Demo Admin)', email: 'admin@stockforge.io', role: 'ADMIN' };
        localStorage.setItem('token', 'demo-jwt-token');
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { data: { token: 'demo-jwt-token', user: demoUser } };
      }

      if (url.includes('/dashboard') || url.includes('/stats')) {
        const items = getDemoItems();
        const active = items.filter(i => !i.deletedAt);
        const low = active.filter(i => i.quantity <= i.minQuantity).length;
        const totalVal = active.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
        return {
          data: {
            totalItems: active.length,
            lowStock: low,
            totalCategories: INITIAL_CATEGORIES.length,
            totalValue: totalVal,
            recentLogs: [
              { id: 101, action: 'STOCK_IN', quantity: 20, reason: 'Vendor Shipment #4912', createdAt: new Date(Date.now() - 3600000).toISOString(), item: { name: 'Cat6 Shielded Ethernet Cable 15m' }, user: { name: 'Abraham Albert' } },
              { id: 102, action: 'STOCK_OUT', quantity: 6, reason: 'Lab Workstation Assembly', createdAt: new Date(Date.now() - 14400000).toISOString(), item: { name: 'Precision Screwdriver Kit (64-in-1)' }, user: { name: 'Duty Tech' } },
              { id: 103, action: 'ALERT_LOW', quantity: 4, reason: 'Threshold Breached (≤ 15)', createdAt: new Date(Date.now() - 86400000).toISOString(), item: { name: 'Thermal Grizzly Kryonaut 1g' }, user: { name: 'System Auditor' } }
            ]
          }
        };
      }

      if (url.includes('/items')) {
        const items = getDemoItems();
        if (method === 'get') {
          return { data: items };
        }
        if (method === 'post') {
          const body = JSON.parse(error.config.data || '{}');
          const newItem = {
            id: Date.now(),
            ...body,
            category: INITIAL_CATEGORIES.find(c => c.id === parseInt(body.categoryId, 10)) || { id: 1, name: 'General' },
            deletedAt: null,
            updatedAt: new Date().toISOString()
          };
          items.push(newItem);
          saveDemoItems(items);
          return { data: newItem };
        }
      }

      if (url.includes('/categories')) {
        return { data: INITIAL_CATEGORIES };
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default client;
