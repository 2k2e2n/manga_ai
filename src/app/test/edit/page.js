'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import getWindowSize from '../../../../hooks/getWindowSize';

// 画像のパスを文字列として定義
const transparentImg = '/template_img/transparent.png';
const maskImg = '/template_img/mask1.png';
const img1 = '/ai_genimg_sample/1.webp';
const img2 = '/ai_genimg_sample/3.webp';

// react-p5をクライアントサイドでのみ読み込むように設定
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false
});

export default function P5Sketch() {
  const [window_width, window_height] = getWindowSize();
  // 1つ目の画像の状態
  const [image1X, setImage1X] = useState(200);
  const [image1Y, setImage1Y] = useState(200);
  const [image1Size, setImage1Size] = useState(100);
  const [isDragging1, setIsDragging1] = useState(false);
  // 2つ目の画像の状態
  const [image2X, setImage2X] = useState(400);
  const [image2Y, setImage2Y] = useState(200);
  const [image2Size, setImage2Size] = useState(100);
  const [isDragging2, setIsDragging2] = useState(false);
  // ピンチ操作の状態
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [initialImageSize, setInitialImageSize] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  // 画像の読み込み状態
  const [img1Loaded, setImg1Loaded] = useState(null);
  const [img2Loaded, setImg2Loaded] = useState(null);
  const [bgImg, setBgImg] = useState(null);
  const [mask, setMask] = useState(null);

  // スクロール防止のためのイベントハンドラ
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };

    // タッチイベントのデフォルト動作を防止
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('touchstart', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('touchstart', preventDefault);
    };
  }, []);

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(window_width-20, window_height-150).parent(canvasParentRef);
    // キャンバスのボーダーを設定
    canvas.style('border', '2px solid black');
    
    // 背景画像の読み込み
    p5.loadImage(transparentImg, (loadedBgImg) => {
      setBgImg(loadedBgImg);
    });

    // マスク画像の読み込み
    p5.loadImage(maskImg, (loadedMask) => {
      setMask(loadedMask);
    });

    // 1つ目の画像の読み込み
    p5.loadImage(img1, (loadedImg) => {
      setImg1Loaded(loadedImg);
      // 初期サイズを画像のアスペクト比を考慮して設定
      const aspectRatio = loadedImg.width / loadedImg.height;
      setImage1Size(200 * aspectRatio);
    });

    // 2つ目の画像の読み込み
    p5.loadImage(img2, (loadedImg) => {
      setImg2Loaded(loadedImg);
      // 初期サイズを画像のアスペクト比を考慮して設定
      const aspectRatio = loadedImg.width / loadedImg.height;
      setImage2Size(200 * aspectRatio);
    });
  };

  const draw = (p5) => {
    // 背景をクリア
    p5.clear();
    
    // 背景画像の表示
    if (bgImg) {
      p5.imageMode(p5.CORNER);
      p5.image(bgImg, 0, 0, p5.width, p5.height);
    } else {
      p5.background(220);
    }

    // 1つ目の画像の表示
    if (img1Loaded) {
      p5.imageMode(p5.CENTER);
      p5.image(
        img1Loaded,
        image1X,
        image1Y,
        image1Size,
        image1Size / (img1Loaded.width / img1Loaded.height)
      );
    }

    // 2つ目の画像の表示
    if (img2Loaded) {
      p5.imageMode(p5.CENTER);
      p5.image(
        img2Loaded,
        image2X,
        image2Y,
        image2Size,
        image2Size / (img2Loaded.width / img2Loaded.height)
      );
    }

    // マスク画像の表示（固定）
    if (mask) {
      p5.imageMode(p5.CENTER);
      p5.image(
        mask,
        p5.width/2,
        p5.height/2,
        p5.width,
        p5.height
      );
    }
  };

  const mousePressed = (p5) => {
    if (img1Loaded) {
      // 1つ目の画像の中心からの距離を計算
      const d1 = p5.dist(p5.mouseX, p5.mouseY, image1X, image1Y);
      if (d1 < image1Size/2) {
        setIsDragging1(true);
        setActiveImage(1);
        return;
      }
    }
    if (img2Loaded) {
      // 2つ目の画像の中心からの距離を計算
      const d2 = p5.dist(p5.mouseX, p5.mouseY, image2X, image2Y);
      if (d2 < image2Size/2) {
        setIsDragging2(true);
        setActiveImage(2);
        return;
      }
    }
  };

  const mouseReleased = () => {
    setIsDragging1(false);
    setIsDragging2(false);
    setActiveImage(null);
  };

  const mouseDragged = (p5) => {
    if (isDragging1) {
      setImage1X(p5.mouseX);
      setImage1Y(p5.mouseY);
    }
    if (isDragging2) {
      setImage2X(p5.mouseX);
      setImage2Y(p5.mouseY);
    }
  };

  const touchStarted = (p5) => {
    if (p5.touches.length === 2) {
      // 2本の指でのタッチ開始時
      const d = p5.dist(
        p5.touches[0].x, p5.touches[0].y,
        p5.touches[1].x, p5.touches[1].y
      );
      setInitialPinchDistance(d);
      if (activeImage === 1) {
        setInitialImageSize(image1Size);
      } else if (activeImage === 2) {
        setInitialImageSize(image2Size);
      }
    } else if (p5.touches.length === 1) {
      // 1本の指でのタッチ開始時
      if (img1Loaded) {
        const d1 = p5.dist(p5.touches[0].x, p5.touches[0].y, image1X, image1Y);
        if (d1 < image1Size/2) {
          setIsDragging1(true);
          setActiveImage(1);
          return;
        }
      }
      if (img2Loaded) {
        const d2 = p5.dist(p5.touches[0].x, p5.touches[0].y, image2X, image2Y);
        if (d2 < image2Size/2) {
          setIsDragging2(true);
          setActiveImage(2);
          return;
        }
      }
    }
    return false;
  };

  const touchEnded = () => {
    setIsDragging1(false);
    setIsDragging2(false);
    setInitialPinchDistance(null);
    setInitialImageSize(null);
    setActiveImage(null);
  };

  const touchMoved = (p5) => {
    if (p5.touches.length === 2 && initialPinchDistance !== null) {
      // ピンチイン・アウトの処理
      const currentDistance = p5.dist(
        p5.touches[0].x, p5.touches[0].y,
        p5.touches[1].x, p5.touches[1].y
      );
      const scale = currentDistance / initialPinchDistance;
      const newSize = initialImageSize * scale;
      
      // サイズの制限（最小50px、最大800px）
      const limitedSize = Math.min(Math.max(newSize, 50), 800);
      
      if (activeImage === 1) {
        setImage1Size(limitedSize);
      } else if (activeImage === 2) {
        setImage2Size(limitedSize);
      }
    } else if (p5.touches.length === 1) {
      // ドラッグの処理
      if (isDragging1) {
        setImage1X(p5.touches[0].x);
        setImage1Y(p5.touches[0].y);
      }
      if (isDragging2) {
        setImage2X(p5.touches[0].x);
        setImage2Y(p5.touches[0].y);
      }
    }
    return false;
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen"
      style={{ 
        touchAction: 'none',
        overflow: 'hidden',
        position: 'fixed',
        width: '100%',
        height: '100%'
      }}
    >
      <Sketch 
        setup={setup} 
        draw={draw} 
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        mouseDragged={mouseDragged}
        touchStarted={touchStarted}
        touchEnded={touchEnded}
        touchMoved={touchMoved}
      />
    </div>
  );
}
