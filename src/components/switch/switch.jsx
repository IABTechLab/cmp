import { h, Component } from 'preact';
import PropTypes from 'prop-types';

import { Label } from '../label';
import style from './switch.less';

export default class Switch extends Component {
  static defaultProps = {
    onClick: () => {},
    displayLabel: false,
  };

	static defaultProps = {
		onClick: () => {},
	};

	handleClicked = () => {
		const { onClick, dataId, isSelected, currentPurposeIndex } = this.props;
		onClick({dataId, isSelected: !isSelected, currentPurposeIndex});
	};

  render(props) {
    const { isSelected, isDisabled, color, displayLabel } = props;
    const { theme } = this.context;
    const switchLabelKey = isSelected ? 'active' : 'inactive';

    return (
      <div>
        <span
          class={[
            style.switch,
            props.class,
            isSelected ? style.isSelected : '',
          ].join(' ')}
          onClick={this.handleClicked}
        >
          <input
            checked={isSelected}
            className={style.native}
            disabled={isDisabled}
            type="checkbox"
          />
          <span
            class={style.visualizationContainer}
            style={{ backgroundColor: isSelected ? theme.colorPrimary : null }}
          />
          <span
            class={style.visualizationGlow}
            style={{ backgroundColor: theme.colorPrimary }}
          />
          <span class={style.visualizationHandle} />
        </span>
        {displayLabel && (
          <Label
            style={{ color: theme.colorPrimary, fontFamily: theme.fontFamily }}
            class={style.label}
            localizeKey={`purposes.${switchLabelKey}`}
          />
        )}
      </div>
    );
  }
}

Switch.contextTypes = {
  theme: PropTypes.object.isRequired,
};
