import { h } from 'preact';
import cx from 'classnames';

import { Label } from '../../label';
import { Ul } from '../../ul';
import style from '../summary/summary.less';

const formatPurpose = purpose => purpose.name;

export const Purposes = ({ allPurposes }) => {
  return (
    <div class={style.content}>
      <Label
        localizeKey="footer.deviceInformationHeader"
        class={cx(style.subtitle, 'primaryText')}
      />
      <Label localizeKey="footer.deviceInformation" class="primaryText" />
      <Label
        localizeKey="footer.purposesHeader"
        class={cx(style.subtitle, 'primaryText')}
      />
      <Ul items={allPurposes} formatItem={formatPurpose} />
    </div>
  );
};
