import { h } from 'preact';

import style from './ul.less';

const itemFormatter = val => val.toString();

export const Ul = ({ items = [], formatItem = itemFormatter }) => (
  <ul class={style.ul}>
    {items.map((item, i) => (
      <li class={style.li} key={i}>
        {formatItem(item)}
      </li>
    ))}
  </ul>
);
