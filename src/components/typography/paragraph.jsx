import { h } from 'preact';
import style from './paragraph.less';

export const Paragraph = ({ children, ...rest }) => (
  <p class={style.paragraph} {...rest}>
    {children}
  </p>
);
