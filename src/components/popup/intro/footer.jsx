import { h } from 'preact';

import { Label } from '../../label';
import { Row } from '../../layout';
import { Chevron } from '../../chevron';
import style from './intro.less';

export const Footer = ({ onShowSummary }) =>  (
  <Row className={style.footer}>
    <Chevron onClick={onShowSummary} />
    <Label localizeKey="footer.message" class="primaryText" />
  </Row>
);

