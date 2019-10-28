import { h, Component } from 'preact';
import style from './purposes.less';
import Switch from '../../../switch/switch';
import Label from '../../../label/label';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Item extends Component {
	render(props) {
		const {
			purposes,
			features,
			selectedPurposeIds,
			selectedCustomPurposeIds,
			localization,
            index,
            allPurposes,
            showLocalVendors,
            localVendors,
            onHideLocalVendors,
            onShowLocalVendors,
            handleSelectPurpose
		} = props;

		const selectedPurpose = allPurposes[index];
		const selectedPurposeId = selectedPurpose && selectedPurpose.id;
		const currentPurposeLocalizePrefix = `${index >= purposes.length ? 'customPurpose' : 'purpose'}${selectedPurposeId}`;
		let purposeIsActive = index < purposes.length ?
			selectedPurposeIds.has(selectedPurposeId) :
            selectedCustomPurposeIds.has(selectedPurposeId);

		return (
            <div class={style.purposeDescription}>
                <div class={style.purposeDetail + " primaryText"}>
                    <div class={style.detailHeader}>
                        <div class={style.title}>
                            <LocalLabel localizeKey={`${currentPurposeLocalizePrefix[index]}.title`}>{selectedPurpose.name}</LocalLabel>
                        </div>
                    </div>

                    <div class={style.body}>
                        <p><LocalLabel providedValue={selectedPurpose.description} localizeKey={`${currentPurposeLocalizePrefix[index]}.description`} /></p>
                        <p><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.featureHeader : ''} localizeKey='featureHeader'>This will include the following features:</LocalLabel></p>
                        <ul>
                        {features.map((feature, index) => (
                            <li><LocalLabel class='featureItem' providedValue={feature.description} /></li>
                        ))}
                        </ul>
                        <div class={style.switchWrap}>
                            <div class={style.active}>
                                <Switch
                                    isSelected={purposeIsActive}
                                    onClick={handleSelectPurpose}
                                    dataId={index}
                                />
                                {purposeIsActive &&
                                    <LocalLabel providedValue={localization && localization.purposes ? localization.purposes.active : ''} localizeKey='active'>Active</LocalLabel>
                                }
                                {!purposeIsActive &&
                                    <LocalLabel providedValue={localization && localization.purposes ? localization.purposes.inactive : ''} localizeKey='inactive'>Inactive</LocalLabel>
                                }
                            </div>
                            <span class={style.switchText}>
                                <LocalLabel providedValue={localization && localization.purposes ? localization.purposes.switchText : ''} localizeKey="switchText">Publisher and their partners could collect anonymized information in order to improve your experience on our site.</LocalLabel>
                            </span>
                        </div>
                        {!showLocalVendors &&
                        <a class={style.vendorLink} onClick={() => onShowLocalVendors(index)}>
                            <LocalLabel providedValue={localization && localization.purposes ? localization.purposes.showVendors : ''} localizeKey='showVendors'>Show companies</LocalLabel>
                        </a>
                        }
                        {showLocalVendors &&
                        <a class={style.vendorLink} onClick={() => onHideLocalVendors(index)}>
                            <LocalLabel providedValue={localization && localization.purposes ? localization.purposes.hideVendors : ''} localizeKey='hideVendors'>Hide companies</LocalLabel>
                        </a>
                        }
                        {showLocalVendors &&
                            (<div>
                                <div class={style.vendorHeader}>
                                    <table class={style.vendorList}>
                                        <thead>
                                        <tr>
                                            <th><LocalLabel providedValue={localization && localization.purposes ? localization.purposes.company : ''} localizeKey='company'>Company</LocalLabel></th>
                                        </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div class={style.vendorContent}>
                                    <table class={style.vendorList}>
                                        <tbody>
                                        {localVendors.map(({name, policyUrl}, index) => (
                                            <tr key={index + name} class={index % 2 === 1 ? style.even : ''}>
                                                <td><a href={policyUrl} target='_blank'><div class={style.vendorName}>{name}</div></a></td>
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
		);
	}
}
