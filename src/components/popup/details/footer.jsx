import { h, Component } from 'preact';
import Label from '../../label/label';
import Button from '../../button/button';
import { Row } from '../../layout/row';

import style from './details.less';

export const Footer = ({
  showVendorsLink,
  onShowVendorsClick,
  onSaveClick,
  onBackClick,
}) => {
  return (
    <Row className={style.footer}>
      <Row className={style.footerCta}>
        {showVendorsLink && (
          <a class={style.vendorLink} onClick={onShowVendorsClick}>
            <Label localizeKey="details.showVendors" />
          </a>
        )}
        <a class={style.cancel} onClick={onBackClick}>
          <Label localizeKey="details.back" />
        </a>
      </Row>
      <Button onClick={onSaveClick}>
        <Label localizeKey="details.save" />
      </Button>
    </Row>
  );
};
