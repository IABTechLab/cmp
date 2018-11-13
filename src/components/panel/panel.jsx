import { h } from 'preact';

export const Panel = ({ children = [], selectedIndex = 0, className }) => {
  return <div class={className}>{children[selectedIndex]}</div>;
};
