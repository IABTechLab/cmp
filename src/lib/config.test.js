import { expect } from 'chai';
import config from './config';

describe('config', () => {
	it('updates nested config props', () => {
		expect(config.css['font-family']).to.equal("'Helvetica Neue', Helvetica, Arial, sans-serif");
		expect(config.css['color-primary']).to.equal('#0a82be');
		config.update({ css: { 'font-family': 'MonoType' }});
		expect(config.css['font-family']).to.equal('MonoType');
		expect(config.css['color-primary']).to.equal('#0a82be');
	});

	it('.copy returns new object containing config values', () => {
		const copy = config.copy();
		expect(copy.constructor).to.not.equal(config.constructor);
		expect(Object.keys(copy)).to.be.deep.equal(Object.keys(config).filter((key) => {
			return ! { update: true, copy: true, individualOverwritesAllowed: true }[key];
		}));
		Object.keys(copy).forEach((key) => {
			expect(copy[key]).to.be.deep.equal(config[key]);
		});
	});
});
