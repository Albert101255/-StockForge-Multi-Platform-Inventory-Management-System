import { useState, useCallback } from 'react';
import client from '../api/client';

export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.get('/items', { params });
      setItems(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.get('/items/trash');
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, pagination, loading, error, fetchItems, fetchTrash };
};
