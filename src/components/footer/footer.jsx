import { h, Component } from 'preact';

import style from './footer.less';
import { Label } from '../label';
import { CloseButton } from '../closebutton';
import { Text } from '../typography';
import { LocalizedLink } from '../link';

export default class Footer extends Component {
  static defaultProps = {
    onShowConsent: () => {},
  };

  handleClose = () => {
    const { store } = this.props;
    const { toggleFooterShowing } = store;
    toggleFooterShowing(false);
  };

  handleShowConsent = () => {
    const { store } = this.props;
    const { showConsentTool } = store.cmp.commands;
    showConsentTool();
  };

  render(props) {
    const { store, config, updateCSSPrefs } = props;
    const { isFooterShowing } = store;

    return (
      <div
        class={style.footer}
        style={{
          display:
            isFooterShowing && config.showFooterAfterSubmit ? 'flex' : 'none',
        }}
      >
        <CloseButton
          hasBorder={false}
          class={style.close}
          onClick={this.handleClose}
          config={config}
          updateCSSPrefs={updateCSSPrefs}
        />
        <div class={style.message}>
          <Label is={Text} localizeKey="footer.closedMessage" />
          <LocalizedLink
            localizeKey="footer.closedMessageLink"
            class={style.openConsent}
            onClick={this.handleShowConsent}
          />
        </div>
      </div>
    );
  }
}
