import { h, Component } from 'preact';
import cx from 'classnames';

import { Panel } from '../panel';
import { Intro } from './intro';
import { Summary } from './summary';
import { Details } from './details';
import style from './popup.less';

const SECTION_INTRO = 0;
const SECTION_SUMMARY = 1;
const SECTION_DETAILS = 2;
// const SECTION_PURPOSES = 2;
// const SECTION_VENDORS = 3;

export default class Popup extends Component {
  state = {
    selectedPanelIndex: SECTION_INTRO,
    directVendors: false,
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
    });
  };

  showSection = section => {
    this.setState({
      selectedPanelIndex: section,
    });
  };

  showIntro = () => {
    this.showSection(SECTION_INTRO);
  };

  showSummary = () => {
    this.showSection(SECTION_SUMMARY);
  };

  showDetails = () => {
    this.setState({
      directVendors: false,
    });
    this.showSection(SECTION_DETAILS);
  };

  showDirectVendors = () => {
    this.showSection(SECTION_DETAILS);
    this.setState({
      directVendors: true,
    });
  };

  handleClose = () => {};

  render(props, state) {
    const { store, localization, config, visible } = props;
    const { selectedPanelIndex } = state;

    if (!visible) {
      return null;
    }

    return (
      <div class={cx(style.popup, style[`popup-${config.layout}`])}>
        {config.blockBrowsing && (
          <div class={style.overlay} onClick={this.handleClose} />
        )}
        <Panel selectedIndex={selectedPanelIndex}>
          <Intro
            onAcceptAll={this.onAcceptAll}
            onShowSummary={this.showSummary}
            onShowPurposes={this.showDetails}
            onShowDirectVendors={this.showDirectVendors}
            onClose={this.handleClose}
            localization={localization}
            store={store}
            config={config}
          />
          <Summary
            onAcceptAll={this.onAcceptAll}
            onShowIntro={this.showIntro}
            onShowPurposes={this.showDetails}
            onClose={this.handleClose}
            localization={localization}
            store={store}
            layout={config.layout}
          />
          <Details
            onSave={this.props.onSave}
            onCancel={this.onCancel}
            store={this.props.store}
            onClose={this.handleClose}
            localization={localization}
            config={config}
            directVendors={this.state.directVendors}
          />
        </Panel>
      </div>
    );
  }
}
