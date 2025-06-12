import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>ジャンルを選択してください</div>
      <select name="pets" id="pet-select">
        <option value="">--ジャンルを選択してください--</option>
        <option value="">少年漫画</option>
        <option value="">ファンタジー</option>
        <option value="">SF</option>
        <option value="">ラブコメ</option>
        <option value="">学園/青春</option>
        <option value="">ホラー</option>
        <option value="">スポーツ</option>
        <option value="">異世界転生</option>
      </select>
      
      <button>ジャンルを保存</button>

    </div>
  );
}
