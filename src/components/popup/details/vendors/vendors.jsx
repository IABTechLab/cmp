import { h, Component } from 'preact';
import style from './vendors.less';
import Button from '../../../button/button';
import Switch from '../../../switch/switch';
import Label from "../../../label/label";

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'vendors'
	};
}

export default class Vendors extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	static defaultProps = {
		onShowPurposes: () => {},
		handleEnableAll: () =>{},
		vendors: [],
		selectedVendorIds: new Set(),
		selectVendor: () => {}
	};

	handleAcceptAll = () => {
		this.props.selectAllVendors(true);
	};

	handleRejectAll = () => {
		this.props.selectAllVendors(false);
	};

	handleSelectVendor = ({ dataId, isSelected }) => {
		this.props.selectVendor(dataId, isSelected);
	};

	componentDidUpdate() {
		this.props.updateCSSPrefs();
	}

	componentDidMount() {
		this.props.updateCSSPrefs();
	};

	render(props, state) {

		const {
			vendors,
			selectedVendorIds,
			onShowPurposes,
			onHandleEnableAll,
			localization,
			config
		} = props;

		return (
			<div cmp={true} class={style.vendors}>
				<div cmp={true} class={style.description + " primaryText"}>
					<p cmp={true}>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description : ''} localizeKey='description'>Companies carefully selected by us will use your information. Depending on the type of data they collect, use, process and other factors, certain companies rely on your consent while others require you to opt-out. For information on each partner and to exercise your choices, see below. Or to opt-out, visit the </LocalLabel>
						<a cmp={true} href='http://optout.networkadvertising.org/?c=1#!/' target='_blank'>NAI,</a><a href='http://optout.aboutads.info/?c=2#!/' target='_blank'> DAA, </a>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.or : ''} localizeKey='or'>or </LocalLabel>
						<a cmp={true} href='http://youronlinechoices.eu/' target='_blank'>EDAA</a>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.sites : ''} localizeKey='sites'> sites.</LocalLabel>
					</p>
					<p cmp={true}>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description2 : ''} localizeKey="description2">Customise how these companies use data on the </LocalLabel>
						<a cmp={true} style={style.vendorLink} onClick={onShowPurposes}>
							<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description2Link : ''} localizeKey="description2Link">previous page.</LocalLabel>
						</a>
					</p>
					<p cmp={true}>
					<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description3 : ''} localizeKey="description3">You can control your preferences for all companies by </LocalLabel>
						<a cmp={true} style={style.vendorLink} onClick={onHandleEnableAll}>
							<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description3Link : ''} localizeKey="description3Link">clicking here.</LocalLabel>
						</a>
					</p>
				</div>
				<div cmp={true} class={style.vendorHeader}>
					<table cmp={true} class={style.vendorList}>
						<thead cmp={true}>
						<tr cmp={true}>
							<th cmp={true} class="primaryText"><LocalLabel providedValue={localization && localization.vendors ? localization.vendors.company : ''} localizeKey='company'>Company</LocalLabel></th>
							<th cmp={true} class="primaryText"><LocalLabel providedValue={localization && localization.vendors ? localization.vendors.offOn : ''} localizeKey='offOn'>Allow</LocalLabel></th>
						</tr>
						</thead>
					</table>
				</div>
				<div cmp={true} class={style.vendorContent}>
					<table cmp={true} class={style.vendorList}>
						<tbody cmp={true}>
						{vendors.map(({ id, name, policyUrl, purposeIds, legIntPurposeIds, featureIds }, index) => (
							<tr cmp={true} key={id} class={index % 2 === 1 ? style.even : ''}>
								<td cmp={true}><a cmp={true} href={policyUrl} target='_blank'><div class={style.vendorName}>{name}</div></a></td>
								<td cmp={true}>
									<Switch
										dataId={id}
										isSelected={selectedVendorIds.has(id)}
										onClick={this.handleSelectVendor}
									/>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
