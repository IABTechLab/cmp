/* eslint-disable react/jsx-no-bind */
import { h } from 'preact';
import { expect } from 'chai';
import Store from '../../lib/store';
import style from './popup.less';

import Popup from './popup';
import { renderWithThemeProvider } from '../../test/helpers';

describe('Popup', () => {
  let scratch;

  beforeEach(() => {
    scratch = document.createElement('div');
  });

  it('should render with overlay hidden', () => {
    const store = new Store();
    store.isConsentToolShowing = false;
    const popup = renderWithThemeProvider(
      <Popup config={{}} updateCSSPrefs={() => {}} store={store} />,
    );
    expect(popup.querySelectorAll(`.${style.popup}`)).to.have.length(0);
  });

  it('should render with overlay visible', () => {
    const store = new Store();
    store.isConsentToolShowing = true;
    const popup = renderWithThemeProvider(<Popup config={{}} store={store} />);
    expect(popup.querySelectorAll(`.${style.popup}`)).to.have.length(1);
  });

  it('should handle accept all', done => {
    const store = new Store();
    store.selectAllVendors = jest.fn();
    store.selectAllPurposes = jest.fn();
    store.selectAllCustomPurposes = jest.fn();

    let popup;
    renderWithThemeProvider(
      <Popup
        config={{}}
        updateCSSPrefs={() => {}}
        store={store}
        ref={ref => (popup = ref)}
        onSave={() => {
          expect(store.selectAllVendors.mock.calls[0][0]).to.equal(true);
          expect(store.selectAllPurposes.mock.calls[0][0]).to.equal(true);
          expect(store.selectAllCustomPurposes.mock.calls[0][0]).to.equal(true);
          done();
        }}
      />,
      scratch,
    );

    popup.onAcceptAll();
  });

  it('should render a logo', () => {
    const store = new Store();
    store.isConsentToolShowing = true;

    renderWithThemeProvider(
      <Popup
        config={{ logoUrl: 'https://www.example.com/image.jpg' }}
        updateCSSPrefs={() => {}}
        store={store}
        ref={() => {}}
      />,
      scratch,
    );

    expect(scratch.innerHTML).to.contain(
      `<img class="logo" src="https://www.example.com/image.jpg">`,
    );
  });

  it('should switch between panel states', () => {
    const store = new Store();

    let popup;
    renderWithThemeProvider(
      <Popup
        config={{}}
        updateCSSPrefs={() => {}}
        store={store}
        ref={ref => (popup = ref)}
      />,
      scratch,
    );

    expect(popup.state.selectedPanelIndex).to.equal(0);
    popup.showSummary();
    expect(popup.state.selectedPanelIndex).to.equal(1);
    popup.showIntro();
    expect(popup.state.selectedPanelIndex).to.equal(0);
  });
});
