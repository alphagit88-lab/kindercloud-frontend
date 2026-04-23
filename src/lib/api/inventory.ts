import api from '@/lib/api/api';

export interface StockItem {
  id: string;
  itemName: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  itemName: string;
  condition: 'good' | 'fair' | 'damaged' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export const inventoryAPI = {
  // Stock Methods
  getStocks: async (): Promise<StockItem[]> => {
    const response = await api.get<StockItem[]>('/api/inventory/stocks');
    return response.data;
  },
  addStock: async (data: Partial<StockItem>): Promise<StockItem> => {
    const response = await api.post<StockItem>('/api/inventory/stocks', data);
    return response.data;
  },
  updateStock: async (id: string, quantity: number): Promise<StockItem> => {
    const response = await api.put<StockItem>(`/api/inventory/stocks/${id}`, { quantity });
    return response.data;
  },

  // Asset Methods
  getAssets: async (): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/api/inventory/assets');
    return response.data;
  },
  addAsset: async (data: Partial<Asset>): Promise<Asset> => {
    const response = await api.post<Asset>('/api/inventory/assets', data);
    return response.data;
  },
  updateAsset: async (id: string, condition: string): Promise<Asset> => {
    const response = await api.put<Asset>(`/api/inventory/assets/${id}`, { condition });
    return response.data;
  }
};
