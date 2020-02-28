import { h } from "preact";

import { Label } from "../../../label";
import { Link, LocalizedLink } from "../../../link";
import { Paragraph } from "../../../typography";

export const Description = ({
	naiUrl,
	daaUrl,
	edaaUrl,
	onShowPurposes,
	onSelectAllVendors
}) => {
	return (
		<div>
			<Paragraph id="vendorsDescription">
				<Label localizeKey="vendors.description" />
				<Link href={naiUrl} blank>
					NAI,
				</Link>
				<Link href={daaUrl} blank>
					{" "}
					DAA,{" "}
				</Link>
				<Label localizeKey="vendors.or" />
				<Link href={edaaUrl} blank>
					EDAA
				</Link>
				<Label localizeKey="vendors.sites" />
			</Paragraph>
			<Paragraph>
				<Label localizeKey="vendors.description2" />
				<LocalizedLink
					localizeKey="vendors.description2Link"
					onClick={onShowPurposes}
				/>
			</Paragraph>
			<Paragraph>
				<Label localizeKey="vendors.description3" />
				<LocalizedLink
					id="vendorsSelectAll"
					localizeKey="vendors.description3Link"
					onClick={onSelectAllVendors}
				/>
			</Paragraph>
		</div>
	);
};
