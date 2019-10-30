import { h, createRef, Component } from 'preact';
import style from './purposes.less';
import Label from '../../../label/label';
import ItemLabel from './label';
import Item from './item';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Purposes extends Component {
	state = {
		selectedPurposeIndex: 0,
		vendorList: Array.from(
			{length: this.props.purposes.length + this.props.customPurposes.length}, 
			() => ({showLocalVendors: false, localVendors: []}))
	};

	static defaultProps = {
		onShowVendors: () => {},
		purposes: [],
		customPurposes: [],
		selectedPurposeIds: new Set(),
		selectedCustomPurposeIds: new Set()
	}

	handleSelectPurpose = ({ isSelected, dataId }) => {
		const {
            purposes,
			customPurposes,
			selectPurpose,
            selectCustomPurpose,
		} = this.props;
		const id = [...purposes, ...customPurposes][dataId].id;

		if (dataId < purposes.length) {
			selectPurpose(id, isSelected);
		} else {
			selectCustomPurpose(id, isSelected);
		}
	};

	handleSelectPurposeDetail = index => {
		return () => {
			this.setState({
				selectedPurposeIndex: index
			}, () => {
				this.onHideLocalVendors(index);
				this.props.updateCSSPrefs();
			});
		};
	}

	onShowLocalVendors = index => {
		const { vendors } = this.props;
		const localVendors = vendors
			.map(vendor => {
				let purposeId = index + 1;
				if (
					vendor.purposeIds.indexOf(purposeId) !== -1 ||
					vendor.legIntPurposeIds.indexOf(purposeId) !== -1
				)
					return vendor;
			})
			.filter(vendor => vendor);
		
		let vendorList = [...this.state.vendorList];
		vendorList[index].localVendors = localVendors;
		vendorList[index].showLocalVendors = true;

		this.setState({
			vendorList
		});
	};

	onHideLocalVendors = index => {
		let vendorList = [...this.state.vendorList];
		vendorList[index].localVendors = [];
		vendorList[index].showLocalVendors = false;

		this.setState({
			vendorList
		});
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
			selectPurpose,
			selectCustomPurpose,
			vendors,
			updateCSSPrefs
		} = props;

		const { selectedPurposeIndex, vendorList } = state;

		const allPurposes = [...purposes, ...customPurposes];
		const selectedPurpose = allPurposes[selectedPurposeIndex];
		
		return (
			<div class={style.container} >
				<div class={style.disclaimer + " primaryText"}>
					<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.disclaimer : ''} localizeKey='disclaimer'>We and selected companies may access and use information for the purposes outlined. You may customise your choice or continue using our site if you are OK with the purposes. You can see the </LocalLabel>
					<a class={style.vendorLink} onClick={onShowVendors}>
						<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.disclaimerVendorLink : ''} localizeKey='disclaimerVendorLink'>complete list of companies here.</LocalLabel>
					</a>
				</div>
				<div class={style.purposes}>
					<div class={style.purposeList}>
						{allPurposes.map((purpose, index) => {
							return (
								<ItemLabel
									purposes={purposes}
									purpose={purpose}
									index={index}
									updateCSSPrefs={updateCSSPrefs}
									selectedPurposeIndex={selectedPurposeIndex}
									handleSelectPurposeDetail={this.handleSelectPurposeDetail}
								>  
									<Item
										purposes={purposes}
										features={features}
										selectedPurposeIds={selectedPurposeIds}
										selectedCustomPurposeIds={selectedCustomPurposeIds}
										localization={localization}
										index={index}
										allPurposes={allPurposes}
										selectPurpose={selectPurpose}
										selectCustomPurpose={selectCustomPurpose}
										selectedPurposeIds={selectedPurposeIds}
										selectedCustomPurposeIds={selectedCustomPurposeIds}
										vendors={vendors}
										localVendors={vendorList[index].localVendors}
										showLocalVendors={vendorList[index].showLocalVendors}
										onShowLocalVendors={this.onShowLocalVendors}
										onHideLocalVendors={this.onHideLocalVendors}
										handleSelectPurpose={this.handleSelectPurpose}
									/>
								</ItemLabel>
							)
						})}
					</div>
					{selectedPurpose &&
						<div class={style.purposeWrapper}>
							<Item
								purposes={purposes}
								features={features}
								selectedPurposeIds={selectedPurposeIds}
								selectedCustomPurposeIds={selectedCustomPurposeIds}
								localization={localization}
								index={selectedPurposeIndex}
								allPurposes={allPurposes}
								selectPurpose={selectPurpose}
								selectCustomPurpose={selectCustomPurpose}
								selectedPurposeIds={selectedPurposeIds}
								selectedCustomPurposeIds={selectedCustomPurposeIds}
								vendors={vendors}
								localVendors={vendorList[selectedPurposeIndex].localVendors}
								showLocalVendors={vendorList[selectedPurposeIndex].showLocalVendors}
								onShowLocalVendors={this.onShowLocalVendors}
								onHideLocalVendors={this.onHideLocalVendors}
								handleSelectPurpose={this.handleSelectPurpose}
							/>
						</div>
					}
				</div>
			</div>
		);
	}
}
