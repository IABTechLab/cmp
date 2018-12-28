import { h } from 'preact';

import { Button } from '../../button';
import { Label } from '../../label';
import { Row } from '../../layout';
import { LocalizedLink } from '../../link';
import style from './details.less';
import { Divider } from '../../divider';

export const Footer = ({
  showVendorsLink,
  onShowVendorsClick,
  onSaveClick,
  onBackClick,
}) => (
  <div>
    <Divider />
    <Row className={style.footer}>
      <Row className={style.footerCta}>
        {showVendorsLink && (
          <LocalizedLink
            localizeKey="details.showVendors"
            onClick={onShowVendorsClick}
          />
        )}
        <LocalizedLink localizeKey="details.back" onClick={onBackClick} />
      </Row>
      <Button onClick={onSaveClick}>
        <Label localizeKey="details.save" />
      </Button>
    </Row>
  </div>
);
