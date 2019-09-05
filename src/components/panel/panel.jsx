import { h } from "preact";

export const Panel = ({ children = [], selectedIndex = 0, className }) =>
	children[selectedIndex];
