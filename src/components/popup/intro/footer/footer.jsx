import { h, Component } from 'preact';
import style from './footer.less';
import Label from '../../../label/label';
import cx from 'classnames';
import { FooterPurposes } from './purposes';
import { ConsentButtons } from '../consentbuttons';

class LocalLabel extends Label {
  static defaultProps = {};
}

export default class IntroFooter extends Component {
  static defaultProps = {};

  componentDidMount() {
    this.props.updateCSSPrefs();
  }

  componentDidUpdate() {
    this.props.updateCSSPrefs();
  }

  render(props) {
    const {
      localization,
      onShowPurposes,
      onAcceptAll,
      store,
      expanded,
      onToggleExpanded,
      showLearnMoreButton,
      learnMoreButton,
      layout,
    } = props;

    let allPurposes = [];
    if (store.vendorList && store.vendorList.purposes) {
      allPurposes = allPurposes.concat(store.vendorList.purposes);
    }
    if (store.customPurposeList && store.customPurposeList.purposes) {
      allPurposes = allPurposes.concat(store.customPurposeList.purposes);
    }

    return (
      <div class={cx(style.container, style[`container-${layout}`])}>
        {!expanded && (
          <div class={cx(style.base, style.collapsed)}>
            <div class={style.message}>
              <span name="ctrl" class={style.icon} onClick={onToggleExpanded} />
              <LocalLabel
                providedValue={
                  localization && localization.footer
                    ? localization.footer.message
                    : ''
                }
                localizeKey="footer.message"
                class={cx(style.message, 'primaryText')}
              >
                Read more about access and use of information on your device for
                various purposes.
              </LocalLabel>
            </div>
            {showLearnMoreButton && (
              <div style={{ flex: 1 }}>{learnMoreButton}</div>
            )}
          </div>
        )}

        {expanded && (
          <div class={style.container}>
            <div class={cx(style.base, style.extended)}>
              <span
                name="ctrl"
                class={style.iconDown}
                onClick={onToggleExpanded}
              />
              <LocalLabel
                localizeKey="footer.deviceInformationHeader"
                class={cx(style.headerMessage, 'primaryText')}
              />
            </div>

            <FooterPurposes allPurposes={allPurposes} />
            <ConsentButtons
              className={style.infoFooter}
              onAcceptAll={onAcceptAll}
              onShowPurposes={onShowPurposes}
            />
          </div>
        )}
      </div>
    );
  }
}
