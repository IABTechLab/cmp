import { h } from 'preact';

import { Label } from '../../../label';
import { LocalizedLink } from '../../../link';
import { Paragraph, Title, Text } from '../../../typography';
import { Row } from '../../../layout';
import { Switch } from '../../../switch';
import { Ul } from '../../../ul';
import { Vendortable } from '../vendortable';
import style from './purposes.less';

const formatFeature = item => item.description;

export const PurposeDetail = ({
  selectedPurpose,
  currentPurposeLocalizePrefix,
  features,
  purposeIsActive,
  showLocalVendors,
  localVendors,
  setScrollRef,
  onToggleLocalVendors,
  handleSelectPurpose,
}) => {
  const toggleVendorsKey = showLocalVendors ? 'hideVendors' : 'showVendors';
  return (
    <div class={style.purposeDescription} ref={setScrollRef}>
      <Label
        is={Title}
        alignment="left"
        providedValue={selectedPurpose.name}
        localizeKey={`${currentPurposeLocalizePrefix}.title`}
      />
      <Label
        is={Paragraph}
        providedValue={selectedPurpose.description}
        localizeKey={`${currentPurposeLocalizePrefix}.description`}
      />
      <Label is={Paragraph} localizeKey="purposes.featureHeader" />
      <Ul items={features} formatItem={formatFeature} />

      <Row>
        <Switch
          displayLabel
          isSelected={purposeIsActive}
          onClick={handleSelectPurpose}
        />
        <Label
          is={Text}
          class={style.switchText}
          localizeKey="purposes.switchText"
        />
      </Row>

      <LocalizedLink
        localizeKey={`purposes.${toggleVendorsKey}`}
        onClick={onToggleLocalVendors}
      />
      {showLocalVendors && (
        <Vendortable vendors={localVendors} displayControls={false} />
      )}
    </div>
  );
};
