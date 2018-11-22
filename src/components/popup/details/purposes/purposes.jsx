import { h, Component } from 'preact';

import style from './purposes.less';
import { List } from './list';
import { Disclaimer } from './disclaimer';
import { Detail } from './detail';

export default class Purposes extends Component {
  state = {
    selectedPurposeIndex: 0,
    showLocalVendors: false,
    localVendors: [],
  };

  static defaultProps = {
    onShowVendors: () => {},
    purposes: [],
    customPurposes: [],
    selectedPurposeIds: new Set(),
    selectedCustomPurposeIds: new Set(),
  };

  handleSelectPurposeDetail = index => {
    return () => {
      this.setState(
        {
          selectedPurposeIndex: index,
          showLocalVendors: false,
          localVendors: [],
        },
        this.props.updateCSSPrefs,
      );
      this.scrollRef.scrollTop = 0;
    };
  };

  handleSelectPurpose = ({ isSelected }) => {
    const { selectedPurposeIndex } = this.state;
    const {
      purposes,
      customPurposes,
      selectPurpose,
      selectCustomPurpose,
    } = this.props;
    const allPurposes = [...purposes, ...customPurposes];
    const id = allPurposes[selectedPurposeIndex].id;

    if (selectedPurposeIndex < purposes.length) {
      selectPurpose(id, isSelected);
    } else {
      selectCustomPurpose(id, isSelected);
    }
  };

  onShowLocalVendors = () => {
    const { selectedPurposeIndex } = this.state;
    const { vendors, updateCSSPrefs } = this.props;
    const localVendors = vendors
      .map(vendor => {
        let purposeId = selectedPurposeIndex + 1;
        if (
          vendor.purposeIds.indexOf(purposeId) !== -1 ||
          vendor.legIntPurposeIds.indexOf(purposeId) !== -1
        )
          return vendor;
      })
      .filter(vendor => vendor);
    this.setState(
      {
        showLocalVendors: true,
        localVendors,
      },
      updateCSSPrefs,
    );
  };

  onHideLocalVendors = () => {
    this.setState({
      showLocalVendors: false,
      localVendors: [],
    });
  };

  setScrollRef = scrollRef => (this.scrollRef = scrollRef);

  render(props, state) {
    const {
      onShowVendors,
      purposes,
      features,
      customPurposes,
      selectedPurposeIds,
      selectedCustomPurposeIds,
      localization,
      config,
    } = props;

    const { selectedPurposeIndex, showLocalVendors } = state;
    let { localVendors } = state;

    const allPurposes = [...purposes, ...customPurposes];
    const selectedPurpose = allPurposes[selectedPurposeIndex];
    const selectedPurposeId = selectedPurpose && selectedPurpose.id;
    const currentPurposeLocalizePrefix = `${
      selectedPurposeIndex >= purposes.length ? 'customPurpose' : 'purpose'
    }${selectedPurposeId}`;
    let purposeIsActive =
      selectedPurposeIndex < purposes.length
        ? selectedPurposeIds.has(selectedPurposeId)
        : selectedCustomPurposeIds.has(selectedPurposeId);

    return (
      <div class={style.container}>
        <Disclaimer onShowVendors={onShowVendors} />
        <div class={style.purposes}>
          <List
            allPurposes={allPurposes}
            purposes={purposes}
            selectedPurposeIndex={selectedPurposeIndex}
            onPurposeClick={this.handleSelectPurposeDetail}
          />
          {selectedPurpose && (
            <Detail
              setScrollRef={this.setScrollRef}
              onShowLocalVendors={this.onShowLocalVendors}
              onHideLocalVendors={this.onHideLocalVendors}
              handleSelectPurpose={this.handleSelectPurpose}
              selectedPurpose={selectedPurpose}
              currentPurposeLocalizePrefix={currentPurposeLocalizePrefix}
              localization={localization}
              features={features}
              purposeIsActive={purposeIsActive}
              showLocalVendors={showLocalVendors}
              localVendors={localVendors}
            />
          )}
        </div>
      </div>
    );
  }
}
