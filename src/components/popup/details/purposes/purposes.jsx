import { h, Component } from "preact";

import style from "./purposes.less";
import { PurposeList } from "./list";
import { Disclaimer } from "./disclaimer";

export class Purposes extends Component {
	state = {
		selectedPurposeIndices: {0: 0},
		selectedLocalVendors: {},
		showSelectedLocalVendors: {0: false}
	};

	static defaultProps = {
		onShowVendors: () => {},
		purposes: [],
		customPurposes: [],
		selectedPurposeIds: new Set(),
		selectedCustomPurposeIds: new Set()
	};

	handleSelectPurposeDetail = index => {
		let selectedPurposeIndices = {...this.state.selectedPurposeIndices};
		let selectedLocalVendors = {...this.state.selectedLocalVendors};
		let showSelectedLocalVendors = {...this.state.showSelectedLocalVendors};

		if (selectedPurposeIndices.hasOwnProperty(index)) {
			delete selectedPurposeIndices[index];
			delete selectedLocalVendors[index];
		} else {
			selectedPurposeIndices[index] = index;
		}

		showSelectedLocalVendors[index] = false;

		return () => {
			this.setState({
				selectedPurposeIndices,
				selectedLocalVendors,
				showSelectedLocalVendors
			});
		};
	};

	handleSelectPurpose = ({isSelected, currentPurposeIndex}) => {
		const {
			purposes,
			customPurposes,
			selectPurpose,
			selectCustomPurpose
		} = this.props;
		const allPurposes = [...purposes, ...customPurposes];
		const id = allPurposes[currentPurposeIndex].id;
		
		if (currentPurposeIndex < purposes.length) {
			selectPurpose(id, isSelected);
		} else {
			selectCustomPurpose(id, isSelected);
		}
	};

	onShowLocalVendors = (currentSelectedPurposeIndex) => {
		let selectedLocalVendors = {...this.state.selectedLocalVendors};
		let showSelectedLocalVendors = {...this.state.showSelectedLocalVendors};
		const { vendors } = this.props;
		const localVendors = vendors
			.map(vendor => {
				let purposeId = currentSelectedPurposeIndex + 1;
				if (
					vendor.purposeIds.indexOf(purposeId) !== -1 ||
					vendor.legIntPurposeIds.indexOf(purposeId) !== -1
				)
					return vendor;
			})
			.filter(vendor => vendor);
		
		selectedLocalVendors[currentSelectedPurposeIndex] = localVendors;
		showSelectedLocalVendors[currentSelectedPurposeIndex] = true;
		this.setState({
			selectedLocalVendors,
			showSelectedLocalVendors
		});
	};

	onHideLocalVendors = (currentSelectedPurposeIndex) => {
		let showSelectedLocalVendors = {...this.state.showSelectedLocalVendors};
		let selectedLocalVendors = {...this.state.selectedLocalVendors};

		showSelectedLocalVendors[currentSelectedPurposeIndex] = false;
		delete selectedLocalVendors[currentSelectedPurposeIndex];
		
		this.setState({
			showSelectedLocalVendors,
			selectedLocalVendors
		});
	};

	onToggleLocalVendors = (currentSelectedPurposeIndex) => {
		let showSelectedLocalVendors = {...this.state.showSelectedLocalVendors};

		if (showSelectedLocalVendors[currentSelectedPurposeIndex]) {
			this.onHideLocalVendors(currentSelectedPurposeIndex);
		} else {
			this.onShowLocalVendors(currentSelectedPurposeIndex);
		}
	};

	render(props, state) {
		const {
			onShowVendors,
			purposes,
			features,
			customPurposes,
			selectedPurposeIds,
			selectedCustomPurposeIds,
			localization,
			config
		} = props;

		let { selectedPurposeIndex, showLocalVendors, selectedPurposeIndices, selectedLocalVendors, showSelectedLocalVendors } = state;

		const allPurposes = [...purposes, ...customPurposes];

		let purposesAreActive = 
			allPurposes.map(({ id }, index)=> {
				if (index < purposes.length) return selectedPurposeIds.has(id)
				else return selectedCustomPurposeIds.has(id)
			});

		return (
			<div class={style.container}>
				<Disclaimer onShowVendors={onShowVendors} />
				<div class={style.purposes}>
					<PurposeList
						allPurposes={allPurposes}
						purposes={purposes}
						selectedPurposeIndex={selectedPurposeIndex}
						selectedPurposeIndices={selectedPurposeIndices}
						selectedLocalVendors={selectedLocalVendors}
						showSelectedLocalVendors={showSelectedLocalVendors}
						onPurposeClick={this.handleSelectPurposeDetail}
						onToggleLocalVendors={this.onToggleLocalVendors}
						handleSelectPurpose={this.handleSelectPurpose}
						localization={localization}
						features={features}
						showLocalVendors={showLocalVendors}
						purposesAreActive={purposesAreActive}
						purposes={purposes}
					/>
				</div>
			</div>
		);
	}
}
