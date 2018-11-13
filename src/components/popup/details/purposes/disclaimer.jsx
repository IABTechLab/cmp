import { h } from 'preact';

import style from './purposes.less';
import Label from '../../../label/label';

export const Disclaimer = ({ onShowVendors }) => {
  return (
    <div class={style.disclaimer + ' primaryText'}>
      <Label localizeKey="purposes.disclaimer" />
      <a class={style.vendorLink} onClick={onShowVendors}>
        <Label localizeKey="purposes.disclaimerVendorLink" />
      </a>
    </div>
  );
};
