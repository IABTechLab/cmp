import { h, Component } from 'preact';
import style from './popup.less';
import Intro from './intro/intro';
import Details from './details/details';
import Panel from '../panel/panel';


const SECTION_INTRO = 0;
const SECTION_DETAILS = 1;

export default class Popup extends Component {
	state = {
		selectedPanelIndex: SECTION_INTRO
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
			selectedPanelIndex: SECTION_INTRO
		});
	};

	handleShowDetails = () => {
		this.setState({
			selectedPanelIndex: SECTION_DETAILS
		});
	};

	handleClose = () => {};

	componentDidMount() {
		this.props.updateCSSPrefs();
	}

	render(props, state) {
		const { store, localization, config, updateCSSPrefs } = props;
		const { selectedPanelIndex } = state;
		const { isConsentToolShowing } = store;

		return (
			<div
				class={style.popup}
				style={{ display: isConsentToolShowing ? 'flex' : 'none' }}
			>
				<div
					class={style.overlay}
					onClick={this.handleClose}
				/>
				<div name='content' class={style.content}>
					<Panel selectedIndex={selectedPanelIndex}>
						<Intro
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
