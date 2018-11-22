import { h } from 'preact';
import Localize from '../../lib/localize';

export const Label = ({ prefix, localizeKey, className, children, providedValue, ...rest }) => {
  const key = prefix ? `${prefix}.${localizeKey}` : localizeKey;
  const localizedContent = providedValue || Localize.lookup(key);

  return (
    <span
      class={rest.class || className}
      dangerouslySetInnerHTML={
        localizedContent && { __html: localizedContent }
      }
    >
      {!localizedContent && children}
    </span>
  );
}

export default Label;
