import { h } from 'preact';
import cx from 'classnames';

import Label from '../../label/label';
import style from '../summary/summary.less';

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
      <ul>
        {allPurposes.map(({ name }) => (
          <li class="primaryText">{name}</li>
        ))}
      </ul>
    </div>
  );
};
