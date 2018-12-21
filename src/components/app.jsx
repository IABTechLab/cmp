import { h, Component } from 'preact';

import { currentLocale } from '../lib/localize';
import { ThemeProvider, mapLegacyTheme } from './config';
import { Popup } from './popup';
import { Footer } from './footer';
import style from './app.less';

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
        function(event) {
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

          if (
            (isConsentToolShowing ||
              isFooterConsentToolShowing ||
              isThinConsentToolShowing ||
              isFooterShowing) &&
            !showConsentToolButtonClicked &&
            !appDiv.contains(target)
          ) {
            store.toggleConsentToolShowing(true);

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

  render(props, state) {
    const { store } = state;
    const { config } = props;
    const userLocalization = config.localization[currentLocale.split('-')[0]];
    const showPopup =
      store.isConsentToolShowing ||
      store.isFooterConsentToolShowing ||
      store.isThinConsentToolShowing;

    return (
      <ThemeProvider theme={config.theme || mapLegacyTheme(config.css)}>
        <div class={style.gdpr}>
          {showPopup && (
            <Popup
              store={store}
              localization={userLocalization}
              onSave={this.onSave}
              config={config}
            />
          )}
          <Footer
            store={store}
            localization={userLocalization}
            config={config}
          />
        </div>
      </ThemeProvider>
    );
  }
}
