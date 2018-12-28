import { h } from 'preact';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Label } from '../../../label';
import style from './purposes.less';

export const PurposeList = (
  { allPurposes, selectedPurposeIndex, purposes, onPurposeClick },
  { theme },
) => (
  <div class={style.purposeList}>
    {allPurposes.map((purpose, i) => {
      const isActive = selectedPurposeIndex === i;
      const itemStyles = isActive
        ? {
            backgroundColor: theme.colorBackground,
            color: theme.colorTextPrimary,
            borderColor: theme.colorBorder,
          }
        : {
            backgroundColor: theme.colorPrimary,
            color: 'white',
            borderColor: theme.colorBorder,
            borderRightWidth: 1,
            borderRightStyle: 'solid',
          };
      return (
        <div
          class={cx({
            [style.purposeItem]: true,
            [style.selectedPurpose]: isActive,
          })}
          style={{ ...itemStyles, fontFamily: theme.fontFamily }}
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
      );
    })}
  </div>
);

PurposeList.contextTypes = {
  theme: PropTypes.object.isRequired,
};
