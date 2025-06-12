import Image from "next/image";
import template_img1 from "./../../../../public/template_img/1.jpg";
import template_img2 from "./../../../../public/template_img/2.jpg";
import template_img3 from "./../../../../public/template_img/3.jpg";
import template_img4 from "./../../../../public/template_img/4.jpg";;
import template_img5 from "./../../../../public/template_img/5.jpg";

export default function Home() {
  return (
    <div>
      <div>ページを選択して</div>
      
      <button>
        <Image
          src={template_img1}
          width={200}
          height={300}
          alt="img1"
          loading="lazy"
          style={{ cursor: 'pointer' }} // マウスオーバー時にポインターを表示
        />
      </button>

      <button>
        <Image
          src={template_img2}
          width={200}
          height={300}
          alt="img1"
          loading="lazy"
          style={{ cursor: 'pointer' }} // マウスオーバー時にポインターを表示
        />
      </button>

      <button>
        <Image
          src={template_img3}
          width={200}
          height={300}
          alt="img1"
          loading="lazy"
          style={{ cursor: 'pointer' }} // マウスオーバー時にポインターを表示
        />
      </button>

      <button>
        <Image
          src={template_img4}
          width={200}
          height={300}
          alt="img1"
          loading="lazy"
          style={{ cursor: 'pointer' }} // マウスオーバー時にポインターを表示
        />
      </button>

      <button>
        <Image
          src={template_img5}
          width={200}
          height={300}
          alt="img1"
          loading="lazy"
          style={{ cursor: 'pointer' }} // マウスオーバー時にポインターを表示
        />
      </button>


      <button>テンプレートを選択</button>

    </div>
  );
}
