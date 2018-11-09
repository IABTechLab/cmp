import { h } from 'preact';

import Label from '../../label/label';
import { Row } from '../../layout/row';
import { Chevron } from '../../chevron/chevron';
import style from './intro.less';

export const Footer = ({ onShowSummary }) => {
  return (
    <Row className={style.footer}>
      <Chevron onClick={onShowSummary} />
      <Label localizeKey="footer.message" class="primaryText" />
    </Row>
  );
};
