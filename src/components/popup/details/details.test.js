/* eslint-disable react/jsx-no-bind */
import { h } from 'preact';
import { expect } from 'chai';
import Store from '../../../lib/store';
import purposesStyle from './purposes/purposes.less';

import { Details } from './details';
import { renderWithThemeProvider } from '../../../test/helpers';

describe('Details', () => {
  let scratch;

  beforeEach(() => {
    scratch = document.createElement('div');
  });

  it('should render with purpose panel initially', () => {
    const store = new Store();
    store.isConsentToolShowing = false;
    const details = renderWithThemeProvider(
      <Details updateCSSPrefs={() => {}} store={store} />,
    );
    expect(
      details.querySelectorAll(`.${purposesStyle.purposes}`),
    ).to.have.length(1);
  });

  it('should switch between panel states', () => {
    const store = new Store();

    let details;
    renderWithThemeProvider(
      <Details store={store} ref={ref => (details = ref)} />,
      scratch,
    );

    expect(details.state.selectedPanelIndex).to.equal(0);
    details.handleShowVendors();
    expect(details.state.selectedPanelIndex).to.equal(1);
  });

  it('should handle selecting a vendor', () => {
    const selectVendor = jest.fn();
    const store = new Store();
    store.selectVendor = selectVendor;

    let vendors;
    renderWithThemeProvider(
      <Details
        store={store}
        ref={ref => (vendors = ref)}
        vendors={[
          { id: 1, name: 'Vendor 1' },
          { id: 2, name: 'Vendor 2' },
          { id: 3, name: 'Vendor 3' },
          { id: 4, name: 'Vendor 4' },
        ]}
      />,
      scratch,
    );

    vendors.handleSelectVendor({ dataId: 2, isSelected: true });
    expect(selectVendor.mock.calls[0][0]).to.equal(2);
    expect(selectVendor.mock.calls[0][1]).to.equal(true);
  });

  it('should handle accepting all vendors', () => {
    const selectAllVendors = jest.fn();
    const store = new Store();
    store.selectAllVendors = selectAllVendors;

    let vendors;
    renderWithThemeProvider(
      <Details
        store={store}
        ref={ref => (vendors = ref)}
        vendors={[
          { id: 1, name: 'Vendor 1' },
          { id: 2, name: 'Vendor 2' },
          { id: 3, name: 'Vendor 3' },
          { id: 4, name: 'Vendor 4' },
        ]}
      />,
      scratch,
    );

    vendors.handleSelectAllVendors();
    expect(selectAllVendors.mock.calls[0][0]).to.equal(true);
  });

  it('should handle rejecting all vendors', () => {
    const selectAllVendors = jest.fn();
    const store = new Store();
    store.selectAllVendors = selectAllVendors;

    let vendors;
    renderWithThemeProvider(
      <Details
        store={store}
        ref={ref => (vendors = ref)}
        vendors={[
          { id: 1, name: 'Vendor 1' },
          { id: 2, name: 'Vendor 2' },
          { id: 3, name: 'Vendor 3' },
          { id: 4, name: 'Vendor 4' },
        ]}
        selectAllVendors={selectAllVendors}
      />,
      scratch,
    );
    vendors.state.showEnableAll = false;

    vendors.handleSelectAllVendors();
    expect(selectAllVendors.mock.calls[0][0]).to.equal(false);
  });
});
