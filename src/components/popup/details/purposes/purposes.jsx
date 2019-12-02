import { h, Component } from 'preact';

import style from './purposes.less';
import { PurposeList } from './list';
import { Disclaimer } from './disclaimer';
import { PurposeDetail } from './detail';

export class Purposes extends Component {
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
		selectedCustomPurposeIds: new Set()
	}

  handleSelectPurposeDetail = index => {
    return () => {
      this.setState({
        selectedPurposeIndex: index,
        showLocalVendors: false,
        localVendors: [],
      });
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

	handleSelectPurposeDetail = index => {
		return () => {
			this.setState({
				selectedPurposeIndex: index
			}, () => {
				this.onHideLocalVendors(index);
				this.props.updateCSSPrefs();
			});
		};
	}

  onShowLocalVendors = () => {
    const { selectedPurposeIndex } = this.state;
    const { vendors } = this.props;
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
    this.setState({
      showLocalVendors: true,
      localVendors,
    });
  };

		this.setState({
			vendorList
		});
	};

  onToggleLocalVendors = () => {
    if (this.state.showLocalVendors) {
      this.onHideLocalVendors();
    } else {
      this.onShowLocalVendors();
    }
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
			selectPurpose,
			selectCustomPurpose,
			vendors,
			updateCSSPrefs
		} = props;

		const { selectedPurposeIndex, vendorList } = state;

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
          <PurposeList
            allPurposes={allPurposes}
            purposes={purposes}
            selectedPurposeIndex={selectedPurposeIndex}
            onPurposeClick={this.handleSelectPurposeDetail}
          />
          {selectedPurpose && (
            <PurposeDetail
              setScrollRef={this.setScrollRef}
              onToggleLocalVendors={this.onToggleLocalVendors}
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
