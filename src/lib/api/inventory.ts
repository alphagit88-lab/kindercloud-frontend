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
  getStocks: async (params?: any): Promise<StockItem[]> => {
    const response = await api.get<StockItem[]>('/api/inventory/stocks', { params });
    return response.data;
  },
  addStock: async (data: Partial<StockItem>): Promise<StockItem> => {
    const response = await api.post<StockItem>('/api/inventory/stocks', data);
    return response.data;
  },
  updateStock: async (id: string, data: Partial<StockItem>): Promise<StockItem> => {
    const response = await api.put<StockItem>(`/api/inventory/stocks/${id}`, data);
    return response.data;
  },
  deleteStock: async (id: string): Promise<void> => {
    await api.delete(`/api/inventory/stocks/${id}`);
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
  updateAsset: async (id: string, data: Partial<Asset>): Promise<Asset> => {
    const response = await api.put<Asset>(`/api/inventory/assets/${id}`, data);
    return response.data;
  },
  deleteAsset: async (id: string): Promise<void> => {
    await api.delete(`/api/inventory/assets/${id}`);
  }
};
