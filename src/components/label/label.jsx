import { h, createElement } from 'preact';
import Localize from '../../lib/localize';
import Parser from 'html-react-parser';

const replacer = domNode => {
  console.log(domNode);
};

export const Label = ({
  is = 'span',
  prefix,
  localizeKey,
  children,
  providedValue,
  replace = replacer,
  ...rest
}) => {
  const key = prefix ? `${prefix}.${localizeKey}` : localizeKey;
  let localizedContent = providedValue || Localize.lookup(key);

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

export default Label;
