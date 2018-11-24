import { h } from 'preact';
import cx from 'classnames';

import style from './title.less';

export const Title = ({ children, alignment, ...rest }) => (
  <div
    class={cx({ [style.title]: true, [style[alignment]]: !!alignment })}
    {...rest}
  >
    {children}
  </div>
);
