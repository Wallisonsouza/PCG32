export default class PCG32 {
    private state: bigint = 0n;
    private inc: bigint = 0n;
    private static readonly MASK_64 = (1n << 64n) - 1n;
    private static readonly MASK_32 = 0xFFFFFFFFn;
    private static readonly PCG_MAGIC_MULTIPLIER = 6364136223846793005n;
    private static readonly UINT32_MAX = 0xFFFFFFFF;

    constructor(initState: bigint = 42n, initSeq: bigint = 54n) {
        this.srandom(initState, initSeq);
    }

    random(): number {
        const oldstate = this.state;
        this.state = (oldstate * PCG32.PCG_MAGIC_MULTIPLIER + this.inc) & PCG32.MASK_64;

        const xorshifted = PCG32.calcXorshifted(oldstate);
        const rot = PCG32.calcRot(oldstate);

        const rot32 = Number(rot);
        const result = PCG32.rotateRight32(xorshifted & PCG32.MASK_32, rot32);

        return Number(result);
    }

    private static calcXorshifted(state: bigint): bigint {
        return ((state >> 18n) ^ state) >> 27n;
    }

    private static calcRot(state: bigint): bigint {
        return state >> 59n;
    }

    private static rotateRight32(value: bigint, rot: number): bigint {
        const rotMod = rot & 31;
        if (rotMod === 0) return value & PCG32.MASK_32;

        const rotBig = BigInt(rotMod);
        const shiftLeft = 32n - rotBig;

        return ((value >> rotBig) | (value << shiftLeft)) & PCG32.MASK_32;
    }

    srandom(initState: bigint, initSeq: bigint): void {
        this.state = 0n;
        this.inc = (initSeq << 1n) | 1n;
        this.random();
        this.state = (this.state + initState) & PCG32.MASK_64;
        this.random();
    }

    randomFloat(): number {
        return this.random() / PCG32.UINT32_MAX;
    }
}
