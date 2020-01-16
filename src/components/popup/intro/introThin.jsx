import { h, Component } from "preact";
import style from "./introThin.less";
import Button from "../../button/button";
import Label from "../../label/label";
import IntroFooterV2 from "./footerV2";

class LocalLabel extends Label {
	static defaultProps = {
		prefix: "intro"
	};
}

export default class IntroThin extends Component {
	static defaultProps = {};

	componentDidMount() {
		this.props.updateCSSPrefs();
	}

	render(props, state) {
		const {
			onAcceptAll,
			onShowPurposes,
			onClose,
			localization,
			store,
			updateCSSPrefs,
			config
		} = props;

		return (
			<div class={style.intro}>
				<div class={style.topWrapper}>
					<div class={style.textWrapper}>
						<div class={style.description + " primaryText"}>
							<LocalLabel
								providedValue={
									localization && localization.intro
										? localization.intro.description
										: ""
								}
								localizeKey="description"
								class={style.contentMessage}
							>
								Ads help us run this site. When you use our site selected
								companies may access and use information on your device for
								various purposes including to serve relevant ads or personalised
								content.
							</LocalLabel>
						</div>
					</div>
					<div class={style.options}>
						<Button class={style.acceptAll} onClick={onAcceptAll}>
							<LocalLabel
								providedValue={
									localization && localization.intro
										? localization.intro.acceptAll
										: ""
								}
								localizeKey="acceptAll"
							>
								Accept all
							</LocalLabel>
						</Button>
					</div>
				</div>
				<IntroFooterV2
					onShowPurposes={onShowPurposes}
					onAcceptAll={onAcceptAll}
					localization={localization}
					store={store}
					updateCSSPrefs={updateCSSPrefs}
					config={config}
				/>
			</div>
		);
	}
}
