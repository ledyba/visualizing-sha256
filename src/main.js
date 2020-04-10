import SHA2 from './SHA2.js'
import ColoredNumber from './ColoredNumber.js'
import {fromHSV} from './util'

async function loop() {
  /** @type {ColoredNumber[]} */
  const input = [
    ColoredNumber.fromNumber(0b10000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
    ColoredNumber.fromNumber(0b00000000000000000000000000000000),
  ];
  let r = 0,g = 0,b = 0;
  for(let i = 0; i < 16; ++i) {
    const colors = new Array(32);
    for(let j = 0; j < 32; ++j) {
      colors[j] = fromHSV((32 * i + j)*360/(16*32), 1, 1);
    }
    input[i].colors = colors;
  }
  /** @type {CanvasRenderingContext2D} */
  const ctx = document.getElementById('screen').getContext('2d');
  /** @type {SHA2} */
  const sha2 = new SHA2(ctx);
  const result = await sha2.sum(input);
  console.log(result.toString());

}

function main() {
  loop();
}

document.addEventListener('DOMContentLoaded', main);
