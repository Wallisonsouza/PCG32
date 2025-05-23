export default class PCG32 {
    private state;
    private inc;
    private static readonly MASK_64;
    private static readonly MASK_32;
    private static readonly PCG_MAGIC_MULTIPLIER;
    private static readonly UINT32_MAX;
    constructor(initState?: bigint, initSeq?: bigint);
    random(): number;
    private static calcXorshifted;
    private static calcRot;
    private static rotateRight32;
    srandom(initState: bigint, initSeq: bigint): void;
    randomFloat(): number;
}
