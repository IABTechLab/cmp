import { h, Component } from 'preact';
import style from './footer.less';
import Label from '../../../label/label';
import cx from 'classnames';


export class FooterPurposes extends Component {
  render(props) {
    const {
      allPurposes
    } = props;

    return (
      <div class={style.content}>
        <Label
          localizeKey="footer.deviceInformationHeader"
          class={cx(style.subtitle, 'primaryText')}
        />
        <Label
          localizeKey="footer.deviceInformation"
          class={'primaryText'}
        />
        <Label
          localizeKey="footer.purposesHeader"
          class={cx(style.subtitle, 'primaryText')}
        />
        <ul>
          {allPurposes.map(purpose =>
            <li class="primaryText">{purpose.name}</li>
          )}
        </ul>
      </div>
    );
  }
}
