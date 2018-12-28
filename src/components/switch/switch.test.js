/* eslint-disable react/jsx-no-bind */
import { h } from 'preact';
import { expect } from 'chai';
import style from './switch.less';

import Switch from './switch';
import { renderWithThemeProvider } from '../../test/helpers';

describe('Switch', () => {
  let scratch;

  beforeEach(() => {
    scratch = document.createElement('div');
  });

  it('should render switch component selected', () => {
    const switchEl = renderWithThemeProvider(<Switch isSelected />);

    expect(switchEl.querySelectorAll(`.${style.isSelected}`)).to.have.length(1);
  });

  it('should render switch component not selected', () => {
    const switchEl = renderWithThemeProvider(<Switch isSelected={false} />);
    expect(switchEl.querySelectorAll(`.${style.isSelected}`)).to.have.length(0);
  });

  it('should handle a click event', done => {
    let ref = null;
    renderWithThemeProvider(
      <Switch
        isSelected
        ref={el => {
          ref = el;
        }}
        onClick={() => {
          done();
        }}
      />,
      scratch,
    );
    ref.handleClicked();
  });
});
