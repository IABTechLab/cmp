import { h } from 'preact';

import { Label } from '../label';
import { Chevron } from '../chevron';
import { Title } from '../typography';
import { Row } from '../layout';
import style from './popup.less';

export const Header = ({ titleKey, showChevron, onChevronClick }) => (
  <Row className={style.header}>
    {showChevron && <Chevron direction="down" onClick={onChevronClick} />}
    <Title>
      <Label localizeKey={titleKey} />
    </Title>
  </Row>
);
