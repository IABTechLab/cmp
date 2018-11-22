import { h, Component } from 'preact';
import cx from 'classnames';

import popupStyle from '../popup.less';
import { Header } from '../header';
import style from './summary.less';
import { Purposes } from './purposes';
import { Footer } from './footer';

export class Summary extends Component {
  static defaultProps = {};

  componentDidMount() {
    this.props.updateCSSPrefs();
  }

  componentDidUpdate() {
    this.props.updateCSSPrefs();
  }

  render(props) {
    const { onShowPurposes, onAcceptAll, onShowIntro, store, layout } = props;

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
          <Header
            showChevron
            onChevronClick={onShowIntro}
            titleKey="footer.deviceInformationHeader"
          />
          <Purposes allPurposes={allPurposes} />
          <Footer onShowPurposes={onShowPurposes} onAcceptAll={onAcceptAll} />
        </div>
      </div>
    );
  }
}
