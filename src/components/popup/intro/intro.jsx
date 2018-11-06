import { h, Component } from 'preact';
import style from './intro.less';
import Button from '../../button/button';
import Label from '../../label/label';
import IntroFooter from './footer';

class LocalLabel extends Label {
  static defaultProps = {
    prefix: 'intro',
  };
}

export default class Intro extends Component {
  static defaultProps = {};

  state = {
    footerExpanded: false,
  }

  componentDidMount() {
    this.props.updateCSSPrefs();
  }

  renderTitle () {
    const {
      localization,
      config,
    } = this.props;
    return (

      <div class={style.title + ' primaryText'}>
      <LocalLabel
        providedValue={
          localization && localization.intro
            ? localization.intro.title
            : ''
        }
        localizeKey="title"
      >
        Thanks for visiting{' '}
      </LocalLabel>
      {config && config.companyName && <span>{config.companyName}</span>}
    </div>
    )
  }

  toggleFooterExpanded = () => {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

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
      <div class={style.intro}>
        {
          !this.state.footerExpanded
          && (
            <div class={style.content + ' ' + style[`content-${config.layout}`]}>
              {config.logoUrl && <img class={style.logo} src={config.logoUrl} />}
              {config.layout === 'modal' && this.renderTitle()}
              <div class={style.description + ' primaryText'}>
                {config.layout !== 'modal' && this.renderTitle()}
                <LocalLabel
                  providedValue={
                    localization && localization.intro
                      ? localization.intro.description
                      : ''
                  }
                  localizeKey="description"
                >
                  Ads help us run this site. When you use our site selected
                  companies may access and use information on your device for
                  various purposes including to serve relevant ads or personalised
                  content.
                </LocalLabel>
              </div>

              <div class={style.options}>
                <Button
                  class={style.rejectAll}
                  invert={true}
                  onClick={onShowPurposes}
                >
                  <LocalLabel
                    providedValue={
                      localization && localization.intro
                        ? localization.intro.showPurposes
                        : ''
                    }
                    localizeKey="showPurposes"
                  >
                    Learn more
                  </LocalLabel>
                </Button>
                <Button class={style.acceptAll} onClick={onAcceptAll}>
                  <LocalLabel
                    providedValue={
                      localization && localization.intro
                        ? localization.intro.acceptAll
                        : ''
                    }
                    localizeKey="acceptAll"
                  >
                    Accept all
                  </LocalLabel>
                </Button>
              </div>
            </div>
          )}
        <IntroFooter
          onShowPurposes={onShowPurposes}
          onToggleExpanded={this.toggleFooterExpanded}
          expanded={this.state.footerExpanded}
          onAcceptAll={onAcceptAll}
          localization={localization}
          store={store}
          updateCSSPrefs={updateCSSPrefs}
        />
      </div>
    );
  }
}
