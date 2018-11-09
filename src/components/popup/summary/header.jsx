import { h } from 'preact';

import Label from '../../label/label';
import { Chevron } from '../../chevron/chevron';
import { Title } from '../../typography/title';
import { Row } from '../../layout/row';
import style from './summary.less';

export const Header = ({ onShowIntro }) => {
  return (
    <Row className={style.header}>
      <Chevron direction="down" onClick={onShowIntro} />
      <Title>
        <Label localizeKey="footer.deviceInformationHeader" />
      </Title>
    </Row>
  );
};
