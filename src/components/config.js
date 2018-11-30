import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';

const theme = {
  'color-primary': 'green',
  'color-secondary': '#eaeaea',
  'color-border': '#eaeaea',
  'color-background': '#ffffff',
  'color-text-primary': '#333333',
  'color-text-secondary': '#0a82be',
  'color-linkColor': '#0a82be',
  'color-table-background': '#f7f7f7',
  'font-family': 'Noto Sans',
  'custom-font-url': '',
};

export const mapLegacyTheme = css => {
  return Object.keys(css).reduce((agg, key) => {
    agg[camelCase(key)] = css[key];
    return agg;
  }, {});
};

export class ThemeProvider extends Component {
  getChildContext() {
    return {
      theme: this.props.theme,
    };
  }

  render() {
    console.log('render', this.props.children.length);
    return <div>{this.props.children}</div>;
  }
}

ThemeProvider.defaultProps = {
  theme: mapLegacyTheme(theme),
};

ThemeProvider.contextTypes = {
  theme: PropTypes.object,
};

ThemeProvider.childContextTypes = {
  theme: PropTypes.object,
};
