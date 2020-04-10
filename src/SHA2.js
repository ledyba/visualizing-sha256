import ColoredNumber from './ColoredNumber.js';

// based upon
// https://ja.wikipedia.org/wiki/SHA-2#%E7%96%91%E4%BC%BC%E3%82%B3%E3%83%BC%E3%83%89

const k = [
   ColoredNumber.fromNumber(0x428a2f98),
   ColoredNumber.fromNumber(0x71374491),
   ColoredNumber.fromNumber(0xb5c0fbcf),
   ColoredNumber.fromNumber(0xe9b5dba5),
   ColoredNumber.fromNumber(0x3956c25b),
   ColoredNumber.fromNumber(0x59f111f1),
   ColoredNumber.fromNumber(0x923f82a4),
   ColoredNumber.fromNumber(0xab1c5ed5),
   ColoredNumber.fromNumber(0xd807aa98),
   ColoredNumber.fromNumber(0x12835b01),
   ColoredNumber.fromNumber(0x243185be),
   ColoredNumber.fromNumber(0x550c7dc3),
   ColoredNumber.fromNumber(0x72be5d74),
   ColoredNumber.fromNumber(0x80deb1fe),
   ColoredNumber.fromNumber(0x9bdc06a7),
   ColoredNumber.fromNumber(0xc19bf174),
   ColoredNumber.fromNumber(0xe49b69c1),
   ColoredNumber.fromNumber(0xefbe4786),
   ColoredNumber.fromNumber(0x0fc19dc6),
   ColoredNumber.fromNumber(0x240ca1cc),
   ColoredNumber.fromNumber(0x2de92c6f),
   ColoredNumber.fromNumber(0x4a7484aa),
   ColoredNumber.fromNumber(0x5cb0a9dc),
   ColoredNumber.fromNumber(0x76f988da),
   ColoredNumber.fromNumber(0x983e5152),
   ColoredNumber.fromNumber(0xa831c66d),
   ColoredNumber.fromNumber(0xb00327c8),
   ColoredNumber.fromNumber(0xbf597fc7),
   ColoredNumber.fromNumber(0xc6e00bf3),
   ColoredNumber.fromNumber(0xd5a79147),
   ColoredNumber.fromNumber(0x06ca6351),
   ColoredNumber.fromNumber(0x14292967),
   ColoredNumber.fromNumber(0x27b70a85),
   ColoredNumber.fromNumber(0x2e1b2138),
   ColoredNumber.fromNumber(0x4d2c6dfc),
   ColoredNumber.fromNumber(0x53380d13),
   ColoredNumber.fromNumber(0x650a7354),
   ColoredNumber.fromNumber(0x766a0abb),
   ColoredNumber.fromNumber(0x81c2c92e),
   ColoredNumber.fromNumber(0x92722c85),
   ColoredNumber.fromNumber(0xa2bfe8a1),
   ColoredNumber.fromNumber(0xa81a664b),
   ColoredNumber.fromNumber(0xc24b8b70),
   ColoredNumber.fromNumber(0xc76c51a3),
   ColoredNumber.fromNumber(0xd192e819),
   ColoredNumber.fromNumber(0xd6990624),
   ColoredNumber.fromNumber(0xf40e3585),
   ColoredNumber.fromNumber(0x106aa070),
   ColoredNumber.fromNumber(0x19a4c116),
   ColoredNumber.fromNumber(0x1e376c08),
   ColoredNumber.fromNumber(0x2748774c),
   ColoredNumber.fromNumber(0x34b0bcb5),
   ColoredNumber.fromNumber(0x391c0cb3),
   ColoredNumber.fromNumber(0x4ed8aa4a),
   ColoredNumber.fromNumber(0x5b9cca4f),
   ColoredNumber.fromNumber(0x682e6ff3),
   ColoredNumber.fromNumber(0x748f82ee),
   ColoredNumber.fromNumber(0x78a5636f),
   ColoredNumber.fromNumber(0x84c87814),
   ColoredNumber.fromNumber(0x8cc70208),
   ColoredNumber.fromNumber(0x90befffa),
   ColoredNumber.fromNumber(0xa4506ceb),
   ColoredNumber.fromNumber(0xbef9a3f7),
   ColoredNumber.fromNumber(0xc67178f2),
];

export default class SHA2{
  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  constructor(context) {
    this.context = context;
    /**
     * @type {ColoredNumber[]} h
     */
    this.h = [
      ColoredNumber.fromNumber(0x6a09e667),
      ColoredNumber.fromNumber(0xbb67ae85),
      ColoredNumber.fromNumber(0x3c6ef372),
      ColoredNumber.fromNumber(0xa54ff53a),
      ColoredNumber.fromNumber(0x510e527f),
      ColoredNumber.fromNumber(0x9b05688c),
      ColoredNumber.fromNumber(0x1f83d9ab),
      ColoredNumber.fromNumber(0x5be0cd19),
    ];
    /** @type {ColoredNumber[]} */
    this.w = Array.from(new Array(64), () => new ColoredNumber.fromNumber(0));
  }

