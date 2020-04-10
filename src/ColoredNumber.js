/**
 * 
 * @param {number[]} a 
 * @param {number[]} b 
 * @param {number[]} c
 * @returns {number[]}
 */
function avgColor(a, b, c) {
  const total = (!!a ? 1 : 0) + (!!b ? 1 : 0) + (!!c ? 1 : 0);
  if(total === 0) {
    return null;
  }
  const color = [0, 0, 0];
  for(let i = 0; i < 3; ++i) {
    color[i] = ((!!a ? a[i] : 0) + (!!b ? b[i] : 0) + (!!c ? c[i] : 0)) / total;
  }
  return color;
}

export default class ColoredNumber {
  /**
   * 
   * @param {number[]} bits 
   * @param {number[][]} colors
   */
  constructor(bits, colors) {
    /** @type {number[]} */
    this.bits = new Array(32);
    /** @type {number[][]} */
    this.colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      this.bits[i] = bits[i];
      if(!(Number.isInteger(bits[i]))) {
        throw "bits should be number";
      }
      this.colors[i] = (!!colors && !!colors[i]) ? [...colors[i]] : null;
    }
  }
  /**
   * 
   * @param {number} value 
   * @param {number[][]} colors 
   */
  static fromNumber(value, colors) {
    colors = colors || new Array(32);
    const bits = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = (value >> i) & 1;
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @param {ColoredNumber} rhs 
   * @returns {ColoredNumber}
   */
  add(rhs) {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = 0;
      colors[i] = null;
    }
    let carry = 0;
    let carryColor = null;
    for(let i = 0; i < 32; ++i) {
      bits[i] = this.bits[i] + rhs.bits[i] + carry;
      colors[i] = avgColor(this.colors[i], rhs.colors[i], carryColor);
      if(bits[i] >= 2) {
        bits[i] = bits[i] - 2;
        carry = 1;
        carryColor = !!colors[i] ? [colors[i][0], colors[i][1], colors[i][2]] : null;
      } else {
        carry = 0;
        carryColor = null;
      }
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @param {ColoredNumber} rhs 
   * @returns {ColoredNumber}
   */
  sub(rhs) {
    return this.add(rhs.minus());
  }
  /**
   * @returns {ColoredNumber}
   */
  minus() {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = 1 - this.bits[i];
      colors[i] = !!this.colors[i] ? [...this.colors[i]] : null;
    }
    let carry = 1;
    for(let i = 0; i < 32; ++i) {
      bits[i] = bits[i] + carry;
      if(bits[i] >= 2) {
        bits[i] = bits[i] - 2;
        carry = 1;
      } else {
        carry = 0;
      }
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @returns {ColoredNumber}
   */
  not() {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = 1 - this.bits[i];
      colors[i] = !!this.colors[i] ? [...this.colors[i]] : null;
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @returns {ColoredNumber}
   */
  rotateR(n) {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      const j = (i - n + 32) % 32;
      bits[j] = this.bits[i];
      colors[j] = this.colors[i];
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @returns {ColoredNumber}
   */
  shiftR(n) {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = 0;
      colors[i] = null;
    }
    for(let i = 0; i < 32; ++i) {
      const j = (i - n);
      if(j < 0) {
        continue;
      }
      bits[j] = this.bits[i];
      colors[j] = this.colors[i];
    }
    return new ColoredNumber(bits, colors);
  }  /**
   * @argument {ColoredNumber} rhs
   * @returns {ColoredNumber}
   */
  xor(rhs) {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = (this.bits[i] ^ rhs.bits[i]) & 1;
      colors[i] = avgColor(this.colors[i], rhs.colors[i]);
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @argument {ColoredNumber} rhs
   * @returns {ColoredNumber}
   */
  and(rhs) {
    const bits = new Array(32);
    const colors = new Array(32);
    for(let i = 0; i < 32; ++i) {
      bits[i] = (this.bits[i] & rhs.bits[i]) & 1;
      colors[i] = avgColor(this.colors[i], rhs.colors[i]);
    }
    return new ColoredNumber(bits, colors);
  }
  /**
   * @returns {string}
   */
  toString() {
    let s = '';
    for(let i = 0; i < 4; ++i) {
      const base = i * 8;
      let v = 0;
      for(let j = 0; j < 8; ++j) {
        v = v + (this.bits[base + j] << j);
      }
      s = v.toString(16).padStart(2, '0') + s;
    }
    return s;
  }
}