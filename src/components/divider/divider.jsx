import { h } from 'preact';
import PropTypes from 'prop-types';

export const Divider = ({}, { theme }) => (
  <div
    style={{ height: 1, width: '100%', backgroundColor: theme.colorBorder }}
  />
);

Divider.contextTypes = {
  theme: PropTypes.theme,
};
