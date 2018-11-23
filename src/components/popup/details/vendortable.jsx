import { h } from 'preact';

import { Label } from '../../label';
import { Switch } from '../../switch';
import { Link } from '../../link';
import style from './vendortable.less';

export const Vendortable = ({
  vendors = [],
  displayControls = false,
  onVendorToggle = () => {},
  selectedVendorIds = new Set(),
}) => {
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
              <Link href={policyUrl} blank>
                {name}
              </Link>
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
};
