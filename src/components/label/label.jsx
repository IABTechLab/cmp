import { h, createElement } from 'preact';
import Localize from '../../lib/localize';

export const Label = ({
  is = 'span',
  prefix,
  localizeKey,
  children,
  providedValue,
  ...rest
}) => {
  const key = prefix ? `${prefix}.${localizeKey}` : localizeKey;
  const localizedContent = providedValue || Localize.lookup(key);

  return createElement(
    is,
    {
      dangerouslySetInnerHTML: localizedContent && { __html: localizedContent },
      ...rest,
    },
    !localizedContent && children,
  );
};

export default Label;
