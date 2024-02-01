import { HiddenMap } from 'fyo/model/types';
import { Party as BaseParty } from 'models/baseModels/Party/Party';
import { GSTType } from './types';

export class Party extends BaseParty {
  gstin?: string;
  gstType?: GSTType;

  async beforeSync() {
    const gstin = this.get('gstin') as string | undefined;
    const gstType = this.get('gstType') as GSTType;

    if (gstin && gstType !== 'Registered Regular') {
      this.gstin = '';
    }
  }

  hidden: HiddenMap = {
    gstin: () => (this.gstType as GSTType) !== 'Registered Regular',
  };
}
