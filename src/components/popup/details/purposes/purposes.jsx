import { h, Component } from 'preact';
import style from './purposes.less';
import Label from '../../../label/label';
import Purpose from './purpose/purpose';

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
			selectedPurposeIdList
		} = state;
		let {
			localVendors
		} = state;

		const allPurposes = [...purposes, ...customPurposes];
		const selectedPurpose = allPurposes[selectedPurposeIndex];
		const selectedPurposeId = selectedPurpose && selectedPurpose.id;
		const currentPurposeLocalizePrefix = `${selectedPurposeIndex >= purposes.length ? 'customPurpose' : 'purpose'}${selectedPurposeId}`;
		let purposeIsActive = selectedPurposeIndex < purposes.length ?
			selectedPurposeIds.has(selectedPurposeId) :
			selectedCustomPurposeIds.has(selectedPurposeId);

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
						{allPurposes.map((purpose, index) => (
							<div class={[style.purposeItem, selectedPurposeIndex === index ? style.selectedPurpose : ''].join(' ')}
								onClick={this.handleSelectPurposeDetail(index)}
							>
								<input type="radio" id={`collapsible${index}`} name="purposeSelection"/>
								<label class={style.labelWrapper} for={`collapsible${index}`}>
									<LocalLabel localizeKey={`${index >= purposes.length ? 'customPurpose' : 'purpose'}${purpose.id}.menu`}>{purpose.name}</LocalLabel>
								</label>
							
								<div class={style.collapsibleContent}>
									<div class={style.contentInner}>

										<Purpose 
											currentPurposeLocalizePrefix={currentPurposeLocalizePrefix}
											selectedPurpose={selectedPurpose}
											features={features}
											localization={localization}
            								purposeIsActive={purposeIsActive}
											handleSelectPurpose={this.handleSelectPurpose}
											onShowLocalVendors={this.onShowLocalVendors}
											showLocalVendors={showLocalVendors}
             							/>
		
									</div>
								</div>
							</div>
						))}
					</div>
					
					{selectedPurpose && 
						<div class={style.purposeWrapper}>
							<Purpose 
								currentPurposeLocalizePrefix={currentPurposeLocalizePrefix}
								selectedPurpose={selectedPurpose}
								features={features}
								localization={localization}
								purposeIsActive={purposeIsActive}
								handleSelectPurpose={this.handleSelectPurpose}
								onShowLocalVendors={this.onShowLocalVendors}
								showLocalVendors={showLocalVendors}
							/>
						</div>
					}
				</div>
			</div>
		);
	}
}
