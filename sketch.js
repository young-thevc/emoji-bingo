let emoji_sample = [
  "๐ฆ",
  "๐ฉโ๐ณ",
  "๐ฅ",
  "๐ฃ",
  "๐ฅ",
  "๐ฎ",
  "๐ฉ",
  "๐ซ",
  "๐ด",
  "๐ก",
  "๐ข",
  "๐",
  "๐๏ธ",
  "โ๏ธ",
  "โ๏ธ",
];

let emoji_examples = {
  ๋ค์: [
    "๐ฆ",
    "๐ฉโ๐ณ",
    "๐ฅ",
    "๐ฃ",
    "๐ฅ",
    "๐ฎ",
    "๐ฉ",
    "๐ซ",
    "๐ด",
    "๐ก",
    "๐ข",
    "๐",
    "๐๏ธ",
    "โ๏ธ",
    "โ๏ธ",
  ],

  ์ฌ๊ทน: [
    "โฐ๏ธ",
    "๐",
    "๐",
    "๐พ",
    "โ๏ธ",
    "๐ฅ",
    "๐",
    "๐",
    "๐",
    "๐งโโ",
    "๐ธ",
    "๐ซ",
    "๐ซ",
    "๐ฏ๐ต",
    "๐น๐ญ",
  ],
  ๋ํ: [
    "๐",
    "๐ถ",
    "๐ฑ",
    "๐ฅ",
    "๐ฑ",
    "๐ฅ",
    "๐๏ธ",
    "๐๏ธ",
    "๐ช",
    "๐ฅ",
    "๐ค",
    "๐ป",
    "โ๏ธ",
    "๐ง๐ปโ๐ซ",
    "๐๏ธ",
  ],
  ์ฌ์: [
    "๐ฅณ",
    "๐",
    "๐ช",
    "๐",
    "๐ฅ",
    "๐จ๏ธ",
    "๐งฎ",
    "๐ป",
    "๐ธ",
    "๐ฐ",
    "๐ ",
    "๐ฝ",
    "๐บ๐ณ",
    "๐",
    "๐งต",
  ],
  ๊ท๋ฆฌ: [
    "๐จ",
    "๐",
    "๐ค",
    "๐",
    "๐ฆพ",
    "๐งโโ",
    "๐งโโ",
    "๐",
    "๐",
    "๐ค",
    "๐คผโโ๏ธ",
    "๐คฎ",
    "โ๏ธ",
    "๐ก",
    "๐",
  ],
  ์ฐ์ง: [
  "๐ฏ","๐ ","๐ฎ","๐คฌ","๐","๐","๐ฐ","โ","๐ฆ","๐ช","๐งณ","๐ฐ","๐ฅ","๐ชด","๐ณ"
],
};
let text_emojis = "๐ฆ๐ฉโ๐ณ๐ฅ๐ฃ๐ฅ๐ฎ๐ฉ๐ซ๐ด๐ก๐ข๐๐๏ธโ๏ธโ๏ธ";
let selected_name = "๋ค์";

let cnv;
let emojis;
const bingo_size = 3;
let inputs = [];

const dy = 10;

let emoji_positions = [];
let rect_size;
let bingo_cnt = 0;

let is_selected = Array.from({ length: 9 }, () => false);

let is_playing = false;
let p_bingo;

let bingo_horizontal = Array.from({ length: bingo_size }, () => false);
let bingo_vertical = Array.from({ length: bingo_size }, () => false);
let bingo_diagonal = [false, false];

let input_emojis = [];
let text_examples;

