import { Address, privateKeyToAccount } from "viem/accounts";
import secrets from "../../secrets";
import { createPublicClient, http, PublicClient, TransactionReceipt } from "viem";
import { sepolia } from "viem/chains";
import { TxHash, TxReceipt, WriteContractParams } from "./types";

// Singleton
let publicClient: PublicClient;
export const getPublicClient = () => {
    // If publicClient is already initialized, return it
    if (publicClient) {
        return publicClient;
    }

    // Else, initialize and return publicClient
    publicClient = createPublicClient({
        chain: sepolia,
        transport: http(secrets.RPC_URL)
    })

    return publicClient;
};

export const simulateContract = async ({
    address,
    abi,
    functionName,
    args,
}: WriteContractParams ) => {
    const publicClient = getPublicClient();
    const request = await publicClient.simulateContract({
        address,
        abi,
        functionName,
        args,
    });

    return request;
};

export const waitForTransactionReceipt = async ({
    txHash,
}: TxHash ) => {
    const publicClient = getPublicClient();
    const transactionReceipt = await publicClient.waitForTransactionReceipt( 
        { hash: txHash }
    )

    return transactionReceipt;
};

export const getTransactionConfirmations = async ({
    transactionReceipt,
}: TxReceipt ) => {
    const publicClient = getPublicClient();
    let confirmations = await publicClient.getTransactionConfirmations({ transactionReceipt });

    return confirmations;
};