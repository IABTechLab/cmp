import { h } from 'preact';
import Label from '../label/label';

export const Link = ({ onClick, blank, children, ...rest }) => (
  <a onClick={onClick} target={blank ? '_blank' : ''} {...rest}>
    {children}
  </a>
);

export const LocalizedLink = ({ localizeKey, ...rest }) => (
  <Link {...rest}>
    <Label localizeKey={localizeKey} />
  </Link>
);
