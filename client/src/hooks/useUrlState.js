import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key) => {
    return searchParams.get(key);
  }, [searchParams]);

  const setParam = useCallback((key, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  const setMultipleParams = useCallback((params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { getParam, setParam, setMultipleParams, clearParams };
}