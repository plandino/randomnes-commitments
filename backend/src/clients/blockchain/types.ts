import { Address, TransactionReceipt } from "viem";

export interface WriteContractParams {
    address: Address;
    abi: any;
    functionName: string;
    args: any[];
}

export interface TxHash {
    txHash: Address;
}

export interface TxReceipt {
    transactionReceipt: TransactionReceipt;
}