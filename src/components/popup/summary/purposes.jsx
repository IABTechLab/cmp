import { h } from 'preact';
import cx from 'classnames';

import { Label } from '../../label';
import { Ul } from '../../ul';
import { Text } from '../../typography';
import style from '../summary/summary.less';

const formatPurpose = purpose => purpose.name;

export const Purposes = ({ allPurposes }) => {
  return (
    <div class={style.content}>
      <Label
        is={Text}
        localizeKey="footer.deviceInformationHeader"
        class={cx(style.subtitle, 'primaryText')}
      />
      <Label localizeKey="footer.deviceInformation" />
      <Label
        is={Text}
        localizeKey="footer.purposesHeader"
        class={cx(style.subtitle, 'primaryText')}
      />
      <Ul items={allPurposes} formatItem={formatPurpose} />
    </div>
  );
};