let HALF_HEIGHT, HALF_WIDTH;
function setup() {
  cnv = createCanvas(400, 400);
  HALF_HEIGHT = height / (bingo_size * 2);
  HALF_WIDTH = width / (bingo_size * 2);
  rect_size = [width / bingo_size, height / bingo_size];

  textSize(100);
  let div_input_holder = createDiv();

  text_examples = createP(text_emojis);

  let div_buttons = createDiv("");
  div_buttons.class("div-buttons");
  for (let name in emoji_examples) {
    let button = createButton(name);
    button.parent(div_buttons);
    button.class("button-73");
    button.mousePressed(() => {
      text_emojis = "";
      emoji_examples[name].map((emo, idx) => {
        if (idx < input_emojis.length) {
          input_emojis[idx].value(emo);
          emojis[idx < 4 ? idx : idx + 1] = emo;
        }
        text_emojis += emo;
      });
      text_examples.html(text_emojis);

      const choices = emoji_examples[name]
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
      // console.log(choices);
    });
  }

  let p_input_text = createP("8๊ฐ ์ด๋ชจ์ง๋ฅผ ์๋ ฅํด์ฃผ์ธ์");
  p_input_text.class("input-text");
  p_input_text.parent(div_input_holder);

  let div_bingo_inputs = createDiv();
  div_bingo_inputs.parent(div_input_holder);
  div_bingo_inputs.class("div-bingo-inputs");

  for (let i = 0; i < 3; i++) {
    let div_3_inputs = createDiv();
    div_3_inputs.parent(div_bingo_inputs);
    div_3_inputs.class("div-3-inputs");
    for (let j = 0; j < 3; j++) {
      const idx = j + i * 3;
      if (idx === 4) {
        let text_free = createP("Free");
        text_free.parent(div_3_inputs);
        text_free.class("text-free");
      } else {
        let input_emoji = createInput(emoji_sample[idx]);
        input_emoji.size(100);
        input_emoji.input(function () {
          if (is_playing) return;
          emojis[idx] = this.value().trim();
        });
        input_emoji.parent(div_3_inputs);
        input_emoji.class("input");
        input_emojis.push(input_emoji);
      }
    }
  }

  let input_button = createButton("Start");
  input_button.parent(div_input_holder);
  input_button.mousePressed(FixBoard);
  input_button.class("button-74");
  textAlign(CENTER, CENTER);

  div_input_holder.class("input-holder");
  for (let j = 0; j < bingo_size; j++) {
    for (let i = 0; i < bingo_size; i++) {
      const idx = i * bingo_size + j;

      emoji_positions.push([
        (width / bingo_size) * i,
        (height / bingo_size) * j,
      ]);
    }
  }

  is_selected[4] = true;
  if (emojis == undefined) {
    emojis = emoji_sample;
  }
}

function changeBingoCountText(cnt) {
  if (p_bingo) p_bingo.html("๋น๊ณ  ์ด " + cnt + "๊ฐ");
}

function FixBoard() {
  is_playing = true;
  removeElements();

  let div_input_holder = createDiv();
  div_input_holder.class("input-holder");
  p_bingo = createP("๋น๊ณ  ์ด 0๊ฐ");
  p_bingo.parent(div_input_holder);
  let save_button = createButton("์ด๋ฏธ์ง ์ ์ฅํ๊ธฐ");
  save_button.mousePressed(function () {
    let today = new Date();

    let hours = today.getHours(); // ์
    let minutes = today.getMinutes(); // ๋ถ

    saveCanvas(
      cnv,
      "7EmojiBingo-" + hours + "_" + minutes + "-" + bingo_cnt + "bingo",
      "jpg"
    );

    let canvas_data = canvas.toDataURL();

    let imageWin = window.open("", "imageWin");
    imageWin.document.write("<html><body style='margin:0'>");
    imageWin.document.write("<img src='" + canvas_data + "'>");
    imageWin.document.write("</body><html>");
    imageWin.document.title =
      "7EmojiBingo-" + hours + "_" + minutes + "-" + bingo_cnt + "bingo";
  });
  save_button.class("button-74");
  save_button.parent(div_input_holder);
}

