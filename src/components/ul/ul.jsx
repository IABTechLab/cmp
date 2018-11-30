import { h } from 'preact';
import PropTypes from 'prop-types';

import style from './ul.less';

const itemFormatter = val => val.toString();

export const Ul = ({ items = [], formatItem = itemFormatter }, { theme }) => (
  <ul class={style.ul}>
    {items.map((item, i) => (
      <li class={style.li} key={i} style={{ color: theme.colorTextPrimary }}>
        {formatItem(item)}
      </li>
    ))}
  </ul>
);

Ul.contextTypes = {
  theme: PropTypes.object.isRequired,
};
