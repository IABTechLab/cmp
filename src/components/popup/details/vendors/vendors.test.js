/* eslint-disable react/jsx-no-bind */
import { h } from 'preact';
import { expect } from 'chai';
import style from '../vendortable.less';

import { Vendors } from './vendors';
import { renderWithThemeProvider } from '../../../../test/helpers';

describe('Vendors', () => {
	let scratch;

	beforeEach(() => {
		scratch = document.createElement('div');
	});

  it('should render the vendor list', () => {
    const vendors = renderWithThemeProvider(
      <Vendors
        updateCSSPrefs={() => {}}
        vendors={[
          { id: 1, name: 'Vendor 1' },
          { id: 2, name: 'Vendor 2' },
          { id: 3, name: 'Vendor 3' },
          { id: 4, name: 'Vendor 4' },
        ]}
      />,
      scratch,
    );

    const vendorRows = vendors.querySelectorAll(
      `.${style.vendorTable} tbody tr`,
    );
    expect(vendorRows.length).to.equal(4);
  });
});
