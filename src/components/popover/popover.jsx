import { h, Component } from 'preact';
import Label from '../label/label';
import style from './popover.less';

export default class Popover extends Component {
  state = {
    show: false
  };

  static defaultProps = {
    content: ''
  };

  mouseEnter = () => {
    this.setState({show: true});
  }

  mouseLeave = () => {
    this.setState({show: false});
  }

  handleClick = () => {
    this.setState({show: !this.state.show});
  }

  render(props, state) {
    const {
      inlineContent,
      inlineLocalizeKey,
      popoverContent,
      popoverLocalizeKey
    } = props;

    const {
      show
    } = state;

    return (
      <span>
        <a
          cmp={true}
          onClick={this.handleClick}
          // onMouseEnter={this.mouseEnter}
          // onMouseLeave={this.mouseLeave}
        >
          <Label providedValue={inlineContent} localizeKey={inlineLocalizeKey}>{inlineContent}</Label>
        </a>
        {show &&
          <div cmp={true} class={style.popover}>
            <Label providedValue={popoverContent} localizeKey={popoverLocalizeKey}>{popoverLocalizeKey}</Label>
          </div>
        }
      </span>
    );
  }
}
