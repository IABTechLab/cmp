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

	render(props, state) {

		const {
			vendors,
			selectedVendorIds,
			onShowPurposes,
			localization,
			onClick,
			onHandleEnableAll
		} = props;

		return (
			<div class={style.vendors}>
				<div class={style.description}>
					<p>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description : ''} localizeKey='description'>Companies carefully selected by us will use your information. Depending on the type of data they collect, use, process and other factors, certain companies rely on your consent while others require you to opt-out. For information on each partner and to exercise your choices, see below. Or to opt-out, visit the </LocalLabel>
						<a href='http://optout.networkadvertising.org/?c=1#!/' target='_blank'>NAI,</a><a href='http://optout.aboutads.info/?c=2#!/' target='_blank'> DAA, </a>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.or : ''} localizeKey='or'>or </LocalLabel>
						<a href='http://youronlinechoices.eu/' target='_blank'>EDAA </a>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.sites : ''} localizeKey='sites'>sites.</LocalLabel>
					</p>
					<p>
						<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description2 : ''} localizeKey="description2">Customise how these companies use data on the </LocalLabel>
						<a style={style.vendorLink} onClick={onShowPurposes}>
							<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description2Link : ''} localizeKey="description2Link">previous page.</LocalLabel>
						</a>
					</p>
					<p>
					<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description3 : ''} localizeKey="description3">You can control all componies preferences by </LocalLabel>
						<a style={style.vendorLink} onClick={onHandleEnableAll}>
							<LocalLabel providedValue={localization && localization.vendors ? localization.vendors.description3Link : ''} localizeKey="description3Link">pressing here.</LocalLabel>
						</a>
					</p>
				</div>
				<div class={style.vendorHeader}>
					<table class={style.vendorList}>
						<thead>
						<tr>
							<th><LocalLabel providedValue={localization && localization.vendors ? localization.vendors.company : ''} localizeKey='company'>Company</LocalLabel></th>
							<th><LocalLabel providedValue={localization && localization.vendors ? localization.vendors.offOn : ''} localizeKey='offOn'>Allow</LocalLabel></th>
						</tr>
						</thead>
					</table>
				</div>
				<div class={style.vendorContent}>
					<table class={style.vendorList}>
						<tbody>
						{vendors.map(({ id, name, policyUrl, purposeIds, legIntPurposeIds, featureIds }, index) => (
							<tr key={id} class={index % 2 === 1 ? style.even : ''}>
								<td><a href={policyUrl} target='_blank'><div class={style.vendorName}>{name}</div></a></td>
								<td>
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
