import { h, Component } from 'preact';
import style from './app.less';
import { currentLocale } from '../lib/localize';

import PopupFooter from './popup/popupFooter';
import Popup from './popup/popup';
import Footer from './footer/footer';

export default class App extends Component {
	state = {
		store: this.props.store
	};

	elementsWithReplaceableCss = {
		// Tables
		"thead tr": {"background-color": this.props.config.css["color-table-background"]},
		"tr[class*=even]": {"background-color": this.props.config.css["color-table-background"]},

		// Purposes
		"div[class*=purposes_purposeItem]": {
			"background-color": this.props.config.css["color-secondary"],
			"color": this.props.config.css["color-text-secondary"]
		},
		"div[class*=selectedPurpose]": {
			"background-color": this.props.config.css["color-primary"],
			"color": this.props.config.css["color-background"],
		},

		// Footer
		"div[class*=footer_footer]": {
			"border-top": "3px solid " + this.props.config.css["color-border"],
			"background-color": this.props.config.css["color-background"]
		},
		"div[class*=footerV2_extended]": {"border-top": "3px solid " + this.props.config.css["color-border"]},
		"div[class*=footerV2_container]": {"background-color": this.props.config.css["color-background"]},
		"svg": {
			"background-color": this.props.config.css["color-background"],
			"fill": this.props.config.css["color-primary"]
		},

		// Vendors
		"[class*=active]": {"color": this.props.config.css["color-primary"]},

		// Application wide
		"div[name^=content]": {
			"box-shadow": "0 0 0 3px " + this.props.config.css["color-border"],
			"background-color": this.props.config.css["color-background"]
		},
		":not([name*=ctrl])": {
			"font-family": this.props.config.css["font-family"]
		},
		"[class*=primaryText]": {"color": this.props.config.css["color-text-primary"]},
		"[class*=secondaryText]": {"color": this.props.config.css["color-text-secondary"]},
		"a": {"color": this.props.config.css["color-linkColor"]},
		"span[class*=isSelected] [class*=visualizationGlow]": {"background-color": this.props.config.css["color-primary"]},
		"span[class*=isSelected] [class*=visualizationContainer]": {"background-color": this.props.config.css["color-primary"]},
		"[class*=button]": {
			"color": this.props.config.css["color-background"],
			"background-color": this.props.config.css["color-primary"],
		},
		"[class*=button_invert]": {
			"color": this.props.config.css["color-primary"],
			"border": "2px solid " + this.props.config.css["color-primary"],
			"background-color": this.props.config.css["color-background"]
		},
	};

	updateCSSPrefs = () => {
		const elems = this.elementsWithReplaceableCss;
		for(let elem in elems) {
			let cssRules = elems[elem];
			let selectedEls = document.querySelectorAll(elem) || [];
			selectedEls.forEach(function(currentEl) {
				for(let cssProp in cssRules) {
					currentEl.style[cssProp] = cssRules[cssProp];
				}
			})
		}
	};

	onSave = () => {
		const { store, notify } = this.props;
		store.persist();
		notify('onSubmit');
		store.toggleConsentToolShowing(false);
		store.toggleFooterShowing(true);
	};

	updateState = (store) => {
		this.setState({ store });
	};

	componentWillMount() {
		const { store, config } = this.props;
		store.subscribe(this.updateState);
	}

	componentDidMount() {
		const { store } = this.state;
		const { config } = this.props;

		if (config.css["custom-font-url"]) {
			let head = document.head;
			let link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = config.css["custom-font-url"];
			head.appendChild(link);
		}

		store.subscribe(this.updateCSSPrefs);
		this.updateCSSPrefs();
	}

	render(props, state) {
		const { store } = state;
		const { config } = props;
		const userLocalization = config.localization[currentLocale];

		return (
			<div class={style.gdpr}>
				<Popup
					store={store}
					localization={userLocalization}
					onSave={this.onSave}
					config={config}
					updateCSSPrefs={this.updateCSSPrefs}
				/>
				<PopupFooter
					store={store}
					localization={userLocalization}
					onSave={this.onSave}
					config={config}
					updateCSSPrefs={this.updateCSSPrefs}
				/>
				<Footer
					store={store}
					localization={userLocalization}
					config={config}
					updateCSSPrefs={this.updateCSSPrefs}
				/>
			</div>
		);
	}
}
