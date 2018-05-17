import { h, Component } from 'preact';
import style from './footer.less';
import Label from '../../label/label';
import Button from '../../button/button';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'footer'
	};
}

export default class IntroFooter extends Component {

    static defaultProps = {};

    state = {
		showFull: false
    };
    
    handleShow = () => {
        this.setState({
			showFull: !this.state.showFull
		});
    }
    render(props, state) {

        const { showFull } = this.state;

        const {
            localization,
            onShowPurposes,
            onAcceptAll
        } = props;
        
        return (
            <div>
                {!showFull && <div class={style.base}>
                    <span name="ctrl" class={style.icon} onClick={this.handleShow}></span>
                    <LocalLabel providedValue={localization && localization.footer ? localization.footer.message : ''} localizeKey='message' class={style.message}>Read more about access and use information on your device for various purposes</LocalLabel>

                </div>}
                {showFull && <div class={style.container}>
                    <div class={style.infoHeader}>
                        <span name="ctrl" class={style.iconDown} onClick={this.handleShow}></span>
                        <LocalLabel providedValue={localization && localization.footer ? localization.footer.message : ''} localizeKey='message' class={style.headerMessage}>Information that may be used</LocalLabel>
                    </div>

                    <div class={style.content}>
                    <LocalLabel providedValue={localization && localization.footer ? localization.footer.message : ''} localizeKey='message' class={style.message2}>Information that may be used:</LocalLabel>
                    <ul>
                        <li>Type of browser and its settings</li>
                        <li>Information about the device's operating system</li>
                        <li>Cookie information</li>
                        <li>Information about other identifiers assigned to the device</li>
                        <li>The IP address from which the device accesses a client's website or mobile application</li>
                        <li>Information about the user's activity on that device, including web pages and mobile apps visited or used</li>
                        <li>Information about the geographic location of the device when it accesses a website or mobile application</li>
                    </ul>

                    <LocalLabel providedValue={localization && localization.footer ? localization.footer.message : ''} localizeKey='message' class={style.message2}>Purposes for storing information:</LocalLabel>
                    <ul>
                        <li>Storage and access of information</li>
                        <li>Ad selection and delivery</li>
                        <li>Content selection and delivery</li>
                        <li>Personalization</li>
                        <li>Measurement</li>
                    </ul>
                    </div>

                    <div class={style.infoFooter}>
                        <Button
                            class={style.rejectAll}
                            invert={true}
                            onClick={onShowPurposes}
                        >
                            <LocalLabel providedValue={localization && localization.intro ? localization.intro.showPurposes : ''} localizeKey='showPurposes'>Learn more</LocalLabel>
                        </Button>
                        <Button
                            class={style.acceptAll}
                            onClick={onAcceptAll}
                        >
                            <LocalLabel providedValue={localization && localization.intro ? localization.intro.acceptAll : ''} localizeKey='acceptAll'>OK, Continue to site</LocalLabel>
                        </Button>
                    </div>
                </div>}
            </div>
        );
    };
}