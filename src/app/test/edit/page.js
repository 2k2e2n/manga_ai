"use client";
import {useState} from "react";//useStateをインポート
import Image from "next/image";
import template_img1 from "./../../../../public/template_img/1.jpg";

export default function Home() {



  const [overlayVisible, setOverlayVisible] = useState(false);
  

  const showOverlay = () => {
    setOverlayVisible(true);
  };

  const hideOverlay = () => { 
    setOverlayVisible(false);
  };




  const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  button1: {
    position: 'absolute',
    top: '65px',
    left: '47px',
    width: '310px',
    height: '230px',
    fontSize: '16px',
  },
    overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    cursor: 'pointer',
  },
  overlayText: {
    color: 'white',
    // fontSize: '24px',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '20px 40px',
    borderRadius: '10px',
  },


  
};


  return (
    <div>
        <Image
          src={template_img1}
          width={390}
          height={700}
          alt="img1"
          loading="lazy"
          style={{ cursor: 'pointer' }} // マウスオーバー時にポインターを表示
        />

      <button style={styles.button1} onClick={showOverlay}>ボタン 1</button>


      {overlayVisible && (
        <div style={styles.overlay} >

          <div style={styles.overlayText}>
            <div>プロンプトを選択</div>
            
            <div>
              <button>ラブコメ</button>
              <button>ダークファンタジー</button>
              <button>SFアクション</button>
              <button>ギャグマンガ</button>
            </div>

            <button onClick={hideOverlay}>画像を生成</button>
          </div>
        </div>
      )}


    </div>
  );
}
