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
			onShowPurposes
		} = props;

		return (
			<div class={style.vendors}>
				<div class={style.description}>
					<p>
						<LocalLabel localizeKey='description'>Companies carefully selected by us will use your information. Depending on the type of data they collect, use, process and other factors, certain companies rely on your consent while others require you to opt-out. For information on each partner and to exercise your choices, see below. Or to opt-out, visit the </LocalLabel>
						<a href='http://optout.networkadvertising.org/?c=1#!/' target='_blank'>NAI,</a><a href='http://optout.aboutads.info/?c=2#!/' target='_blank'> DAA, </a>
						<LocalLabel localizeKey='or'>or </LocalLabel>
						<a href='http://youronlinechoices.eu/' target='_blank'>EDAA </a>
						<LocalLabel localizeKey='sites'>sites.</LocalLabel>
					</p>
					<p>
						<LocalLabel localizeKey="description2">Customise how these companies use data on the </LocalLabel>
						<a style={style.vendorLink} onClick={onShowPurposes}><LocalLabel localizeKey="description2Link">previous page.</LocalLabel></a>
					</p>
				</div>
				<div class={style.vendorHeader}>
					<table class={style.vendorList}>
						<thead>
						<tr>
							<th><LocalLabel localizeKey='company'>Company</LocalLabel></th>
							<th><LocalLabel localizeKey='offOn'>Allow</LocalLabel></th>
						</tr>
						</thead>
					</table>
				</div>
				<div class={style.vendorContent}>
					<table class={style.vendorList}>
						<tbody>
						{vendors.map(({ id, name, policyUrl, purposeIds, legIntPurposeIds, featureIds }, index) => (
							<tr key={id} class={index % 2 === 1 ? style.even : ''}>
								<td><div class={style.vendorName}>{name}</div></td>
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
