import { h, Component } from 'preact';
import style from './footer.less';
import Label from '../../label/label';
import Button from '../../button/button';

class LocalLabel extends Label {
    static defaultProps = {};
}

export default class IntroFooter extends Component {

    static defaultProps = {};

    state = {
        showFull: false
    };

    handleShow = () => {
        this.setState({
            showFull: !this.state.showFull
        }, this.props.updateCSSPrefs);
    }

    componentDidMount() {
        this.props.updateCSSPrefs();
    }

    render(props, state) {

        const { showFull } = this.state;

        const {
            localization,
            onShowPurposes,
            onAcceptAll,
            store
        } = props;

        return (
            <div cmp={true}>
                {!showFull &&
                    <div cmp={true} class={style.base + " " + style.collapsed} >
                        <span cmp={true} name="ctrl" class={style.icon} onClick={this.handleShow}></span>
                        <LocalLabel providedValue={localization && localization.footer ? localization.footer.message : ''} localizeKey='footer.message' class={style.message + " primaryText"}>Read more about access and use of information on your device for various purposes.</LocalLabel>
                    </div>}
                {showFull && <div cmp={true} class={style.container}>
                    <div cmp={true} class={style.base + " " + style.extended}>
                        <span cmp={true} name="ctrl" class={style.iconDown} onClick={this.handleShow}></span>
                        <LocalLabel providedValue={localization && localization.footer ? localization.footer.deviceInformationHeader : ''} localizeKey='footer.deviceInformationHeader' class={style.headerMessage + " primaryText"}>Information that may be used</LocalLabel>
                    </div>

                    <div cmp={true} class={style.content}>
                        <LocalLabel providedValue={localization && localization.footer ? localization.footer.deviceInformationHeader : ''} localizeKey='footer.deviceInformationHeader' class={style.message2 + " primaryText"}>Information that may be used:</LocalLabel>
                        <LocalLabel providedValue={localization && localization.footer ? localization.footer.deviceInformation : ''} localizeKey='footer.deviceInformation' class={style.message + " primaryText"}>
                            <ul cmp={true}>
                                <li cmp={true}>Type of browser and its settings</li>
                                <li cmp={true}>Information about the device's operating system</li>
                                <li cmp={true}>Cookie information</li>
                                <li cmp={true}>Information about other identifiers assigned to the device</li>
                                <li cmp={true}>The IP address from which the device accesses a client's website or mobile application</li>
                                <li cmp={true}>Information about the user's activity on that device, including web pages and mobile apps visited or used</li>
                                <li cmp={true}>Information about the geographic location of the device when it accesses a website or mobile application</li>
                            </ul>
                        </LocalLabel>
                        <LocalLabel providedValue={localization && localization.footer ? localization.footer.purposesHeader : ''} localizeKey='footer.purposesHeader' class={style.message2 + " primaryText"}>Purposes for storing information:</LocalLabel>
                        <ul cmp={true}>
                            {store && store.vendorList && store.vendorList.purposes && store.vendorList.purposes.map((purpose) => {
                                return <li class="primaryText">{purpose.name}</li>
                            })}
                        </ul>
                    </div>

                    <div cmp={true} class={style.infoFooter}>
                        <Button
                            cmp={true}
                            class={style.rejectAll}
                            invert={true}
                            onClick={onShowPurposes}
                        >
                            <LocalLabel providedValue={localization && localization.intro ? localization.intro.showPurposes : ''} localizeKey='intro.showPurposes'>Learn more</LocalLabel>
                        </Button>
                        <Button
                            cmp={true}
                            class={style.acceptAll}
                            onClick={onAcceptAll}
                        >
                            <LocalLabel providedValue={localization && localization.intro ? localization.intro.acceptAll : ''} localizeKey='intro.acceptAll'>OK, Continue to site</LocalLabel>
                        </Button>
                    </div>
                </div>}
            </div>
        );
    };
}
