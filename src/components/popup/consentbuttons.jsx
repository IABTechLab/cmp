import { h } from 'preact';

import style from './summary/summary.less';
import Label from '../label/label';
import Button from '../button/button';

export const ConsentButtons = ({ onShowPurposes, onAcceptAll, className }) => {
  return (
    <div class={className}>
      <Button
        name="footerReject"
        class={style.rejectAll}
        invert={true}
        onClick={onShowPurposes}
      >
        <Label localizeKey="intro.showPurposes" />
      </Button>
      <Button
        name="footerAccept"
        class={style.acceptAll}
        onClick={onAcceptAll}
      >
        <Label localizeKey="intro.acceptAll" />
      </Button>
    </div>
  );
}
