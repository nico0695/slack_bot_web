import { useState, useEffect } from 'react';

// ? hook to fix hydratation zustand store data on the client
const useStoreHydration = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStoreHydration;
