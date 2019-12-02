import { h } from 'preact';
import cx from 'classnames';
import PropTypes from 'prop-types';

import style from './popup.less';

export const PopupContent = ({ layout, children }, { theme }) => {
  return (
    <div
      class={cx(style.content, style[layout])}
      style={{
        backgroundColor: theme.colorBackground,
        borderColor: theme.colorBorder,
      }}
    >
      {children}
    </div>
  );
};

PopupContent.contextTypes = {
  theme: PropTypes.object.isRequired,
};
