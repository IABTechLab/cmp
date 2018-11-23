import { h } from 'preact';
import cx from 'classnames';

import { Label } from '../../../label';
import style from './purposes.less';

export const PurposeList = ({
  allPurposes,
  selectedPurposeIndex,
  purposes,
  onPurposeClick,
}) => (
  <div class={style.purposeList}>
    {allPurposes.map((purpose, i) => (
      <div
        class={cx({
          [style.purposeItem]: true,
          [style.selectedPurpose]: selectedPurposeIndex === i,
        })}
        onClick={onPurposeClick(i)}
      >
        <Label
          localizeKey={`purposes.${
            i >= purposes.length ? 'customPurpose' : 'purpose'
          }${purpose.id}.menu`}
        >
          {purpose.name}
        </Label>
      </div>
    ))}
  </div>
);
