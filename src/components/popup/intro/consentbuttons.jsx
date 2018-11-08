import { h, Component } from 'preact';
import style from './footer/footer.less';
import Label from '../../label/label';
import Button from '../../button/button';

export class ConsentButtons extends Component {
  render(props) {
    const {
      onShowPurposes,
      onAcceptAll,
      className,
    } = props;

    return (
      <div class={className}>
        <Button
          name="footerReject"
          class={style.rejectAll}
          invert={true}
          onClick={onShowPurposes}
        >
          <Label localizeKey="intro.showPurposes" />
        </Button>
        <Button
          name="footerAccept"
          class={style.acceptAll}
          onClick={onAcceptAll}
        >
          <Label localizeKey="intro.acceptAll" />
        </Button>
      </div>
    );
  }
}
