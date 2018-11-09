import { h } from 'preact';
import cx from 'classnames';

import style from './chevron.less';

export const Chevron = ({ direction, onClick }) => {
  return (
    <span name="ctrl" class={cx(style.icon, style[direction])} onClick={onClick} />
  );
};
