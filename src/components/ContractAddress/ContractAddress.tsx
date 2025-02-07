import { Label } from 'components/Label';
import { contractAddress } from 'config';
import { ExplorerLink } from '../ExplorerLink';
import { ACCOUNTS_ENDPOINT } from 'localConstants';

export const ContractAddress = () => {
  return (
    <p>
      <Label>Contract: </Label>
      <ExplorerLink
        pathname={`/${ACCOUNTS_ENDPOINT}/${contractAddress}`}
        className='border-b border-dotted border-gray-500 hover:border-solid hover:border-gray-800'
      >
        {contractAddress}
      </ExplorerLink>
    </p>
  );
};
