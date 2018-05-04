import { h, Component } from 'preact';
import style from './purposes.less';
import Switch from '../../../switch/switch';
import Label from "../../../label/label";

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Purposes extends Component {
	state = {
		selectedPurposeIndex: 0,
		showLocalVendors: false,
		localVendors: []
	};

	static defaultProps = {
		onShowVendors: () => {},
		purposes: [],
		customPurposes: [],
		selectedPurposeIds: new Set(),
		selectedCustomPurposeIds: new Set()
	};


	handleSelectPurposeDetail = index => {
		return () => {
			this.setState({
				selectedPurposeIndex: index,
				showLocalVendors: false,
				localVendors: []
			});
		};
	};

	handleSelectPurpose = ({isSelected}) => {
		const {selectedPurposeIndex} = this.state;
		const {
			purposes,
			customPurposes,
			selectPurpose,
			selectCustomPurpose
		} = this.props;
		const allPurposes = [...purposes, ...customPurposes];
		const id = allPurposes[selectedPurposeIndex].id;

		if (selectedPurposeIndex < purposes.length) {
			selectPurpose(id, isSelected);
		}
		else {
			selectCustomPurpose(id, isSelected);
		}
	};

	onShowLocalVendors = () => {
		const { selectedPurposeIndex } = this.state;
		const { vendors } = this.props;
		const localVendors = vendors.map((vendor) => {
			let purposeId = selectedPurposeIndex + 1;
			if (	vendor.purposeIds.indexOf(purposeId) !== -1 ||
						vendor.legIntPurposeIds.indexOf(purposeId) !== -1 ) return vendor;
		}).filter((vendor) => vendor);
		this.setState({
			showLocalVendors: true,
			localVendors: localVendors
		});
	};

	onHideLocalVendors = () => {
		this.setState({
			showLocalVendors: false,
			localVendors: []
		});
	};

	render(props, state) {
		const {
			onShowVendors,
			purposes,
			features,
			customPurposes,
			selectedPurposeIds,
			selectedCustomPurposeIds
		} = props;

		const {
			selectedPurposeIndex,
			showLocalVendors,
		} = state;
		let {
			localVendors
		} = state;

		const allPurposes = [...purposes, ...customPurposes];
		const selectedPurpose = allPurposes[selectedPurposeIndex];
		const selectedPurposeId = selectedPurpose && selectedPurpose.id;
		const purposeIsActive = selectedPurposeIndex < purposes.length ?
			selectedPurposeIds.has(selectedPurposeId) :
			selectedCustomPurposeIds.has(selectedPurposeId);
		const currentPurposeLocalizePrefix = `${selectedPurposeIndex >= purposes.length ? 'customPurpose' : 'purpose'}${selectedPurposeId}`;

		return (
			<div class={style.container} >
				<div class={style.disclaimer}>
					<LocalLabel localizeKey='disclaimer'>We and selected companies may access and use information for the purposes outlined. You may customise your choice or continue using our site if you are OK with the purposes. You can see the </LocalLabel>
					<a class={style.vendorLink} onClick={onShowVendors}><LocalLabel localizeKey='disclaimerVendorLink'>complete list of companies here.</LocalLabel></a>
				</div>
				<div class={style.purposes}>
					<div class={style.purposeList}>
						{allPurposes.map((purpose, index) => (
							<div class={[style.purposeItem, selectedPurposeIndex === index ? style.selectedPurpose : ''].join(' ')}
								 onClick={this.handleSelectPurposeDetail(index)}
							>
								<LocalLabel localizeKey={`${index >= purposes.length ? 'customPurpose' : 'purpose'}${purpose.id}.menu`}>{purpose.name}</LocalLabel>
							</div>
						))}
					</div>
					{selectedPurpose &&
					<div class={style.purposeDescription}>
						<div class={style.purposeDetail}>
							<div class={style.detailHeader}>
								<div class={style.title}>
									<LocalLabel localizeKey={`${currentPurposeLocalizePrefix}.title`}>{selectedPurpose.name}</LocalLabel>
								</div>
								<div class={style.active}>
									<LocalLabel localizeKey='active'>Active</LocalLabel>
									<Switch
										isSelected={purposeIsActive}
										onClick={this.handleSelectPurpose}
									/>
								</div>
							</div>
							<div class={style.body}>
								<p><LocalLabel textValue={selectedPurpose.description} localizeKey={`${currentPurposeLocalizePrefix}.description`} /></p>
								<p><LocalLabel localizeKey='featureHeader'>This will include the following features:</LocalLabel></p>
								<ul>
								{features.map((feature, index) => (
									<li><LocalLabel class='featureItem' textValue={feature.description} /></li>
								))}
								</ul>
								{!showLocalVendors &&
								<a class={style.vendorLink} onClick={this.onShowLocalVendors}><LocalLabel localizeKey='showVendors'>Show companies</LocalLabel></a>
								}
								{showLocalVendors &&
								<a class={style.vendorLink} onClick={this.onHideLocalVendors}><LocalLabel localizeKey='hideVendors'>Hide companies</LocalLabel></a>
								}
								{showLocalVendors &&
									(<div>
										<div class={style.vendorHeader}>
											<table class={style.vendorList}>
												<thead>
												<tr>
													<th><LocalLabel localizeKey='company'>Company</LocalLabel></th>
												</tr>
												</thead>
											</table>
										</div>
										<div class={style.vendorContent}>
											<table class={style.vendorList}>
												<tbody>
												{localVendors.map((vendor, index) => (
													<tr key={index + vendor.name} class={index % 2 === 1 ? style.even : ''}>
														<td><div class={style.vendorName}>{vendor.name}</div></td>
													</tr>
												))}
												</tbody>
											</table>
										</div>
									</div>)
								}
							</div>
						</div>
					</div>
					}
				</div>
			</div>
		);
	}
}
