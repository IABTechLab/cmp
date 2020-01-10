import { h, Component } from "preact";
import PropTypes from "prop-types";
import get from "lodash/get";

import defaultTranslations from "../lib/translations";

export class LocalizationProvider extends Component {
  getChildContext() {
    return {
      translate: this.translate
    };
  }

	translate = key => {
	  const { translations, language, forceLocale } = this.props;
	  const lang = forceLocale || language.toLowerCase();
	  const translated = get(translations[lang], key);
	  if (!translated) {
	    return get(defaultTranslations[lang], key);
	  }
	  return translated;
	};

	render() {
	  return <div>{this.props.children}</div>;
	}
}

LocalizationProvider.defaultProps = {
  translations: defaultTranslations,
  language: "en"
};

LocalizationProvider.contextTypes = {
  translate: PropTypes.func
};

LocalizationProvider.childContextTypes = {
  translate: PropTypes.func
};
