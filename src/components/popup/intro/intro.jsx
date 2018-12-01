import { h, Component } from 'preact';
import cx from 'classnames';

import { Label } from '../../label';
import { Title, Paragraph } from '../../typography';
import { ConsentButtons } from '../consentbuttons';
import { PopupContent } from '../popupcontent';
import { Footer } from './footer';
import style from './intro.less';

export class Intro extends Component {
  renderTitle() {
    const { config } = this.props;
    return (
      <Title alignment={config.layout === 'footer' && 'left'}>
        <Label localizeKey="intro.title" />
        {config && config.companyName && <span>{config.companyName}</span>}
      </Title>
    );
  }

  render(props) {
    const { onAcceptAll, onShowPurposes, onShowSummary, config } = props;

    return (
      <PopupContent layout={config.layout}>
        <div class={cx(style.container, style[`container-${config.layout}`])}>
          {config.logoUrl && <img class={style.logo} src={config.logoUrl} />}
          {config.layout === 'modal' && this.renderTitle()}
          <Paragraph
            alignment={config.layout === 'footer' ? 'left' : 'center'}
            class={style.description}
          >
            {config.layout === 'footer' && this.renderTitle()}
            <Label localizeKey="intro.description" />
          </Paragraph>
          <ConsentButtons
            layout={config.layout}
            className={style.btns}
            onAcceptAll={onAcceptAll}
            onShowPurposes={onShowPurposes}
          />
        </div>
        <Footer onShowSummary={onShowSummary} />
      </PopupContent>
    );
  }
}
