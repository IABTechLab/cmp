import { h, Component } from "preact";

import { Panel } from "../../panel";
import { Header } from "../header";
import { PopupContent } from "../popupcontent";
import { Purposes } from "./purposes";
import { Vendors } from "./vendors";
import { Footer } from "./footer";
import style from "./details.less";

const SECTION_PURPOSES = 0;
const SECTION_VENDORS = 1;

export class Details extends Component {
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

	handleSelectVendor = ({ dataId, isSelected }) => {
		this.props.store.selectVendor(dataId, isSelected);
	};

	handleSelectAllVendors = () => {
		const shouldSelectAll = this.state.showEnableAll;
		const { selectAllVendors, selectAllPurposes } = this.props.store;

		selectAllVendors(shouldSelectAll);
		selectAllPurposes(shouldSelectAll);
		this.setState({ showEnableAll: !this.state.showEnableAll });
	};

	handleVendorDetails = () => {
		this.forceUpdate();
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
		if (this.props.directVendors) {
			this.handleShowVendors();
		}
	}

	render(props, state) {
		const { onSave, store, localization, config } = props;
		const { selectedPanelIndex } = state;
		const {
			vendorList = {},
			customPurposeList = {},
			vendorConsentData,
			publisherConsentData,
			selectPurpose,
			selectCustomPurpose
		} = store;
		const { selectedPurposeIds, selectedVendorIds } = vendorConsentData;
		const { selectedCustomPurposeIds } = publisherConsentData;
		const { purposes = [], vendors = [], features = [] } = vendorList;
		const { purposes: customPurposes = [] } = customPurposeList;

		return (
			<PopupContent layout="modal">
				<div class={style.details}>
					<Header titleKey="details.title" />
					<Panel className={style.body} selectedIndex={selectedPanelIndex}>
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
						/>
						<Vendors
							onSelectVendor={this.handleSelectVendor}
							onSelectAllVendors={this.handleSelectAllVendors}
							onShowPurposes={this.handleShowPurposes}
							selectedVendorIds={selectedVendorIds}
							vendors={vendors}
							purposes={purposes}
							features={features}
							showVendorDetails={this.handleVendorDetails}
						/>
					</Panel>
					<Footer
						showVendorsLink={selectedPanelIndex === SECTION_PURPOSES}
						onSaveClick={onSave}
						onShowVendorsClick={this.handleShowVendors}
						onBackClick={this.handleBack}
					/>
				</div>
			</PopupContent>
		);
	}
}
