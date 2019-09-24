/* eslint-disable react/jsx-no-bind */
import { h, render } from 'preact';
import { expect } from 'chai';
import style from './purposes.less';
import Purpose from './purpose';

describe('Purpose', () => {
	let scratch;

	beforeEach(() => {
		scratch = document.createElement('div');
	});

	it('should render li elements for each Feature', () => {
		const purpose = render(<Purpose
			updateCSSPrefs={() => {}}
			selectedPurpose={{ id: 1, name: 'Purpose 1' }}
			features={[
				{ id: 1, name: 'Feature 1' },
				{ id: 2, name: 'Feature 2' },
			]}
		/>, scratch);

		const features = purpose.querySelectorAll(`.${style.featureItem}`);
		expect(features.length).to.equal(2);
	});
});