import { h } from 'preact';
import PropTypes from 'prop-types';

import { Label } from '../../label';
import { Switch } from '../../switch';
import { Link } from '../../link';
import { Text } from '../../typography';
import style from './vendortable.less';
import { Chevron } from '../../chevron';

export const Vendortable = (
  {
    vendors = [],
    displayControls = false,
    onVendorToggle = () => {},
    selectedVendorIds = new Set(),
    showVendorDetails = () => {},
  },
  { theme },
) => {
  return (
    <table class={style.vendorTable} style={{ borderColor: theme.colorBorder }}>
      <thead>
        <tr
          style={{
            borderColor: theme.colorBorder,
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            backgroundColor: theme.colorTableBackground,
          }}
        >
          <th>
            <Label is={Text} localizeKey="purposes.company" />
          </th>
          {displayControls && (
            <th>
              <Label is={Text} localizeKey="vendors.offOn" />
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {vendors.map(({ name, policyUrl, id, display }, index) => {
          const isEven = index % 2 === 1;
          console.log('A', display);
          return (
            <tr
              key={index + name}
              class={isEven ? style.even : ''}
              style={isEven && { backgroundColor: theme.colorTableBackground }}
            >
              <td>
                <Link className={style.vendorName} href={policyUrl} blank>
                  {name}
                </Link>
                <Chevron
                  onClick={() => {
                    // TODO do as a component
                    //Find index of specific object using findIndex method.
                    const objIndex = vendors.findIndex(
                      vendor => vendor.id === id,
                    );
                    vendors[objIndex].display = !vendors[objIndex].display;
                    console.log(
                      'Update: ',
                      vendors.find(vendor => vendor.id === id),
                    );
                    showVendorDetails();
                  }}
                />
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

              {display ? (
                <span style={width}>
                  {vendors.find(vendor => vendor.id === id).toString()}
                </span>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

Vendortable.contextTypes = {
  theme: PropTypes.object.isRequired,
};
