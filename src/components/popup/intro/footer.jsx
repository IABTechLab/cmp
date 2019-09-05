import { h } from "preact";

import { Divider } from "../../divider";
import { Label } from "../../label";
import { Text } from "../../typography";
import { Row } from "../../layout";
import { Chevron } from "../../chevron";
import style from "./intro.less";

export const Footer = ({ onShowSummary }) => (
	<div>
		<Divider />
		<Row className={style.footer}>
			<Chevron onClick={onShowSummary} />
			<Label is={Text} localizeKey="footer.message" class="primaryText" />
		</Row>
	</div>
);
