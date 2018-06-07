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
			}, this.props.updateCSSPrefs);
			this.scrollRef.scrollTop = 0;
		};
	};

	handleSelectPurpose = ({isSelected}) => {
		const {selectedPurposeIndex} = this.state;
		const {
			purposes,
			customPurposes,
			selectPurpose,
			selectCustomPurpose,
			updateCSSPrefs
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
		const { vendors, updateCSSPrefs } = this.props;
		const localVendors = vendors.map((vendor) => {
			let purposeId = selectedPurposeIndex + 1;
			if (	vendor.purposeIds.indexOf(purposeId) !== -1 ||
						vendor.legIntPurposeIds.indexOf(purposeId) !== -1 ) return vendor;
		}).filter((vendor) => vendor);
		this.setState({
			showLocalVendors: true,
			localVendors: localVendors
		}, updateCSSPrefs);
	};

	onHideLocalVendors = () => {
		this.setState({
			showLocalVendors: false,
			localVendors: []
		});
	};

	componentDidUpdate() {
		this.props.updateCSSPrefs();
	}

	componentDidMount() {
		this.props.updateCSSPrefs();
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
			config,
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
			<div cmp={true} class={style.container} >
				<div cmp={true} class={style.disclaimer + " primaryText"}>
					<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.disclaimer : ''} localizeKey='disclaimer'>We and selected companies may access and use information for the purposes outlined. You may customise your choice or continue using our site if you are OK with the purposes. You can see the </LocalLabel>
					<a cmp={true} class={style.vendorLink} onClick={onShowVendors}>
						<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.disclaimerVendorLink : ''} localizeKey='disclaimerVendorLink'>complete list of companies here.</LocalLabel>
					</a>
				</div>
				<div cmp={true} class={style.purposes}>
					<div cmp={true} class={style.purposeList}>
						{allPurposes.map((purpose, index) => (
							<div cmp={true} class={[style.purposeItem, selectedPurposeIndex === index ? style.selectedPurpose : ''].join(' ')}
								 onClick={this.handleSelectPurposeDetail(index)}
							>
								<LocalLabel localizeKey={`${index >= purposes.length ? 'customPurpose' : 'purpose'}${purpose.id}.menu`}>{purpose.name}</LocalLabel>
							</div>
						))}
					</div>
					{selectedPurpose &&
					<div cmp={true} class={style.purposeDescription} ref={scrollRef => this.scrollRef = scrollRef}>
						<div cmp={true} class={style.purposeDetail + " primaryText"}>
							<div cmp={true} class={style.detailHeader}>
								<div cmp={true} class={style.title}>
									<LocalLabel localizeKey={`${currentPurposeLocalizePrefix}.title`}>{selectedPurpose.name}</LocalLabel>
								</div>
							</div>

							<div cmp={true} class={style.body}>
								<p cmp={true}><LocalLabel providedValue={selectedPurpose.description} localizeKey={`${currentPurposeLocalizePrefix}.description`} /></p>
								<p cmp={true}><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.featureHeader : ''} localizeKey='featureHeader'>This will include the following features:</LocalLabel></p>
								<ul cmp={true}>
								{features.map((feature, index) => (
									<li cmp={true}><LocalLabel class='featureItem' providedValue={feature.description} /></li>
								))}
								</ul>
								<div cmp={true} class={style.switchWrap}>
									<div cmp={true} class={style.active}>
										<Switch
											isSelected={purposeIsActive}
											onClick={this.handleSelectPurpose}
										/>
										{purposeIsActive &&
											<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.active : ''} localizeKey='active'>Active</LocalLabel>
										}
										{!purposeIsActive &&
											<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.inactive : ''} localizeKey='inactive'>Inactive</LocalLabel>
										}
									</div>
									<span cmp={true} class={style.switchText}>
										<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.switchText : ''} localizeKey="switchText">Publisher and their partners could collect anonymized information in order to improve your experience on our site.</LocalLabel>
									</span>
								</div>
								{!showLocalVendors &&
								<a cmp={true} class={style.vendorLink} onClick={this.onShowLocalVendors}>
									<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.showVendors : ''} localizeKey='showVendors'>Show companies</LocalLabel>
								</a>
								}
								{showLocalVendors &&
								<a cmp={true} class={style.vendorLink} onClick={this.onHideLocalVendors}>
									<LocalLabel providedValue={localization && localization.purposes ? localization.purposes.hideVendors : ''} localizeKey='hideVendors'>Hide companies</LocalLabel>
								</a>
								}
								{showLocalVendors &&
									(<div cmp={true}>
										<div cmp={true} class={style.vendorHeader}>
											<table cmp={true} class={style.vendorList}>
												<thead cmp={true}>
												<tr cmp={true}>
													<th cmp={true}><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.company : ''} localizeKey='company'>Company</LocalLabel></th>
												</tr>
												</thead>
											</table>
										</div>
										<div cmp={true} class={style.vendorContent}>
											<table cmp={true} class={style.vendorList}>
												<tbody cmp={true}>
												{localVendors.map(({name, policyUrl}, index) => (
													<tr cmp={true} key={index + name} class={index % 2 === 1 ? style.even : ''}>
														<td cmp={true}><a cmp={true} href={policyUrl} target='_blank'><div class={style.vendorName}>{name}</div></a></td>
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
