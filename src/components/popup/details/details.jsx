import { h, Component } from 'preact';
import cx from 'classnames';

import style from './details.less';
import Purposes from './purposes/purposes';
import Vendors from './vendors/vendors';
import { Panel } from '../../panel/panel';
import { Header } from '../header';
import popupStyle from '../popup.less';
import { Footer } from './footer';

const SECTION_PURPOSES = 0;
const SECTION_VENDORS = 1;

export default class Details extends Component {
  state = {
    selectedPanelIndex: SECTION_PURPOSES,
    showEnableAll: true,
  };

  handleShowVendors = () => {
    this.setState({
      selectedPanelIndex: SECTION_VENDORS,
    });
  };

  handleShowPurposes = () => {
    this.setState({
      selectedPanelIndex: SECTION_PURPOSES,
    });
  };

  handleEnableAll = () => {
    const shouldSelectAll = this.state.showEnableAll;
    const { selectAllVendors, selectAllPurposes } = this.props.store;

    selectAllVendors(shouldSelectAll);
    selectAllPurposes(shouldSelectAll);
    this.setState({ showEnableAll: !this.state.showEnableAll });
  };

  handleBack = () => {
    const { onCancel } = this.props;
    const { selectedPanelIndex } = this.state;
    this.setState({
      selectedPanelIndex: Math.max(0, selectedPanelIndex - 1),
    });
    if (selectedPanelIndex === SECTION_PURPOSES) {
      onCancel();
    }
  };

  render(props, state) {
    const { onSave, store, localization, config, updateCSSPrefs } = props;
    const { selectedPanelIndex } = state;
    const {
      vendorList = {},
      customPurposeList = {},
      vendorConsentData,
      publisherConsentData,
      selectPurpose,
      selectCustomPurpose,
      selectAllVendors,
      selectVendor,
    } = store;
    const { selectedPurposeIds, selectedVendorIds } = vendorConsentData;
    const { selectedCustomPurposeIds } = publisherConsentData;
    const { purposes = [], vendors = [], features = [] } = vendorList;
    const { purposes: customPurposes = [] } = customPurposeList;

    return (
      <div class={cx(popupStyle.content, popupStyle.modal)}>
        <div class={style.details}>
          <Header titleKey="details.title" />
          <Panel className={style.body} selectedIndex={selectedPanelIndex}>
            <Purposes
              localization={localization}
              purposes={purposes}
              features={features}
              vendors={vendors}
              customPurposes={customPurposes}
              selectedPurposeIds={selectedPurposeIds}
              selectedCustomPurposeIds={selectedCustomPurposeIds}
              selectPurpose={selectPurpose}
              selectCustomPurpose={selectCustomPurpose}
              onShowVendors={this.handleShowVendors}
              config={config}
              updateCSSPrefs={updateCSSPrefs}
            />
            <Vendors
              localization={localization}
              selectedVendorIds={selectedVendorIds}
              selectAllVendors={selectAllVendors}
              selectVendor={selectVendor}
              vendors={vendors}
              onShowPurposes={this.handleShowPurposes}
              onHandleEnableAll={this.handleEnableAll}
              config={config}
              updateCSSPrefs={updateCSSPrefs}
            />
          </Panel>
          <Footer
            showVendorsLink={selectedPanelIndex === SECTION_PURPOSES}
            onSaveClick={onSave}
            onShowVendorsClick={this.handleShowVendors}
            onBackClick={this.handleBack}
          />
        </div>
      </div>
    );
  }
}
