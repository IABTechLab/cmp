import { h } from 'preact';

import { Label } from '../../../label';
import { LocalizedLink } from '../../../link';
import style from './purposes.less';

export const Disclaimer = ({ onShowVendors }) => (
  <div class={style.disclaimer}>
    <Label localizeKey="purposes.disclaimer" />
    <LocalizedLink
      localizeKey="purposes.disclaimerVendorLink"
      onClick={onShowVendors}
    />
  </div>
);
