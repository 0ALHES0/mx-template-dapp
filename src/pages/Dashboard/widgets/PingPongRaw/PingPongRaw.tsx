import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Button } from 'components/Button';
import { useGetTimeToPong, useGetPingAmount } from './hooks';
import { getCountdownSeconds, setTimeRemaining } from 'helpers';
import { OutputContainer } from 'components/OutputContainer/OutputContainer';
import { PingPongOutput } from 'components/OutputContainer/components';
import { useSendPingPongTransaction } from 'hooks/transactions/useSendPingPongTransaction';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pendingTransactionsSelector, useSelector } from 'lib/sdkDappCore';

// Raw transaction are being done by directly requesting to API instead of calling the smartcontract
export const PingPongRaw = () => {
  const getTimeToPong = useGetTimeToPong();

  const { sendPingTransaction, sendPongTransaction } =
    useSendPingPongTransaction();

  const transactions = useSelector(pendingTransactionsSelector);
  const hasPendingTransactions = transactions.length > 0;
  const pingAmount = useGetPingAmount();

  const [hasPing, setHasPing] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const setSecondsRemaining = async () => {
    const secondsRemaining = await getTimeToPong();
    const { canPing, timeRemaining } = setTimeRemaining(secondsRemaining);

    setHasPing(canPing);
    if (timeRemaining && timeRemaining >= 0) {
      setSecondsLeft(timeRemaining);
    }
  };

  const onSendPingTransaction = async () => {
    await sendPingTransaction(pingAmount);
  };

  const onSendPongTransaction = async () => {
    await sendPongTransaction();
  };

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft ?? 0)
    .format('mm:ss');

  const pongAllowed = secondsLeft === 0;

  getCountdownSeconds({ secondsLeft: secondsLeft, setSecondsLeft });
  setSecondsRemaining();

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-start gap-2'>
          <Button
            disabled={!hasPing || hasPendingTransactions}
            onClick={onSendPingTransaction}
            data-testid='btnPingRaw'
            data-cy='transactionBtn'
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Ping
          </Button>

          <Button
            disabled={!pongAllowed || hasPing || hasPendingTransactions}
            data-testid='btnPongRaw'
            data-cy='transactionBtn'
            onClick={onSendPongTransaction}
          >
            <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
            Pong
          </Button>
        </div>
      </div>

      <OutputContainer>
        <PingPongOutput
          transactions={transactions}
          pongAllowed={pongAllowed}
          timeRemaining={timeRemaining}
        />
      </OutputContainer>
    </div>
  );
};
