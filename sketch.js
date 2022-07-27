let emoji_sample = "😀😃😄😁😆😅😂🤣";
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

let HALF_HEIGHT, HALF_WIDTH;
function setup() {
  createCanvas(400, 400);
  HALF_HEIGHT = height / (bingo_size * 2);
  HALF_WIDTH = width / (bingo_size * 2);
  rect_size = [width / bingo_size, height / bingo_size];

  textSize(100);
  let div_input_holder = createDiv();
  let p_input_text = createP("8개 이모지를 입력해주세요");
  p_input_text.class("input-text");
  p_input_text.parent(div_input_holder);
  let input_emoji = createInput(emoji_sample);
  input_emoji.size(100);
  input_emoji.input(InputEvent);
  input_emoji.parent(div_input_holder);
  input_emoji.class("input");

  let input_button = createButton("Start");
  input_button.parent(div_input_holder);
  input_button.mousePressed(FixBoard);
  input_button.class("button-74");
  textAlign(CENTER, CENTER);

  div_input_holder.class("input-holder");

  for (let i = 0; i < bingo_size; i++) {
    for (let j = 0; j < bingo_size; j++) {
      const idx = i + j * bingo_size;

      emoji_positions.push([
        (width / bingo_size) * i,
        (height / bingo_size) * j,
      ]);
    }
  }

  is_selected[4] = true;
  if (emojis == undefined) {
    emojis = emojiStringToArray(emoji_sample);
  }
}

function changeBingoCountText(cnt) {
  if (p_bingo) p_bingo.html("빙고 총 " + cnt + "개");
}

function FixBoard() {
  is_playing = true;
  removeElements();
  p_bingo = createP("빙고 총 0개");
}

function InputEvent() {
  if (is_playing) return;
  emojis = emojiStringToArray(this.value().trim());
}

const emojiStringToArray = function (str) {
  splited_chars = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
  arr = [];
  for (let i = 0; i < splited_chars.length; i++) {
    const c = splited_chars[i];
    if (c !== "") {
      arr.push(c);
    }
  }
  return arr;
};

function draw() {
  background(220);
  noFill();
  stroke(0);
  strokeWeight(5);
  for (let i = 0; i < bingo_size; i++) {
    for (let j = 0; j < bingo_size; j++) {
      const idx = i + j * bingo_size;

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
        text(emoji, HALF_WIDTH, HALF_HEIGHT + dy);
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
  if (!is_playing) return;

  for (let i = 0; i < bingo_size; i++) {
    for (let j = 0; j < bingo_size; j++) {
      if (
        (width / bingo_size) * i < mouseX &&
        mouseX < (width / bingo_size) * (i + 1) &&
        (height / bingo_size) * j < mouseY &&
        mouseY < (height / bingo_size) * (j + 1)
      ) {
        if (!ready_for_new_touch) {
          return;
        }
        const idx = i * bingo_size + j;
        is_selected[idx] = !is_selected[idx];
        ready_for_new_touch = false;
        continue;
      }
    }
  }
}

function touchEnded() {
  ready_for_new_touch = true;
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
      const idx = i * bingo_size + j;
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
      const idx = j * bingo_size + i;
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
