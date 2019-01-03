import { h, Component } from 'preact';
import PropTypes from 'prop-types';

import style from './footer.less';
import { Label } from '../label';
import { CloseButton } from '../closebutton';
import { Text } from '../typography';
import { LocalizedLink } from '../link';

export default class Footer extends Component {
  static defaultProps = {
    onShowConsent: () => {},
    onClose: () => {},
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div
        class={style.footer}
        style={{
          backgroundColor: this.context.theme.colorBackground,
        }}
      >
        <CloseButton
          hasBorder={false}
          class={style.close}
          onClick={this.props.onClose}
        />
        <div class={style.message}>
          <Label is={Text} localizeKey="footer.closedMessage" />{' '}
          <LocalizedLink
            localizeKey="footer.closedMessageLink"
            class={style.openConsent}
            onClick={this.props.onShowConsent}
          />
        </div>
      </div>
    );
  }
}
