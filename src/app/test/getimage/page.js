'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GetImage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomImage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://picsum.photos/1024');
      if (!response.ok) {
        throw new Error('画像の取得に失敗しました');
      }
      setImageUrl(response.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomImage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">ランダム画像表示</h1>
      
      <div className="relative w-[512px] h-[512px] mb-4">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <p>読み込み中...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full h-full bg-red-100 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="ランダム画像"
            width={512}
            height={512}
            className="object-cover"
            priority
          />
        )}
      </div>

      <button
        onClick={fetchRandomImage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? '読み込み中...' : '新しい画像を取得'}
      </button>
    </div>
  );
}
