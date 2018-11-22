import { h, Component } from 'preact';

import style from './footer.less';
import Label from '../label/label';
import CloseButton from '../closebutton/closebutton';

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
          <Label localizeKey="footer.closedMessage" />
          <a class={style.openConsent} onClick={this.handleShowConsent}>
            <Label localizeKey="footer.closedMessageLink" />
          </a>
        </div>
      </div>
    );
  }
}
