import { h, render } from "preact";
import { ThemeProvider } from "../components/theme";

export const renderWithThemeProvider = (component, el) => {
	return render(<ThemeProvider>{component}</ThemeProvider>, el);
};
