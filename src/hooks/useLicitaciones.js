import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

export const useLicitaciones = (filters = {}) => {
  const [licitaciones, setLicitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchLicitaciones = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getLicitaciones(filters);
        setLicitaciones(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLicitaciones();
  }, [JSON.stringify(filters)]);

  return { licitaciones, loading, error, pagination };
};