  /**
   * @param {ColoredNumber[]} msg 
   * @returns {SHA2}
   */
  async sum(msg) {
    if(msg.length != 16) {
      throw "Input should be 512 bits.";
    }
    for(let i = 0; i < 16; ++i) {
      this.w[i] = msg[i];
    }
    const w = this.w;
    for(let i = 16; i < 64; ++i) {
      const s0 = (w[i-15].rotateR(7)).xor(w[i-15].rotateR(18)).xor(w[i-15].shiftR(3));
      const s1 = (w[i-2].rotateR(17)).xor(w[i-2].rotateR(19)).xor(w[i-2].shiftR(10));
      w[i] = (w[i-16]).add(s0).add(w[i-7]).add(s1);
    }
    let a = this.h[0];
    let b = this.h[1];
    let c = this.h[2];
    let d = this.h[3];
    let e = this.h[4];
    let f = this.h[5];
    let g = this.h[6];
    let h = this.h[7];
    for(let i = 0; i < 64; ++i) {
      await this.display(i, msg, a, b, c, d, e, f, g, h);
      const s1 = (e.rotateR(6)).xor(e.rotateR(11)).xor(e.rotateR(25));
      const ch = (e.and(f)).xor((e.not()).and(g));
      const temp1 = h.add(s1).add(ch).add(k[i]).add(w[i]);
      const s0 = (a.rotateR(2)).xor(a.rotateR(13)).xor(a.rotateR(22));
      const maj = (a.and(b)).xor(a.and(c)).xor(b.and(c));
      const temp2 = s0.add(maj);
      h = g;
      g = f;
      f = e;
      e = d.add(temp1);
      d = c;
      c = b;
      b = a;
      a = temp1.add(temp2);
    }
    this.h[0] = this.h[0].add(a);
    this.h[1] = this.h[1].add(b);
    this.h[2] = this.h[2].add(c);
    this.h[3] = this.h[3].add(d);
    this.h[4] = this.h[4].add(e);
    this.h[5] = this.h[5].add(f);
    this.h[6] = this.h[6].add(g);
    this.h[7] = this.h[7].add(h);
    this.display(64, msg, a, b, c, d, e, f, g, h);
    return this;
  }
  /**
   * @returns {string}
   */
  toString() {
    let s = '';
    for(let i = 0; i < 8; ++i) {
      s = s + this.h[i].toString();
    }
    return s;
  }
  
  /**
   * 
   * @param {number} step 
   * @param {ColoredNumber[]} msg 
   * @param {ColoredNumber} a 
   * @param {ColoredNumber} b 
   * @param {ColoredNumber} c 
   * @param {ColoredNumber} d 
   * @param {ColoredNumber} e 
   * @param {ColoredNumber} f 
   * @param {ColoredNumber} g 
   * @param {ColoredNumber} h 
   * @returns {Promise<void>}
   */
  display(step, msg, a, b, c, d, e, f, g, h) {
    /** @type {CanvasRenderingContext2D} */
    const ctx = this.context;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.textAlign = "left";
    ctx.font = "150% 'Arial'";
    ctx.textBaseline = "top";
    ctx.fillStyle = 'black';
    ctx.fillText(step < 64 ? `Step: ${step}` : 'Finished', 0, 10);

    ctx.fillStyle = 'black';
    ctx.fillText("input: 512bit", 0, 60);
    for(let i = 0; i < 16; ++i) {
      for(let j = 0; j < 32; ++j) {
        const color = msg[i].colors[j];
        if(!!color) {
          ctx.fillStyle = `rgb(${(color[0] * 255.0) | 0},${(color[1] * 255.0) | 0},${(color[2] * 255.0) | 0})`;
      } else {
          ctx.fillStyle = 'black';
        }
        ctx.fillRect(0 + (6 * j), 90 + (6 * i), 5, 5);
      }
    }

    ctx.fillStyle = 'black';
    ctx.fillText("output: 256bit", 0, 210);
    for(let i = 0; i < 8; ++i) {
      for(let j = 0; j < 32; ++j) {
        const color = this.h[i].colors[j];
        if(!!color) {
          ctx.fillStyle = `rgb(${(color[0] * 255.0) | 0},${(color[1] * 255.0) | 0},${(color[2] * 255.0) | 0})`;
          ctx.fillRect(0 + (6 * j), 240 + (6 * i), 5, 5);
        }
      }
    }


    ctx.fillStyle = 'black';
    ctx.fillText("w: 2048bit", 200, 60);
    for(let i = 0; i < 64; ++i) {
      for(let j = 0; j < 32; ++j) {
        const color = this.w[i].colors[j];
        if(!!color) {
          ctx.fillStyle = `rgb(${(color[0] * 255.0) | 0},${(color[1] * 255.0) | 0},${(color[2] * 255.0) | 0})`;
        } else {
          ctx.fillStyle = 'black';
        }
        ctx.fillRect(200 + (6 * j), 90 + (6 * i), 5, 5);
      }
    }

    let drawState = (name, st, offsetX) => {
      ctx.fillStyle = 'black';
      ctx.fillText(name, offsetX, 30);
      for(let i = 0; i < 32; ++i) {
        const color = st.colors[i];
        if(!!color) {
          ctx.fillStyle = `rgb(${(color[0] * 255.0) | 0},${(color[1] * 255.0) | 0},${(color[2] * 255.0) | 0})`;
        } else {
          ctx.fillStyle = 'black';
        }
        ctx.fillRect(offsetX , 60 + (13 * i), 12, 12);
      }
   };

   drawState('a', a, 410);
   drawState('b', b, 430);
   drawState('c', c, 450);
   drawState('d', d, 470);
   drawState('e', e, 490);
   drawState('f', f, 510);
   drawState('g', g, 530);
   drawState('h', h, 550);
   return new Promise((resolve, reject) => {
     window.setTimeout(() => {
       resolve(null);
     }, 100);
    });
  }
}
