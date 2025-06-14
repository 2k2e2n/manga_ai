import React, { useLayoutEffect, useState } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    // クライアントサイドでのみ実行
    setIsClient(true);
    
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    // 初期サイズを設定
    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // クライアントサイドでない場合は[0, 0]を返す
  if (!isClient) {
    return [0, 0];
  }

  return size;
};

export default useWindowSize;