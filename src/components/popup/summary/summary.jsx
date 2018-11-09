import { h, Component } from 'preact';
import cx from 'classnames';

import Label from '../../label/label';
import popupStyle from '../popup.less';
import { ConsentButtons } from '../consentbuttons';
import { Purposes } from './purposes';
import style from './summary.less';

export class Summary extends Component {
  static defaultProps = {};

  componentDidMount() {
    this.props.updateCSSPrefs();
  }

  componentDidUpdate() {
    this.props.updateCSSPrefs();
  }

  render(props) {
    const {
      onShowPurposes,
      onAcceptAll,
      onShowIntro,
      store,
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
      <div class={cx(popupStyle.content, popupStyle[layout])}>

        <div class={cx(style.container, style[`container-${layout}`])}>
          <div class={cx(style.base, style.extended)}>
            <span
              name="ctrl"
              class={style.iconDown}
              onClick={onShowIntro}
            />
            <Label
              localizeKey="footer.deviceInformationHeader"
              class={cx(style.headerMessage, 'primaryText')}
            />
          </div>

          <Purposes allPurposes={allPurposes} />
          <ConsentButtons
            className={style.infoFooter}
            onAcceptAll={onAcceptAll}
            onShowPurposes={onShowPurposes}
          />
        </div>
      </div>
    );
  }
}
