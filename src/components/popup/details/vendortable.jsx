import { h } from 'preact';

import style from './vendortable.less';
import Label from '../../label/label';
import Switch from '../../switch/switch';

export function Vendortable({
  vendors,
  displayControls,
  onVendorToggle,
  selectedVendorIds,
}) {
  return (
    <table class={style.vendorTable}>
      <thead>
        <tr>
          <th>
            <Label localizeKey="purposes.company" />
          </th>
          {displayControls && (
            <th>
              <Label localizeKey="vendors.offOn" />
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {vendors.map(({ name, policyUrl, id }, index) => (
          <tr key={index + name} class={index % 2 === 1 ? style.even : ''}>
            <td>
              <a href={policyUrl} target="_blank">
                <div class={style.vendorName}>{name}</div>
              </a>
            </td>
            {displayControls && (
              <td>
                <Switch
                  dataId={id}
                  isSelected={selectedVendorIds.has(id)}
                  onClick={onVendorToggle}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
