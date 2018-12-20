import { h, render } from 'preact';
import { ThemeProvider } from '../components/config';

export const renderWithThemeProvider = (component, el) => {
  return render(<ThemeProvider>{component}</ThemeProvider>, el);
};
