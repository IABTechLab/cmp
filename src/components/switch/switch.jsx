import { h, Component } from 'preact';
import style from './switch.less';

export default class Switch extends Component {

	static defaultProps = {
		onClick: () => {},
	};

	handleClicked = () => {
		const { onClick, dataId, isSelected } = this.props;
		onClick({dataId, isSelected: !isSelected});
	};

	shouldComponentUpdate(nextProps) {
		return nextProps.isSelected !== this.props.isSelected;
	};

	render(props) {
		const {
			isSelected,
			isDisabled,
			color
		} = props;

		return (
			<span
				cmp={true}
				class={[style.switch, props.class, isSelected ? style.isSelected : ''].join(' ')}
				onClick={this.handleClicked}
			>
				<input
					cmp={true}
					checked={isSelected}
					className={style.native}
					disabled={isDisabled}
					type='checkbox'
				/>
				<span cmp={true} class={style.visualizationContainer} style={{backgroundColor: isSelected ? color : null}} />
				<span cmp={true} class={style.visualizationGlow} style={{backgroundColor: color}} />
				<span cmp={true} class={style.visualizationHandle} />
			</span>
		);
	}
}
