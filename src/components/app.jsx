import { h, Component } from 'preact';

import style from './app.less';
import { ThemeProvider, mapLegacyTheme } from './theme';
import { Popup } from './popup';
import { Footer } from './footer';
import { LocalizationProvider } from './localization';

export default class App extends Component {
  state = {
    store: this.props.store,
  };

  onSave = () => {
    const { store, notify } = this.props;
    store.persist();
    notify('onSubmit');
    store.toggleConsentToolShowing(false);
    store.toggleFooterShowing(true);
  };

  updateState = store => {
    this.setState({ store });
  };

  componentWillMount() {
    const self = this;
    const { store, config, cmp } = self.props;
    store.subscribe(self.updateState);

    // Clicking outside the main app will close it if blockBrowsing is set to false
    // This is to capture clicks outside of the main window and close if necessary while also
    // whitelisting the 'showConsentTool' button
    if (!config.blockBrowsing) {
      document.addEventListener(
        'click',
        event => {
          const target = event.target;
          const showConsentToolButtonClicked = RegExp('showConsentTool').test(
            target.getAttribute('onclick'),
          );
          const appDiv = self.base;
          const { layout } = config;
          const {
            isConsentToolShowing,
            isFooterConsentToolShowing,
            isThinConsentToolShowing,
            isFooterShowing,
          } = store;
          const isPopupVisible =
            isConsentToolShowing ||
            isFooterConsentToolShowing ||
            isThinConsentToolShowing ||
            isFooterShowing;

          if (
            isPopupVisible &&
            !showConsentToolButtonClicked &&
            !appDiv.contains(target)
          ) {
            store.toggleConsentToolShowing(false);

            // Render footer style CMP if no consent decision has been submitted yet
            if (!cmp.submitted) {
              layout !== 'thin'
                ? store.toggleFooterConsentToolShowing(true)
                : store.toggleThinConsentToolShowing(true);
            }
          }
        },
        false,
      );
    }
  }

  onFooterClose = () => {
    this.props.store.toggleFooterShowing(false);
  };

  onShowConsent = () => {
    this.props.store.cmp.commands.showConsentTool();
  };

  render(props, state) {
    const { store } = state;
    const { config } = props;
    const showPopup =
      store.isConsentToolShowing ||
      store.isFooterConsentToolShowing ||
      store.isThinConsentToolShowing;
    const showFooter = store.isFooterShowing && config.showFooterAfterSubmit;

    return (
      <LocalizationProvider
        forceLocale={config.forceLocale}
        language={store.consentLanguage}
        translations={config.localization}
      >
        <ThemeProvider theme={config.theme || mapLegacyTheme(config.css)}>
          <div class={style.gdpr}>
            {showPopup && (
              <Popup store={store} onSave={this.onSave} config={config} />
            )}
            {showFooter && (
              <Footer
                onClose={this.onFooterClose}
                onShowConsent={this.onShowConsent}
              />
            )}
          </div>
        </ThemeProvider>
      </LocalizationProvider>
    );
  }
}
