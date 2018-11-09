import { h } from 'preact';

import Label from '../../label/label';
import { Chevron } from '../../chevron/chevron';
import style from './intro.less';

export const Footer = ({ onShowSummary }) => {
  return (
    <div class={style.footer}>
      <Chevron onClick={onShowSummary} />
      <Label localizeKey="footer.message" class="primaryText" />
    </div>
  );
};
