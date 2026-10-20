// hash-wasm ships one UMD file per algorithm without its own typings.
declare module "hash-wasm/dist/md5.umd.min.js" {
  type Md5 = (data: Uint8Array | string) => Promise<string>;
  export const md5: Md5;
  const bundle: { md5: Md5 };
  export default bundle;
}
