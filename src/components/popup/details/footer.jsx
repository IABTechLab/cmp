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
            id="detailsShowVendors"
            localizeKey="details.showVendors"
            onClick={onShowVendorsClick}
          />
        )}
        <LocalizedLink
          id="detailsGoBack"
          localizeKey="details.back"
          onClick={onBackClick}
        />
      </Row>
      <Button name="detailsSave" onClick={onSaveClick}>
        <Label localizeKey="details.save" />
      </Button>
    </Row>
  </div>
);
