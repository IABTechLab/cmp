import { h } from 'preact';

import Label from '../label/label';
import { Chevron } from '../chevron/chevron';
import { Title } from '../typography/title';
import { Row } from '../layout/row';
import style from './popup.less';

export const Header = ({ titleKey, showChevron, onChevronClick }) => {
  return (
    <Row className={style.header}>
      {showChevron && <Chevron direction="down" onClick={onChevronClick} />}
      <Title>
        <Label localizeKey={titleKey} />
      </Title>
    </Row>
  );
};