function draw() {
  background(220);
  noFill();
  stroke(0);
  strokeWeight(5);
  for (let i = 0; i < bingo_size; i++) {
    for (let j = 0; j < bingo_size; j++) {
      const idx = i * bingo_size + j;

      push();
      translate(emoji_positions[idx][0], emoji_positions[idx][1]);

      if (is_selected[idx]) {
        fill("#7171ef");
      } else {
        fill(255);
      }
      rect(0, 0, rect_size[0], rect_size[1]);
      if (idx !== 4) {
        let emoji = idx < 4 ? emojis[idx] : emojis[idx - 1];
        text(emojis[idx], HALF_WIDTH, HALF_HEIGHT + dy);
      } else {
        noStroke();
        fill(255);

        textSize(30);
        text("THEVC", HALF_WIDTH, HALF_HEIGHT);
        text(bingo_cnt, HALF_WIDTH, HALF_HEIGHT + 30);
      }
      pop();
    }
  }

  stroke(50, 0, 250, 100);
  strokeWeight(10);
  if (bingo_diagonal[0]) {
    line(0, 0, width, height);
  }
  if (bingo_diagonal[1]) {
    line(width, 0, 0, height);
  }
  for (let i = 0; i < bingo_size; i++) {
    if (bingo_horizontal[i]) {
      const x = HALF_WIDTH + rect_size[0] * i;
      line(x, 0, x, height);
    }
    if (bingo_vertical[i]) {
      const y = HALF_HEIGHT + rect_size[1] * i;
      line(0, y, width, y);
    }
  }
}

let ready_for_new_touch = true;
function touchStarted() {
  if (!is_playing || !ready_for_new_touch) return;

  for (let i = 0; i < bingo_size; i++) {
    for (let j = 0; j < bingo_size; j++) {
      if (
        (width / bingo_size) * i < mouseX &&
        mouseX < (width / bingo_size) * (i + 1) &&
        (height / bingo_size) * j < mouseY &&
        mouseY < (height / bingo_size) * (j + 1)
      ) {
        const idx = i + j * bingo_size;
        is_selected[idx] = !is_selected[idx];
        ready_for_new_touch = false;
        setTimeout("reset_touch()", 300);
        break;
      }
    }
  }
}
function reset_touch() {
  ready_for_new_touch = true;
}

function touchEnded() {
  bingo_cnt = checkBingo();
  changeBingoCountText(bingo_cnt);
}

function checkBingo() {
  let cnt = 0;
  let lefttop_rightbottom = true;
  for (let i = 0; i < bingo_size; i++) {
    const idx = i * (bingo_size + 1);
    if (is_selected[idx] == false) {
      lefttop_rightbottom = false;
      break;
    }
  }
  let righttop_leftbottom = true;
  for (let i = 0; i < bingo_size; i++) {
    const idx = (i + 1) * (bingo_size - 1);
    if (is_selected[idx] == false) {
      righttop_leftbottom = false;
      break;
    }
  }

  if (lefttop_rightbottom) {
    bingo_diagonal[0] = true;
    cnt++;
  } else {
    bingo_diagonal[0] = false;
  }
  if (righttop_leftbottom) {
    bingo_diagonal[1] = true;
    cnt++;
  } else {
    bingo_diagonal[1] = false;
  }
  for (let i = 0; i < bingo_size; i++) {
    let is_bingo = true;
    for (let j = 0; j < bingo_size; j++) {
      const idx = i + j * bingo_size;
      if (is_selected[idx] == false) {
        is_bingo = false;
        break;
      }
    }
    if (is_bingo) {
      bingo_horizontal[i] = true;
      cnt++;
    } else {
      bingo_horizontal[i] = false;
    }
    is_bingo = true;
    for (let j = 0; j < bingo_size; j++) {
      const idx = j + i * bingo_size;
      if (is_selected[idx] == false) {
        is_bingo = false;
        break;
      }
    }
    if (is_bingo) {
      bingo_vertical[i] = true;
      cnt++;
    } else {
      bingo_vertical[i] = false;
    }
  }

  return cnt;
}
