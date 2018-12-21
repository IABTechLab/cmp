import { h, createElement } from 'preact';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';

const replacer = domNode => {
  console.log(domNode);
};

export const Label = (
  {
    is = 'span',
    prefix,
    localizeKey,
    children,
    replace = replacer,
    providedValue,
    ...rest
  },
  { translate = key => key },
) => {
  const key = prefix ? `${prefix}.${localizeKey}` : localizeKey;
  let localizedContent = providedValue || translate(key);

  if (localizedContent && localizedContent.indexOf('<') > -1) {
    localizedContent = Parser(localizedContent, { replace });
  }

  return createElement(
    is,
    {
      ...rest,
    },
    localizedContent || children,
  );
};

Label.contextTypes = {
  translate: PropTypes.theme,
};

export default Label;
