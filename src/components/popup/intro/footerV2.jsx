import { h, Component } from "preact";
import style from "./footerV2.less";
import Label from "../../label/label";
import Button from "../../button/button";

class LocalLabel extends Label {
	static defaultProps = {};
}

export default class IntroFooterV2 extends Component {
	static defaultProps = {};

	state = {
		showFull: false
	};

	handleShow = () => {
		this.setState(
			{
				showFull: !this.state.showFull
			},
			this.props.updateCSSPrefs
		);
	};

	componentDidUpdate() {
		this.props.updateCSSPrefs();
	}

	componentDidMount() {
		this.props.updateCSSPrefs();
	}

	render(props, state) {
		const { showFull } = this.state;

		const { localization, onShowPurposes, onAcceptAll, store, config } = props;

		let allPurposes = [];
		if (store.vendorList && store.vendorList.purposes) {
			allPurposes = allPurposes.concat(store.vendorList.purposes);
		}
		if (store.customPurposeList && store.customPurposeList.purposes) {
			allPurposes = allPurposes.concat(store.customPurposeList.purposes);
		}

		const { isThinConsentToolShowing } = store;

		return (
			<div class={style.footerV2}>
				{!showFull && (
					<div class={style.base + " " + style.collapsed + " " + style.wrapper}>
						<div style="display: flex; justify-content: space-between;">
							<span name="ctrl" class={style.icon} onClick={this.handleShow} />
							<LocalLabel
								providedValue={
									localization && localization.footer
										? localization.footer.message
										: ""
								}
								localizeKey="footer.message"
								class="primaryText"
							>
								Read more about access and use of information on your device for
								various purposes.
							</LocalLabel>
						</div>
						{isThinConsentToolShowing && (
							<Button
								name="introReject"
								class={style.rejectAll + " " + style.button}
								invert={true}
								onClick={onShowPurposes}
							>
								<LocalLabel
									providedValue={
										localization && localization.intro
											? localization.intro.showPurposes
											: ""
									}
									localizeKey="intro.showPurposes"
								>
									Learn more
								</LocalLabel>
							</Button>
						)}
					</div>
				)}
				{showFull && (
					<div class={style.container}>
						<div class={style.base + " " + style.extended}>
							<span
								name="ctrl"
								class={style.iconDown}
								onClick={this.handleShow}
							/>
							<LocalLabel
								providedValue={
									localization && localization.footer
										? localization.footer.deviceInformationHeader
										: ""
								}
								localizeKey="footer.deviceInformationHeader"
								class={style.headerMessage + " primaryText"}
							>
								Information that may be used
							</LocalLabel>
						</div>

						<div class={style.wrapper}>
							<div class={style.content}>
								<LocalLabel
									providedValue={
										localization && localization.footer
											? localization.footer.deviceInformationHeader
											: ""
									}
									localizeKey="footer.deviceInformationHeader"
									class={style.message2 + " primaryText"}
								>
									Information that may be used:
								</LocalLabel>
								<LocalLabel
									providedValue={
										localization && localization.footer
											? localization.footer.deviceInformation
											: ""
									}
									localizeKey="footer.deviceInformation"
									class={style.message + " primaryText"}
								>
									<ul>
										<li>Type of browser and its settings</li>
										<li>Information about the device's operating system</li>
										<li>Cookie information</li>
										<li>
											Information about other identifiers assigned to the device
										</li>
										<li>
											The IP address from which the device accesses a client's
											website or mobile application
										</li>
										<li>
											Information about the user's activity on that device,
											including web pages and mobile apps visited or used
										</li>
										<li>
											Information about the geographic location of the device
											when it accesses a website or mobile application
										</li>
									</ul>
								</LocalLabel>

								<LocalLabel
									providedValue={
										localization && localization.footer
											? localization.footer.purposesHeader
											: ""
									}
									localizeKey="footer.purposesHeader"
									class={style.message2 + " primaryText"}
								>
									Purposes for storing information:
								</LocalLabel>
								<ul>
									{allPurposes.map(purpose => {
										return <li class="primaryText">{purpose.name}</li>;
									})}
								</ul>
							</div>
							<div class={style.optionsWrapper}>
								<div class={style.infoFooter}>
									<Button
										name="footerReject"
										class={style.rejectAll + " " + style.button}
										invert={true}
										onClick={onShowPurposes}
									>
										<LocalLabel
											providedValue={
												localization && localization.intro
													? localization.intro.showPurposes
													: ""
											}
											localizeKey="intro.showPurposes"
										>
											Learn more
										</LocalLabel>
									</Button>
									<Button
										name="footerAccept"
										class={style.acceptAll + " " + style.button}
										onClick={onAcceptAll}
									>
										<LocalLabel
											providedValue={
												localization && localization.intro
													? localization.intro.acceptAll
													: ""
											}
											localizeKey="intro.acceptAll"
										>
											Accept all
										</LocalLabel>
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
