import { h } from 'preact';

import { Vendortable } from '../vendortable';
import { Description } from './description';
import style from './vendors.less';

const naiUrl = 'http://optout.networkadvertising.org/?c=1#!/';
const daaUrl = 'http://optout.aboutads.info/?c=2#!/';
const edaaUrl = 'http://youronlinechoices.eu/';

export const Vendors = ({
  onShowPurposes = () => {},
  onSelectAllVendors = () => {},
  onSelectVendor = () => {},
  vendors = [],
  showVendorDetails = () => {},
  selectedVendorIds = new Set(),
}) => (
  <div class={style.vendors}>
    <Description
      naiUrl={naiUrl}
      daaUrl={daaUrl}
      edaaUrl={edaaUrl}
      onShowPurposes={onShowPurposes}
      onSelectAllVendors={onSelectAllVendors}
    />
    <Vendortable
      displayControls
      vendors={vendors}
      onVendorToggle={onSelectVendor}
      selectedVendorIds={selectedVendorIds}
      showVendorDetails={showVendorDetails}
    />
  </div>
);
