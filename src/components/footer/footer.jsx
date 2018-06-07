import { h, Component } from 'preact';
import style from './footer.less';
import Label from '../label/label';
import CloseButton from '../closebutton/closebutton';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'footer'
	};
}

export default class Footer extends Component {

	static defaultProps = {
		onShowConsent: () => {},
	};

	handleClose = () => {
		const { store } = this.props;
		const { toggleFooterShowing } = store;
		toggleFooterShowing(false);
	};

	handleShowConsent = () => {
		const { store } = this.props;
		const { showConsentTool } = store.cmp.commands;
		showConsentTool();
	};

	componentDidMount() {
		this.props.updateCSSPrefs();
	}

	render(props) {
		const { store, localization, config, updateCSSPrefs } = props;
		const { isFooterShowing } = store;

		return (
			<div
				class={style.footer}
				style={{ display: isFooterShowing && config.showFooterAfterSubmit ? 'flex' : 'none' }}
				>
				<CloseButton
					hasBorder={false}
					class={style.close}
					onClick={this.handleClose}
					config={config}
					updateCSSPrefs={updateCSSPrefs}
				/>
				<LocalLabel providedValue={localization && localization.footer ? localization.footer.closedMessage : ''} localizeKey='closedMessage' class={style.message + " primaryText"}>A reminder you can control your user privacy preferences</LocalLabel>
				<a class={style.openConsent} onClick={this.handleShowConsent}>
					<LocalLabel providedValue={localization && localization.footer ? localization.footer.closedMessageLink : ''} localizeKey='closedMessageLink'>here</LocalLabel>
				</a>
			</div>
		);
	}
}
