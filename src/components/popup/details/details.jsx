import { h, Component } from 'preact';
import style from './details.less';
import Button from '../../button/button';
import Purposes from './purposes/purposes';
import Vendors from './vendors/vendors';
import Panel from '../../panel/panel';
import Label from "../../label/label";

const SECTION_PURPOSES = 0;
const SECTION_VENDORS = 1;

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'details'
	};
}

export default class Details extends Component {
	state = {
		selectedPanelIndex: SECTION_PURPOSES,
		showEnableAll: true
	};

	handleShowVendors = () => {
		this.setState({
			selectedPanelIndex: SECTION_VENDORS
		});
	};

	handleShowPurposes = () => {
		this.setState({
			selectedPanelIndex: SECTION_PURPOSES
		});
	};

	handleEnableAll = () => {
		const shouldSelectAll = this.state.showEnableAll;
		const {
			selectAllVendors,
			selectAllPurposes
		} = this.props.store;

		selectAllVendors(shouldSelectAll);
		selectAllPurposes(shouldSelectAll);
		this.setState({showEnableAll: !this.state.showEnableAll});
	};

	handleBack = () => {
		const { onCancel } = this.props;
		const { selectedPanelIndex } = this.state;
		this.setState({
			selectedPanelIndex: Math.max(0, selectedPanelIndex - 1)
		});
		if (selectedPanelIndex === SECTION_PURPOSES) {
			onCancel();
		}
	};

	componentDidMount() {
		this.props.updateCSSPrefs();
	};

	render(props, state) {
		const {
			onCancel,
			onSave,
			onClose,
			store,
			localization,
			config,
			updateCSSPrefs
		} = props;

		const {
			selectedPanelIndex,
			showEnableAll
		} = state;

		const {
			vendorList = {},
			customPurposeList = {},
			vendorConsentData,
			publisherConsentData,
			selectPurpose,
			selectCustomPurpose,
			selectAllVendors,
			selectVendor
		} = store;
		const { selectedPurposeIds, selectedVendorIds } = vendorConsentData;
		const { selectedCustomPurposeIds } = publisherConsentData;
		const { purposes = [], vendors = [], features = [] } = vendorList;
		const { purposes: customPurposes = [] } = customPurposeList;


		return (
			<div class={style.details}>
				<div class={style.header}>
					<LocalLabel class={style.title + " primaryText"} providedValue={localization && localization.details ? localization.details.title : ''} localizeKey='title'>Privacy Preferences</LocalLabel>
				</div>
				<div class={style.body}>
					<Panel selectedIndex={selectedPanelIndex}>
						<Purposes
							localization={localization}
							purposes={purposes}
							features={features}
							vendors={vendors}
							customPurposes={customPurposes}
							selectedPurposeIds={selectedPurposeIds}
							selectedCustomPurposeIds={selectedCustomPurposeIds}
							selectPurpose={selectPurpose}
							selectCustomPurpose={selectCustomPurpose}
							onShowVendors={this.handleShowVendors}
							config={config}
							updateCSSPrefs={updateCSSPrefs}
						/>
						<Vendors
							localization={localization}
							selectedVendorIds={selectedVendorIds}
							selectAllVendors={selectAllVendors}
							selectVendor={selectVendor}
							vendors={vendors}
							onShowPurposes={this.handleShowPurposes}
							onHandleEnableAll={this.handleEnableAll}
							config={config}
							updateCSSPrefs={updateCSSPrefs}
						/>
					</Panel>
				</div>
				<div class={style.footer}>
					<div class={style.leftFooter}>
					{(selectedPanelIndex === SECTION_PURPOSES) &&
						<a class={style.vendorLink} onClick={this.handleShowVendors}>
							<LocalLabel providedValue={localization && localization.details ? localization.details.showVendors : ''} localizeKey='showVendors'>Show all companies</LocalLabel>
						</a>
					}
					</div>
					<div class={style.rightFooter}>
						<a class={style.cancel} onClick={this.handleBack}>
							<LocalLabel providedValue={localization && localization.details ? localization.details.back : ''} localizeKey='back'>Back</LocalLabel>
						</a>
						<Button class={style.save} onClick={onSave}>
							<LocalLabel providedValue={localization && localization.details ? localization.details.save : ''} localizeKey='save'>OK, Continue to site</LocalLabel>
						</Button>
					</div>
				</div>
			</div>
		);
	}
}
