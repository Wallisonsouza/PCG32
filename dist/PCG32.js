export default class PCG32 {
    state = 0n;
    inc = 0n;
    static MASK_64 = (1n << 64n) - 1n;
    static MASK_32 = 0xffffffffn;
    static PCG_MAGIC_MULTIPLIER = 6364136223846793005n;
    static UINT32_MAX = 0xFFFFFFFF;
    constructor(initState = 42n, initSeq = 54n) {
        this.srandom(initState, initSeq);
    }
    random() {
        const oldstate = this.state;
        this.state = (oldstate * PCG32.PCG_MAGIC_MULTIPLIER + this.inc) & PCG32.MASK_64;
        const xorshifted = PCG32.calcXorshifted(oldstate);
        const rot = PCG32.calcRot(oldstate);
        const rot32 = Number(rot);
        const result = PCG32.rotateRight32(xorshifted & PCG32.MASK_32, rot32);
        return Number(result);
    }
    static calcXorshifted(state) {
        return ((state >> 18n) ^ state) >> 27n;
    }
    static calcRot(state) {
        return state >> 59n;
    }
    static rotateRight32(value, rot) {
        const rotMod = rot & 31;
        if (rotMod === 0)
            return value & PCG32.MASK_32;
        const rotBig = BigInt(rotMod);
        const shiftLeft = 32n - rotBig;
        return ((value >> rotBig) | (value << shiftLeft)) & PCG32.MASK_32;
    }
    srandom(initState, initSeq) {
        this.state = 0n;
        this.inc = (initSeq << 1n) | 1n;
        this.random();
        this.state = (this.state + initState) & PCG32.MASK_64;
        this.random();
    }
    randomFloat() {
        return this.random() / PCG32.UINT32_MAX;
    }
}
