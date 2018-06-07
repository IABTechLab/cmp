import { h, Component } from 'preact';
import style from './popupFooter.less';
import IntroV2 from './intro/introV2';
import IntroFooterV2 from './intro/footerV2';
import Details from './details/details';
import Panel from '../panel/panel';


const SECTION_INTRO = 0;
const SECTION_DETAILS = 1;

export default class PopupFooter extends Component {
	state = {
		selectedPanelIndex: SECTION_INTRO,
		isActive: false
	};

	onAcceptAll = () => {
		const { store, onSave } = this.props;
		store.selectAllVendors(true);
		store.selectAllPurposes(true);
		store.selectAllCustomPurposes(true);
		onSave();
	};

	onCancel = () => {
		this.setState({
			selectedPanelIndex: SECTION_INTRO,
			isActive: false
		});
	};

	handleShowDetails = () => {
		this.setState({
			selectedPanelIndex: SECTION_DETAILS,
			isActive: true
		});
	};

	handleClose = () => {};

	componentDidMount() {
		this.props.updateCSSPrefs();
	}

	render(props, state) {
		const { store, localization, config, updateCSSPrefs } = props;
		const { selectedPanelIndex, isActive } = state;
		const { isFooterConsentToolShowing } = store;

		return (
			<div
				class={style.popup}
				style={{ display: isFooterConsentToolShowing ? 'flex' : 'none' }}
			>
				<div
					class={style.overlay}
					onClick={this.handleClose}
				/>
				<div name='content' class={this.state.isActive ? style.contentClicked : style.content}>
					<Panel selectedIndex={selectedPanelIndex}>
						<IntroV2
							onAcceptAll={this.onAcceptAll}
							onShowPurposes={this.handleShowDetails}
							onClose={this.handleClose}
							localization={localization}
							store={store}
							config={config}
							updateCSSPrefs={updateCSSPrefs}
						/>
						<Details
							onSave={this.props.onSave}
							onCancel={this.onCancel}
							store={this.props.store}
							onClose={this.handleClose}
							localization={localization}
							config={config}
							updateCSSPrefs={updateCSSPrefs}
						/>
					</Panel>
				</div>
			</div>
		);
	}
}
