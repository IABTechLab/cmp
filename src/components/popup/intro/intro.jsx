import { h, Component } from 'preact';
import style from './intro.less';
import Button from '../../button/button';
import Label from '../../label/label';
import Popover from '../../popover/popover';

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'intro'
	};
}

const HOST_PARTS = ((window && window.location && window.location.hostname) || '').split('.');

export default class Intro extends Component {

	static defaultProps = {};

	render(props, state) {

		const {
			onAcceptAll,
			onShowPurposes,
			onClose,
			localization
		} = props;

		return (
			<div class={style.intro}>
				<div class={style.title}>
					<LocalLabel providedValue={localization && localization.intro ? localization.intro.title : ''} localizeKey='title'>Thanks for visiting </LocalLabel>
					<LocalLabel providedValue={localization && localization.intro ? localization.intro.domain : ''} localizeKey='domain'></LocalLabel>
				</div>
				<div class={style.description}>
					<LocalLabel providedValue={localization && localization.intro ? localization.intro.description : ''} localizeKey='description'>Ads help us run this site. When you use our site selected companies may access and use </LocalLabel>
					<Popover
						inlineContent={localization && localization.intro ? localization.intro.deviceInformation : ''}
						inlineLocalizeKey='intro.deviceInformation'
						popoverContent={localization && localization.intro ? localization.intro.deviceInformationPopover : ''}
						popoverLocalizeKey='intro.deviceInformationPopover'
					/>
					<LocalLabel providedValue={localization && localization.intro ? localization.intro.description2 : ''} localizeKey='description2'>for various </LocalLabel>
					<Popover
						inlineContent={localization && localization.intro ? localization.intro.purposes : ''}
						inlineLocalizeKey='intro.purposes'
						popoverContent={localization && localization.intro ? localization.intro.purposesPopover : ''}
						popoverLocalizeKey='intro.purposesPopover'
					/>
					<LocalLabel providedValue={localization && localization.intro ? localization.intro.description3 : ''} localizeKey='description3'> including to serve relevant ads or personalised content.</LocalLabel>
				</div>
				<div class={style.options}>
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
			</div>
		);
	}
}
