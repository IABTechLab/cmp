import { h } from 'preact';
import cx from 'classnames';

import { Label } from '../../label';
import { Ul, Li } from '../../ul';
import { Text } from '../../typography';
import style from '../summary/summary.less';

const formatPurpose = purpose => purpose.name;

const replaceDeviceInformation = domNode => {
  if (domNode.name === 'li') {
    return <Li>{domNode.children[0].data}</Li>;
  }
};

export const Purposes = ({ allPurposes }) => {
  return (
    <div class={style.content}>
      <Label
        is={Text}
        localizeKey="footer.deviceInformationHeader"
        class={cx(style.subtitle, 'primaryText')}
      />
      <Label
        localizeKey="footer.deviceInformation"
        replace={replaceDeviceInformation}
      />
      <Label
        is={Text}
        localizeKey="footer.purposesHeader"
        class={cx(style.subtitle, 'primaryText')}
      />
      <Ul items={allPurposes} formatItem={formatPurpose} />
    </div>
  );
};
