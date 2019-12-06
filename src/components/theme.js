import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';

const theme = {
  colorPrimary: '#0a82be',
  colorSecondary: '#eaeaea',
  colorBorder: '#dddddd',
  colorBackground: '#ffffff',
  colorTextPrimary: '#333333',
  colorTextSecondary: '#0a82be',
  colorLinkColor: '#0a82be',
  colorTableBackground: '#f7f7f7',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  customFontUrl: null,
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
      theme: { ...theme, ...this.props.theme },
    };
  }

  componentWillMount() {
    if (this.props.theme.customFontUrl) {
      const head = document.head;
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = this.props.theme.customFontUrl;
      head.appendChild(link);
    }
  }

  render() {
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
