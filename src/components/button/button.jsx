import { h } from 'preact';
import cx from 'classnames';

import style from './button.less';

export const Button = ({ children, onClick, invert, name, ...rest }) => (
  <button
    name={name}
    class={cx({
      [style.button]: true,
      [rest.class]: !!rest.class,
      [style.invert]: invert,
    })}
    onClick={onClick}
  >
    {children}
  </button>
);
