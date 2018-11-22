import { Vendortable } from './../vendortable';
import { h, Component } from 'preact';

import style from './purposes.less';
import Switch from '../../../switch/switch';
import Label from '../../../label/label';

export const Detail = ({
  selectedPurpose,
  currentPurposeLocalizePrefix,
  localization,
  features,
  purposeIsActive,
  showLocalVendors,
  localVendors,
  setScrollRef,
  onHideLocalVendors,
  onShowLocalVendors,
  handleSelectPurpose
}) => {
  return (
    <div
      class={style.purposeDescription}
      ref={setScrollRef}
    >
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
            <Label
              providedValue={selectedPurpose.description}
              localizeKey={`${currentPurposeLocalizePrefix}.description`}
            />
          </p>
          <p>
            <Label
              providedValue={
                localization && localization.purposes
                  ? localization.purposes.featureHeader
                  : ''
              }
              localizeKey="featureHeader"
            />
          </p>
          <ul>
            {features.map((feature, index) => (
              <li>
                <Label
                  class="featureItem"
                  providedValue={feature.description}
                />
              </li>
            ))}
          </ul>
          <div class={style.switchWrap}>
            <div class={style.active}>
              <Switch
                isSelected={purposeIsActive}
                onClick={handleSelectPurpose}
              />
              {purposeIsActive && (
                <Label
                  providedValue={
                    localization && localization.purposes
                      ? localization.purposes.active
                      : ''
                  }
                  localizeKey="active"
                >
                  Active
                </Label>
              )}
              {!purposeIsActive && (
                <Label
                  providedValue={
                    localization && localization.purposes
                      ? localization.purposes.inactive
                      : ''
                  }
                  localizeKey="inactive"
                >
                  Inactive
                </Label>
              )}
            </div>
            <span class={style.switchText}>
              <Label
                providedValue={
                  localization && localization.purposes
                    ? localization.purposes.switchText
                    : ''
                }
                localizeKey="switchText"
              >
                Publisher and their partners could collect anonymized
                information in order to improve your experience on our site.
              </Label>
            </span>
          </div>
          {!showLocalVendors && (
            <a class={style.vendorLink} onClick={onShowLocalVendors}>
              <Label
                providedValue={
                  localization && localization.purposes
                    ? localization.purposes.showVendors
                    : ''
                }
                localizeKey="showVendors"
              >
                Show companies
              </Label>
            </a>
          )}
          {showLocalVendors && (
            <a class={style.vendorLink} onClick={onHideLocalVendors}>
              <Label
                providedValue={
                  localization && localization.purposes
                    ? localization.purposes.hideVendors
                    : ''
                }
                localizeKey="hideVendors"
              />
            </a>
          )}
          {showLocalVendors && (
            <Vendortable vendors={localVendors} displayControls={false} />
          )}
        </div>
      </div>
    </div>
  );
};
