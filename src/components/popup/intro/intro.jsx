import { h, Component } from 'preact';
import cx from 'classnames';
import style from './intro.less';
import popupStyle from '../popup.less';
import Button from '../../button/button';
import Label from '../../label/label';
import IntroFooter from './footer/footer';
import { ConsentButtons } from './consentbuttons';

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
      <div class={cx(style.title, 'primaryText')}>
        <LocalLabel localizeKey="title" />
        {config && config.companyName && <span>{config.companyName}</span>}
      </div>
    );
  }

  toggleFooterExpanded = () => {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  };

  renderLearnMoreButton = () => {
    const { onShowPurposes, localization } = this.props;
    return (
      <Button class={style.rejectAll} invert={true} onClick={onShowPurposes}>
        <LocalLabel localizeKey="showPurposes" />
      </Button>
    );
  };

  render(props, state) {
    const {
      onAcceptAll,
      onShowPurposes,
      localization,
      store,
      updateCSSPrefs,
      config,
    } = props;

    return (
      <div class={cx(popupStyle.content, popupStyle[config.layout])}>
        <div class={style.intro}>
          {!this.state.footerExpanded && (
            <div class={cx(style.content, style[`content-${config.layout}`])}>
              {config.logoUrl && (
                <img class={style.logo} src={config.logoUrl} />
              )}
              {config.layout === 'modal' && this.renderTitle()}
              <div class={style.description + ' primaryText'}>
                {config.layout === 'footer' && this.renderTitle()}
                <LocalLabel localizeKey="description" />
              </div>

              {/* {config.layout !== 'thin' && this.renderLearnMoreButton()} */}
              <ConsentButtons
                className={style.btns}
                onAcceptAll={onAcceptAll}
                onShowPurposes={onShowPurposes}
              />
            </div>
          )}
          <IntroFooter
            onShowPurposes={onShowPurposes}
            onToggleExpanded={this.toggleFooterExpanded}
            expanded={this.state.footerExpanded}
            onAcceptAll={onAcceptAll}
            localization={localization}
            store={store}
            layout={config.layout}
            showLearnMoreButton={config.layout === 'thin'}
            learnMoreButton={this.renderLearnMoreButton()}
            updateCSSPrefs={updateCSSPrefs}
          />
        </div>
      </div>
    );
  }
}
