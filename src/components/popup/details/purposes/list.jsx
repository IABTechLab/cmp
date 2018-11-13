import { h } from 'preact';
import cx from 'classnames';

import style from './purposes.less';
import Label from '../../../label/label';

export function List({
  allPurposes,
  selectedPurposeIndex,
  purposes,
  onPurposeClick,
}) {
  return (
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
}
