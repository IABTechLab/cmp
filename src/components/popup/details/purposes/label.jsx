  
import { h, createRef, Component } from 'preact';
import style from './purposes.less';
import Label from '../../../label/label';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
};

export default class ItemLabel extends Component {
    state = {
        isSelected: false,
        selectedPurpose: this.props.index
    }

    componentDidUpdate() {
		this.props.updateCSSPrefs();
	}

	componentDidMount() {
		this.props.updateCSSPrefs();
	};

    handleSelectPurposeDetail = index => {
        this.setState({isSelected: !this.state.isSelected, selectedPurpose: index}, () => {
            this.props.handleSelectPurposeDetail(index)();
        });
    };
    
	render(props, state) { 
        const { index, purpose, purposes, selectedPurposeIndex } = props;
        let { isSelected, selectedPurpose } = state;

        const ref = createRef();
        const handleClick = () => {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            this.handleSelectPurposeDetail(index);
        }

        let selectedPurposeView = window.outerWidth >= 812 ? 
            (selectedPurpose === selectedPurposeIndex ? style.selectedPurpose : '') : 
            (isSelected ? style.selectedPurpose : '');

        return (
            <div class={[style.purposeItem, selectedPurposeView].join(' ')} >
                <input type="checkbox" id={`collapsible${index}`} name="purposeSelection"/>
                <label class={style.labelWrapper} for={`collapsible${index}`} ref={ref} onClick={handleClick}>
                    <LocalLabel localizeKey={`${index >= purposes.length ? 'customPurpose' : 'purpose'}${purpose.id}.menu`}>{purpose.name}</LocalLabel>
                </label>
                <div class={style.collapsibleContent}>
                    <div class={style.contentInner}>
                        {props.children}
                    </div>
                </div>
            </div>
        );
    }
};