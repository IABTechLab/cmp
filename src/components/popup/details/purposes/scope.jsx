import { h } from 'preact';
import { Switch } from '../../../switch';
import { Divider } from '../../../divider';
import { Label } from '../../../label';
import style from './purposes.less';

export const Scope = ({ isSelected, onChange }) => {
  return (
    <div>
      <div className={style.consentScope}>
        <Switch
          className={style.consentScopeSwitch}
          dataId="consentScope"
          isSelected={isSelected}
          onClick={onChange}
        />
        <Label prefix="purposes" localizeKey="consentScope" />
      </div>
      <Divider />
    </div>
  );
};
