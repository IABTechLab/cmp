/* eslint-disable react/jsx-no-bind */
import { h, render } from 'preact';
import { expect } from 'chai';
import style from './vendors.less';

import Vendors from './vendors';

describe('Vendors', () => {
	let scratch;

	beforeEach(() => {
		scratch = document.createElement('div');
	});

	it('should render the vendor list', () => {
		const vendors = render(<Vendors
			updateCSSPrefs={() => {}}
			vendors={[
				{id: 1, name: 'Vendor 1'},
				{id: 2, name: 'Vendor 2'},
				{id: 3, name: 'Vendor 3'},
				{id: 4, name: 'Vendor 4'}
			]}
			pubvendors={
				{
					"publisherVendorsVersion": 1,
					"version": 1,
					"globalVendorListVersion": 1,
					"updatedAt": "2018-05-28T00:00:00Z",
					"disableUpstreamVendors": true,
					"vendors": [
						{
							"id": 1,
							"purposes": [1, 3, 4]
						},
						{
							"id": 2,
							"purposes": [3]
						},
						{
							"id": 3,
							"purposes": [1, 2, 3, 4]
						}
					]
				}
			}
		/>, scratch);

		const vendorRows = vendors.querySelectorAll(`.${style.vendorContent} tr`);

		// 1 less than the vendorlist contains because pubvendors acts as a whitelist
		expect(vendorRows.length).to.equal(3);
	});

	it('should handle selecting a vendor', () => {
		const selectVendor = jest.fn();

		let vendors;
		render(<Vendors
			updateCSSPrefs={() => {}}
			ref={ref => vendors = ref}
			vendors={[
				{id: 1, name: 'Vendor 1'},
				{id: 2, name: 'Vendor 2'},
				{id: 3, name: 'Vendor 3'},
				{id: 4, name: 'Vendor 4'}
			]}
			selectVendor={selectVendor}
			pubvendors={
				{
					"publisherVendorsVersion": 1,
					"version": 1,
					"globalVendorListVersion": 1,
					"updatedAt": "2018-05-28T00:00:00Z",
					"disableUpstreamVendors": true,
					"vendors": [
						{
							"id": 1,
							"purposes": [1, 3, 4]
						},
						{
							"id": 2,
							"purposes": [3]
						},
						{
							"id": 3,
							"purposes": [1, 2, 3, 4]
						}
					]
				}
			}
		/>, scratch);

		vendors.handleSelectVendor({dataId: 2, isSelected: true});
		expect(selectVendor.mock.calls[0][0]).to.equal(2);
		expect(selectVendor.mock.calls[0][1]).to.equal(true);
	});

	it('should handle accepting all vendors', () => {
		const selectAllVendors = jest.fn();

		let vendors;
		render(<Vendors
			updateCSSPrefs={() => {}}
			ref={ref => vendors = ref}
			vendors={[
				{id: 1, name: 'Vendor 1'},
				{id: 2, name: 'Vendor 2'},
				{id: 3, name: 'Vendor 3'},
				{id: 4, name: 'Vendor 4'}
			]}
			selectAllVendors={selectAllVendors}
			pubvendors={
				{
					"publisherVendorsVersion": 1,
					"version": 1,
					"globalVendorListVersion": 1,
					"updatedAt": "2018-05-28T00:00:00Z",
					"disableUpstreamVendors": true,
					"vendors": [
						{
							"id": 1,
							"purposes": [1, 3, 4]
						},
						{
							"id": 2,
							"purposes": [3]
						},
						{
							"id": 3,
							"purposes": [1, 2, 3, 4]
						}
					]
				}
			}
		/>, scratch);

		vendors.handleAcceptAll();
		expect(selectAllVendors.mock.calls[0][0]).to.equal(true);
	});

	it('should handle rejecting all vendors', () => {
		const selectAllVendors = jest.fn();

		let vendors;
		render(<Vendors
			updateCSSPrefs={() => {}}
			ref={ref => vendors = ref}
			vendors={[
				{id: 1, name: 'Vendor 1'},
				{id: 2, name: 'Vendor 2'},
				{id: 3, name: 'Vendor 3'},
				{id: 4, name: 'Vendor 4'}
			]}
			selectAllVendors={selectAllVendors}
			pubvendors={
				{
					"publisherVendorsVersion": 1,
					"version": 1,
					"globalVendorListVersion": 1,
					"updatedAt": "2018-05-28T00:00:00Z",
					"disableUpstreamVendors": true,
					"vendors": [
						{
							"id": 1,
							"purposes": [1, 3, 4]
						},
						{
							"id": 2,
							"purposes": [3]
						},
						{
							"id": 3,
							"purposes": [1, 2, 3, 4]
						}
					]
				}
			}
		/>, scratch);

		vendors.handleRejectAll();
		expect(selectAllVendors.mock.calls[0][0]).to.equal(false);
	});
});
