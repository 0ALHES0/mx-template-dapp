import { Transaction, TransactionPayload } from '@multiversx/sdk-core/out';
import { contractAddress } from 'config';
import { useStore } from 'hooks/useStore';
import {
  getAccount,
  getAccountProvider,
  getState,
  networkSelector,
  TransactionManager
} from 'lib/sdkDappCore';
import { GAS_LIMIT, GAS_PRICE } from 'localConstants';

export const useSendPingPongTransaction = () => {
  const network = networkSelector(getState());
  const store = useStore();
  const provider = getAccountProvider();

  const sendPingTransaction = async (amount: string) => {
    const { address, nonce } = getAccount(store);
    const txManager = TransactionManager.getInstance();

    const pingTransaction = new Transaction({
      value: amount,
      data: new TransactionPayload('ping'),
      receiver: address,
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      chainID: network.chainId,
      nonce,
      sender: address,
      version: 1
    });

    const signedTransactions = await provider.signTransactions([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pingTransaction as any
    ]);

    const hash = await txManager.send(signedTransactions);

    console.log('Ping hash:', hash);
  };

  const sendPongTransaction = async () => {
    const { address, nonce } = getAccount(store);
    const txManager = TransactionManager.getInstance();
    const pongTransaction = new Transaction({
      value: '0',
      data: new TransactionPayload('pong'),
      receiver: contractAddress,
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      chainID: network.chainId,
      nonce: nonce,
      sender: address,
      version: 1
    });

    const signedTransactions = await provider.signTransactions([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pongTransaction as any
    ]);

    const hash = await txManager.send(signedTransactions);
    console.log('Pong transaction hash: ', hash);
  };

  return {
    sendPingTransaction,
    sendPongTransaction
  };
};
