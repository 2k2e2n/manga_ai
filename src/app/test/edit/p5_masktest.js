let images = []; // 画像オブジェクトの配列

function preload() {
  // 各画像とマスクを読み込む
  let img1 = loadImage('3.jpg');
  let mask1 = loadImage('mask1.png');

  let img2 = loadImage('2.jpg');
  let mask2 = loadImage('mask2.png');

  images.push({ img: img1, mask: mask1, pos: [50, 50], dragging: false, offset: [0, 0] });
  images.push({ img: img2, mask: mask2, pos: [200, 200], dragging: false, offset: [0, 0] });
}

function setup() {
  createCanvas(500, 500);

  // 画像とマスクをリサイズ（キャンバスサイズに合わせる）
  for (let obj of images) {
    obj.img.resize(width, height);
    obj.mask.resize(width, height);
  }

  imageMode(CORNER);
  noLoop();
}

function draw() {
  background(0, 102, 153);

  for (let obj of images) {
    let g = createGraphics(width, height);
    g.image(obj.img, obj.pos[0], obj.pos[1]);

    let maskedImg = g.get();
    maskedImg.mask(obj.mask);

    image(maskedImg, 0, 0);
  }
}

function mousePressed() {
  for (let obj of images) {
    let [x, y] = obj.pos;
    let mx = mouseX - x;
    let my = mouseY - y;

    // 座標が画像範囲外なら無視
    if (mx < 0 || my < 0 || mx >= obj.img.width || my >= obj.img.height) continue;

    // マスクのアルファ値取得（RGBA）
    let maskColor = obj.mask.get(mouseX, mouseY); // canvas全体にマスクがあるのでそのまま座標を使う
    let alpha = maskColor[3];

    // アルファが一定以上なら有効クリックと判定
    if (alpha > 10) {
      obj.dragging = true;
      obj.offset = [mx, my];
      break;
    }
  }
}

function mouseDragged() {
  for (let obj of images) {
    if (obj.dragging) {
      obj.pos = [mouseX - obj.offset[0], mouseY - obj.offset[1]];
      redraw();
    }
  }
}

function mouseReleased() {
  for (let obj of images) {
    obj.dragging = false;
  }
}
