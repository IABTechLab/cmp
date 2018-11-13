import { h } from 'preact';
import cx from 'classnames';

import style from './title.less';

export const Title = ({ children, alignment }) => {
  return (
    <div class={cx({ [style.title]: true, [style[alignment]]: !!alignment })}>
      {children}
    </div>
  );
};
