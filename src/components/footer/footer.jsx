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

	render(props) {
		const { store, localization } = props;
		const { isFooterShowing } = store;

		return (
			<div
				class={style.footer}
				style={{ display: isFooterShowing ? 'flex' : 'none' }}
				>
				<CloseButton
					hasBorder={false}
					class={style.close}
					onClick={this.handleClose}
				/>
				<LocalLabel providedValue={localization && localization.footer ? localization.footer.message : ''} localizeKey='message' class={style.message}>A reminder you can control your user privacy preferences</LocalLabel>
				<a class={style.openConsent} onClick={this.handleShowConsent}>
					<LocalLabel providedValue={localization && localization.footer ? localization.footer.consentLink : ''} localizeKey='consentLink'>here</LocalLabel>
				</a>
			</div>
		);
	}
}
