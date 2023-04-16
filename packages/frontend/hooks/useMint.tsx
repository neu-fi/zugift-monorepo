import { writeContract } from "@wagmi/core";

async function mintNft() {
  try {
    const { hash } = await writeContract({
      mode: "recklesslyUnprepared",
      address: "0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9",
      abi: [
        {
          name: "claim",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [],
          outputs: [],
        },
      ],
      functionName: "claim",
    });
    console.log(hash);
  } catch (e) {
    console.log(e);
  }
}
export default mintNft;
