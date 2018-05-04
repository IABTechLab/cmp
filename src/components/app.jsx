import { h, Component } from 'preact';
import style from './app.less';
import { currentLocale } from '../lib/localize';

import Popup from './popup/popup';
import Footer from './footer/footer';

export default class App extends Component {
	state = {
		store: this.props.store
	};

	onSave = () => {
		const { store, notify } = this.props;
		store.persist();
		notify('onSubmit');
		store.toggleConsentToolShowing(false);
		store.toggleFooterShowing(true);
	};


	updateState = (store) => {
		this.setState({ store });
	};

	componentWillMount() {
		const { store, config } = this.props;
		store.subscribe(this.updateState);
	}

	render(props, state) {

		const { store } = state;
		const { config } = props;
		const userLocalization = config.localization[currentLocale];

		return (
			<div class={style.gdpr}>
				<Popup
					store={store}
					localization={userLocalization}
					onSave={this.onSave}
				/>
				<Footer
					store={store}
					localization={userLocalization}
				/>
			</div>
		);
	}
}
