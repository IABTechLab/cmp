import { h, Component } from 'preact';

import style from './purposes.less';
import Switch from '../../../switch/switch';
import Label from '../../../label/label';

export default () => {
  return (
    <div class={style.purposeDescription} ref={scrollRef => this.scrollRef = scrollRef}>
      <div class={style.purposeDetail + ' primaryText'}>
        <div class={style.detailHeader}>
          <div class={style.title}>
            <Label localizeKey={`${currentPurposeLocalizePrefix}.title`}>
              {selectedPurpose.name}
            </Label>
          </div>
        </div>

        <div class={style.body}>
          <p>
            <Label providedValue={selectedPurpose.description} localizeKey={`${currentPurposeLocalizePrefix}.description`} />
          </p>
          <p>
            <Label providedValue={localization && localization.purposes ? localization.purposes.featureHeader : ''} localizeKey="featureHeader">
              This will include the following features:
            </Label>
          </p>
          <ul>
            {features.map((feature, index) => <li>
                <Label class="featureItem" providedValue={feature.description} />
              </li>)}
          </ul>
          <div class={style.switchWrap}>
            <div class={style.active}>
              <Switch isSelected={purposeIsActive} onClick={this.handleSelectPurpose} />
              {purposeIsActive && <Label providedValue={localization && localization.purposes ? localization.purposes.active : ''} localizeKey="active">
                  Active
                </Label>}
              {!purposeIsActive && <Label providedValue={localization && localization.purposes ? localization.purposes.inactive : ''} localizeKey="inactive">
                  Inactive
                </Label>}
            </div>
            <span class={style.switchText}>
              <Label providedValue={localization && localization.purposes ? localization.purposes.switchText : ''} localizeKey="switchText">
                Publisher and their partners could collect anonymized
                information in order to improve your experience on our
                site.
              </Label>
            </span>
          </div>
          {!showLocalVendors && <a class={style.vendorLink} onClick={this.onShowLocalVendors}>
              <Label providedValue={localization && localization.purposes ? localization.purposes.showVendors : ''} localizeKey="showVendors">
                Show companies
              </Label>
            </a>}
          {showLocalVendors && <a class={style.vendorLink} onClick={this.onHideLocalVendors}>
              <Label providedValue={localization && localization.purposes ? localization.purposes.hideVendors : ''} localizeKey="hideVendors">
                Hide companies
              </Label>
            </a>}
          {showLocalVendors && <div>
              <div class={style.vendorHeader}>
                <table class={style.vendorList}>
                  <thead>
                    <tr>
                      <th>
                        <Label providedValue={localization && localization.purposes ? localization.purposes.company : ''} localizeKey="company">
                          Company
                        </Label>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class={style.vendorContent}>
                <table class={style.vendorList}>
                  <tbody>
                    {localVendors.map(({
        name,
        policyUrl
      }, index) => <tr key={index + name} class={index % 2 === 1 ? style.even : ''}>
                        <td>
                          <a href={policyUrl} target="_blank">
                            <div class={style.vendorName}>{name}</div>
                          </a>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>
      </div>
    </div>
  );
}

