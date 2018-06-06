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
});
