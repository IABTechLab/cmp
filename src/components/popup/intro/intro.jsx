import { h, Component } from 'preact';
import cx from 'classnames';

import Label from '../../label/label';
import { ConsentButtons } from '../consentbuttons';
import popupStyle from '../popup.less';
import { Footer } from './footer';
import style from './intro.less';
import { Title } from '../../typography/title';

class LocalLabel extends Label {
  static defaultProps = {
    prefix: 'intro',
  };
}

export default class Intro extends Component {
  static defaultProps = {};

  state = {
    footerExpanded: false,
  };

  componentDidMount() {
    this.props.updateCSSPrefs();
  }

  renderTitle() {
    const { config } = this.props;
    return (
      <Title alignment={config.layout === 'footer' && 'left'}>
        <LocalLabel localizeKey="title" />
        {config && config.companyName && <span>{config.companyName}</span>}
      </Title>
    );
  }

  render(props) {
    const { onAcceptAll, onShowPurposes, onShowSummary, config } = props;

    return (
      <div class={cx(popupStyle.content, popupStyle[config.layout])}>
        <div class={cx(style.container, style[`container-${config.layout}`])}>
          {config.logoUrl && <img class={style.logo} src={config.logoUrl} />}
          {config.layout === 'modal' && this.renderTitle()}
          <div class={style.description + ' primaryText'}>
            {config.layout === 'footer' && this.renderTitle()}
            <LocalLabel localizeKey="description" />
          </div>
          <ConsentButtons
            className={style.btns}
            onAcceptAll={onAcceptAll}
            onShowPurposes={onShowPurposes}
          />
        </div>
        <Footer onShowSummary={onShowSummary} />
      </div>
    );
  }
}
