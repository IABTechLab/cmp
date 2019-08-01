import { h } from 'preact';
import PropTypes from 'prop-types';

import { Label } from '../../label';
import { Switch } from '../../switch';
import { Link } from '../../link';
import { Text } from '../../typography';
import style from './vendortable.less';
import { Chevron } from '../../chevron';
import { Row } from '../../layout';

export const Vendortable = (
  {
    vendors = [],
    purposes = [],
    features = [],
    displayControls = false,
    onVendorToggle = () => {},
    selectedVendorIds = new Set(),
    showVendorDetails = () => {},
    onChevronClick = id => {
      return () => {
        //Find index of specific object using findIndex method.
        const objIndex = vendors.findIndex(vendor => vendor.id === id);
        vendors[objIndex].display = !vendors[objIndex].display;
        showVendorDetails();
      };
    },
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

      {/*TODO is map good choice here ?*/
      vendors.map(
        (
          {
            name,
            policyUrl,
            id,
            display,
            purposeIds,
            legIntPurposeIds,
            featureIds,
          },
          index,
        ) => {
          const isEven = index % 2 === 1;
          console.log('A', display);
          return (
            <tbody>
              <tr
                key={index + name}
                class={isEven ? style.even : ''}
                style={
                  isEven && { backgroundColor: theme.colorTableBackground }
                }
              >
                <td>
                  <Row>
                    <Chevron
                      direction={display ? 'up' : 'down'}
                      onClick={onChevronClick(id)}
                    />
                    <Link className={style.vendorName} href={policyUrl} blank>
                      {name}
                    </Link>
                  </Row>
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

              {display ? (
                <tr>
                  <table style="width:100%">
                    <tr>
                      <td style={{ fontSize: 'bold' }}>Purposes:</td>
                      <td>
                        {' '}
                        {purposes
                          .filter(purpose => {
                            return purposeIds.indexOf(purpose.id) > 0;
                          })
                          .map(purpose => {
                            return purpose.name;
                          })
                          .join(', ')}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: 'bold' }}>Features:</td>
                      <td>
                        {' '}
                        {features
                          .filter(feature => {
                            return featureIds.indexOf(feature.id) > 0;
                          })
                          .map(feature => {
                            return feature.name;
                          })
                          .join(', ')}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: 'bold' }}>Legal purposes:</td>
                      <td>
                        {purposes
                          .filter(purpose => {
                            return legIntPurposeIds.indexOf(purpose.id) > 0;
                          })
                          .map(purpose => {
                            return purpose.name;
                          })
                          .join(', ')}
                      </td>
                    </tr>
                  </table>
                </tr>
              ) : null}
            </tbody>
          );
        },
      )}
    </table>
  );
};

Vendortable.contextTypes = {
  theme: PropTypes.object.isRequired,
};
