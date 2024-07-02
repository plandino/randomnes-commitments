import { Address, privateKeyToAccount } from "viem/accounts";
import secrets from "../../secrets";
import { createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { WriteContractParams } from "./types";

export const getWalletClient = () => {
  // Initialize and return walletClient
  const account = privateKeyToAccount(secrets.PRIVATE_KEY as Address) 

  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(secrets.RPC_URL)
  });
};

export const writeContract = async ({
  address,
  abi,
  functionName,
  args,
}: WriteContractParams ) => {
  const walletClient = getWalletClient();
  const txHash = await walletClient.writeContract({
    address,
    abi,
    functionName,
    args,
  });

  return txHash;
};