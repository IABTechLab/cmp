import { h } from 'preact';

import { Label } from '../label';
import { Button } from '../button';
import style from './summary/summary.less';

export const ConsentButtons = ({ onShowPurposes, onAcceptAll, className }) => (
  <div class={className}>
    <Button
      name="footerReject"
      class={style.rejectAll}
      invert={true}
      onClick={onShowPurposes}
    >
      <Label localizeKey="intro.showPurposes" />
    </Button>
    <Button name="footerAccept" class={style.acceptAll} onClick={onAcceptAll}>
      <Label localizeKey="intro.acceptAll" />
    </Button>
  </div>
);
