'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import useWindowSize from '../../../../hooks/getWindowSize';
import Overlay from '../../../../components/Overlay';

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const p5Instance = useRef(null);
  const [width, height] = useWindowSize();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // 画像タップ時の処理関数
  const handleImageTap = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
  };

  useEffect(() => {
    // ウィンドウサイズが0の場合は待機
    if (width === 0 || height === 0) return;

    // p5.jsを動的にインポート
    const loadP5 = async () => {
      const p5 = (await import('p5')).default;

      // p5.jsのインスタンスを作成
      const sketch = (p) => {
        /////////////////////////////////// ここからp5.jsを貼り付け ///////////////////////////////////

        let images = []; // 画像オブジェクトの配列
        let initialDistance = 0; // 初期のピンチ距離
        let initialScale = 1; // 初期のスケール
        let lastTapTime = 0; // 最後のタップ時間
        const doubleTapThreshold = 300; // ダブルタップ判定の閾値（ミリ秒）

        p.preload = function() {
          // 各画像とマスクを読み込む
          let img1 = p.loadImage('/ai_genimg_sample/1.webp');
          let mask1 = p.loadImage('/template_img/mask1.png');
          let img2 = p.loadImage('/ai_genimg_sample/2.webp');
          let mask2 = p.loadImage('/template_img/mask2.png');
          let img3 = p.loadImage('/ai_genimg_sample/3.webp');
          let mask3 = p.loadImage('/template_img/mask3.png');

          // 新しい画像とマスクを追加する場合は、以下のようにloadImageで読み込み
          // let img3 = p.loadImage('/ai_genimg_sample/新しい画像.webp');
          // let mask3 = p.loadImage('/template_img/新しいマスク.png');

          images = [
            { 
              img: img1, 
              mask: mask1, 
              pos: [50, 50],  // 初期位置 [x, y]
              dragging: false, 
              offset: [0, 0],
              scale: 1,
              originalWidth: 0,
              originalHeight: 0
            },
            { 
              img: img2, 
              mask: mask2, 
              pos: [50, 200], // 初期位置 [x, y]
              dragging: false, 
              offset: [0, 0],
              scale: 1,
              originalWidth: 0,
              originalHeight: 0
            },
            { 
              img: img3, 
              mask: mask3, 
              pos: [150, 200], // 初期位置 [x, y]
              dragging: false, 
              offset: [0, 0],
              scale: 1,
              originalWidth: 0,
              originalHeight: 0
            },
            // 新しい画像とマスクを追加する場合は、以下のように配列に追加
            // { 
            //   img: img3, 
            //   mask: mask3, 
            //   pos: [50, 350], // 新しい位置を指定
            //   dragging: false, 
            //   offset: [0, 0],
            //   scale: 1,
            //   originalWidth: 0,
            //   originalHeight: 0
            // }
          ];
        };

        p.setup = function() {
          // ウィンドウサイズに基づいてキャンバスサイズを設定
          const canvasWidth = width - 30;
          const canvasHeight = height - 100;
          p.createCanvas(canvasWidth, canvasHeight);

          // 画像とマスクをリサイズ（キャンバスサイズに合わせる）
          for (let obj of images) {
            // 画像のアスペクト比を保持してリサイズ
            const aspectRatio = obj.img.width / obj.img.height;
            let newWidth, newHeight;
            
            if (aspectRatio > 1) {
              // 横長の画像
              newWidth = canvasWidth;
              newHeight = canvasWidth / aspectRatio;
            } else {
              // 縦長の画像
              newHeight = canvasHeight;
              newWidth = canvasHeight * aspectRatio;
            }
            
            obj.img.resize(newWidth, newHeight);
            // マスクは元のサイズのまま
            obj.mask.resize(canvasWidth, canvasHeight);
            obj.originalWidth = obj.img.width;
            obj.originalHeight = obj.img.height;
          }

          p.imageMode(p.CORNER);
          p.noLoop();
        };

        // ウィンドウサイズが変更された時の処理
        p.windowResized = function() {
          const canvasWidth = width;
          const canvasHeight = height;
          p.resizeCanvas(canvasWidth, canvasHeight);

          // 画像とマスクを新しいサイズに合わせてリサイズ
          for (let obj of images) {
            obj.img.resize(canvasWidth, canvasHeight);
            obj.mask.resize(canvasWidth, canvasHeight);
          }
          p.redraw();
        };

        p.draw = function() {
          p.background(0, 102, 153);

          for (let obj of images) {
            let g = p.createGraphics(p.width, p.height);
            
            // スケールを適用した画像を描画
            g.push();
            g.translate(obj.pos[0], obj.pos[1]);
            g.scale(obj.scale);
            g.image(obj.img, 0, 0);
            g.pop();

            let maskedImg = g.get();
            maskedImg.mask(obj.mask);

            p.image(maskedImg, 0, 0);
          }
        };

        // 2点間の距離を計算する関数
        function getDistance(touch1, touch2) {
          return p.dist(touch1.x, touch1.y, touch2.x, touch2.y);
        }

        p.touchStarted = function() {
          if (p.touches.length === 2) {
            // ピンチ操作の開始
            initialDistance = getDistance(p.touches[0], p.touches[1]);
            for (let obj of images) {
              if (obj.dragging) {
                initialScale = obj.scale;
                break;
              }
            }
          } else if (p.touches.length === 1) {
            // シングルタップの処理
            const currentTime = Date.now();
            const touchX = p.touches[0].x;
            const touchY = p.touches[0].y;

            // マスク領域内でのタップをチェック
            for (let i = 0; i < images.length; i++) {
              const obj = images[i];
              let [x, y] = obj.pos;
              let mx = touchX - x;
              let my = touchY - y;

              if (mx < 0 || my < 0 || mx >= obj.img.width || my >= obj.img.height) continue;

              let maskColor = obj.mask.get(touchX, touchY);
              let alpha = maskColor[3];

              if (alpha > 10) {
                // マスク領域内でのタップを検出
                if (currentTime - lastTapTime < doubleTapThreshold) {
                  // ダブルタップの場合
                  console.log(`画像${i + 1}がダブルタップされました`);
                  handleImageTap(i);
                  // ここにダブルタップ時の処理を追加
                } else {
                  // シングルタップの場合
                  obj.dragging = true;
                  obj.offset = [mx, my];
                  // handleImageTap(i);
                }
                lastTapTime = currentTime;
                break;
              }
            }
          }
          return false;
        };

        p.touchMoved = function() {
          if (p.touches.length === 2) {
            // ピンチ操作の処理
            let currentDistance = getDistance(p.touches[0], p.touches[1]);
            let scaleFactor = currentDistance / initialDistance;
            
            for (let obj of images) {
              if (obj.dragging) {
                obj.scale = initialScale * scaleFactor;
                // スケールの制限
                obj.scale = p.constrain(obj.scale, 0.5, 3);
                p.redraw();
                break;
              }
            }
          } else if (p.touches.length === 1) {
            // 通常のドラッグ操作
            for (let obj of images) {
              if (obj.dragging) {
                obj.pos = [p.touches[0].x - obj.offset[0], p.touches[0].y - obj.offset[1]];
                p.redraw();
              }
            }
          }
          return false;
        };

        p.touchEnded = function() {
          for (let obj of images) {
            obj.dragging = false;
          }
          return false;
        };

        // マウスイベントも残しておく（デスクトップ用）
        p.mousePressed = p.touchStarted;
        p.mouseDragged = p.touchMoved;
        p.mouseReleased = p.touchEnded;

        /////////////////////////////////// ここまでp5.jsを貼り付け ///////////////////////////////////
      };

      // p5インスタンスを作成
      p5Instance.current = new p5(sketch, canvasRef.current);
    };

    loadP5();

    // クリーンアップ
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [width, height]);

  return (
    <div>
      <div 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100vh',
          touchAction: 'none' // モバイルでのタッチ操作を最適化
        }}
      />
      
      <Overlay 
        isOpen={selectedImageIndex !== null} 
        onClose={() => setSelectedImageIndex(null)}
      >
        {selectedImageIndex !== null && (
          <div className="overlay-content">
            <h2>画像 {selectedImageIndex + 1}</h2>
            <p>ここにボタン（プロンプト）を表示</p>
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default DrawingApp;
