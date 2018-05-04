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
		selectedPanelIndex: SECTION_PURPOSES
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
		const { onSave } = this.props;
		const { selectAllVendors } = this.props.store;

		selectAllVendors(true);
		onSave();
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

	render(props, state) {
		const {
			onCancel,
			onSave,
			onClose,
			store
		} = props;
		const { selectedPanelIndex } = state;

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
					<LocalLabel class={style.title} localizeKey='title'>Privacy Preferences</LocalLabel>
					<Button class={style.save} onClick={this.handleEnableAll}><LocalLabel localizeKey='enableAll'>Enable all</LocalLabel></Button>
				</div>
				<div class={style.body}>
					<Panel selectedIndex={selectedPanelIndex}>
						<Purposes
							purposes={purposes}
							features={features}
							vendors={vendors}
							customPurposes={customPurposes}
							selectedPurposeIds={selectedPurposeIds}
							selectedCustomPurposeIds={selectedCustomPurposeIds}
							selectPurpose={selectPurpose}
							selectCustomPurpose={selectCustomPurpose}
							onShowVendors={this.handleShowVendors}
						/>
						<Vendors
							selectedVendorIds={selectedVendorIds}
							selectAllVendors={selectAllVendors}
							selectVendor={selectVendor}
							vendors={vendors}
							onShowPurposes={this.handleShowPurposes}
						/>
					</Panel>
				</div>
				<div class={style.footer}>
					<div class={style.leftFooter}>
						<a class={style.vendorLink} onClick={this.handleShowVendors}><LocalLabel localizeKey='showVendors'>Show all companies</LocalLabel></a>
					</div>
					<div class={style.rightFooter}>
						<a class={style.cancel} onClick={this.handleBack}><LocalLabel localizeKey='back'>Back</LocalLabel></a>
						<Button class={style.save} onClick={onSave}><LocalLabel localizeKey='save'>OK, Continue to site</LocalLabel></Button>
					</div>
				</div>
			</div>
		);
	}
}
