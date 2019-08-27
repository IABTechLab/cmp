import { h } from 'preact';

import { Vendortable } from '../vendortable';
import { Description } from './description';
import style from './vendors.less';
import { Purposes } from '../purposes';

const naiUrl = 'http://optout.networkadvertising.org/?c=1#!/';
const daaUrl = 'http://optout.aboutads.info/?c=2#!/';
const edaaUrl = 'http://youronlinechoices.eu/';

export const Vendors = ({
  onShowPurposes = () => {},
  onSelectAllVendors = () => {},
  onSelectVendor = () => {},
  vendors = [],
  purposes = [],
  features = [],
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
      purposes={purposes}
      features={features}
      onVendorToggle={onSelectVendor}
      selectedVendorIds={selectedVendorIds}
      showVendorDetails={showVendorDetails}
    />
  </div>
);
