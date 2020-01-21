import { h, Component } from 'preact';
import style from './popupThin.less';
import IntroThin from './intro/introThin';
import Details from './details/details';
import Panel from '../panel/panel';


const SECTION_INTRO = 0;
const SECTION_DETAILS = 1;

export default class PopupThin extends Component {
  state = {
    selectedPanelIndex: SECTION_INTRO,
    isActive: false
  };

  onAcceptAll = () => {
    const { store, onSave } = this.props;
    store.selectAllVendors(true);
    store.selectAllPurposes(true);
    store.selectAllCustomPurposes(true);
    onSave();
  };

  onCancel = () => {
    this.setState({
      selectedPanelIndex: SECTION_INTRO,
      isActive: false
    });
  };

  handleShowDetails = () => {
    this.setState({
      selectedPanelIndex: SECTION_DETAILS,
      isActive: true
    });
  };

  handleClose = () => {};

  componentDidMount() {
    this.props.updateCSSPrefs();
  }

  render(props, state) {
    const { store, localization, config, updateCSSPrefs } = props;
    const { selectedPanelIndex, isActive } = state;
    const { isThinConsentToolShowing } = store;

    return (
      <div
        class={config.blockBrowsing ? style.popup : ''}
        style={{ display: isThinConsentToolShowing ? 'flex' : 'none' }}
      >
        {config.blockBrowsing &&
          <div
            class={style.overlay}
            onClick={this.handleClose}
          />
        }
        <div name='content' class={this.state.isActive ? style.contentClicked : style.content}>
          <Panel selectedIndex={selectedPanelIndex}>
            <IntroThin
              onAcceptAll={this.onAcceptAll}
              onShowPurposes={this.handleShowDetails}
              onClose={this.handleClose}
              localization={localization}
              store={store}
              config={config}
              updateCSSPrefs={updateCSSPrefs}
            />
            <Details
              onSave={this.props.onSave}
              onCancel={this.onCancel}
              store={this.props.store}
              onClose={this.handleClose}
              localization={localization}
              config={config}
              updateCSSPrefs={updateCSSPrefs}
            />
          </Panel>
        </div>
      </div>
    );
  }
}
