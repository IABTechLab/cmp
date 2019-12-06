/* global browser,element,by */
const utils = require("./support/utils");

describe(utils.suiteTitle("Purposes page"), () => {
	beforeEach(() => {
		utils.clearCookies();
		browser.driver
			.manage()
			.window()
			.maximize();
		browser.waitForAngularEnabled(false);
		browser.get("/");
		browser.sleep(500);
		element(by.name("footerReject")).click();
	});

	it("should render the title correctly", () => {
		const el = element.all(by.css("[class*=title_title]")).first();
		expect(el.getText()).toContain("Privacy preferences");
	});

	it("should render the disclaimer", () => {
		const el = element(by.css("[class*=purposes_disclaimer]"));
		expect(el.getText()).toContain(
			"We and selected companies may access and use information " +
				"for the purposes outlined. You may customise your choice or continue using our site " +
				"if you are OK with the purposes. You can see the complete list of companies here."
		);
	});

	it("should correctly write cookies when users interact with the accept button", () => {
		element(by.name("detailsSave")).click();
		utils.getCookies().then(cookies => {
			expect(cookies.length).toEqual(2);
			for (let i in cookies) {
				const cookie = cookies[i];
				expect(["pubconsent", "euconsent"]).toContain(cookie.name);
				expect(cookie.domain).toEqual("localhost");
				expect(cookie.value).toMatch(/[\w\d\W]+/);
			}
		});
	});

	it("should show a show all companies link", () => {
		const el = element(by.id("detailsShowVendors"));
		expect(el.getText()).toContain("Show all companies");
	});

	it("should show a go back button", () => {
		const el = element(by.id("detailsGoBack"));
		expect(el.getText()).toContain("Back");
	});

	it("should show a submit button", () => {
		const el = element(by.name("detailsSave"));
		expect(el.getText()).toContain("SAVE & EXIT");
	});

	it("should display standard purposes correctly", () => {
		const purposeList = element(by.css("[class*=purposes_purposeList]"));

		expect(purposeList.getText()).toContain("Information storage and access");
		expect(purposeList.getText()).toContain("Measurement");
	});

	it("should display custom purposes correctly", () => {
		const purposeList = element(by.css("[class*=purposes_purposeList]"));

		expect(purposeList.getText()).toContain("Custom Purpose 1");
		expect(purposeList.getText()).toContain("Custom Purpose 2");
	});

	it("should display default selected purpose correctly", () => {
		const el = element(by.css("[class*=purposes_purposeDescription]"));
		expect(el.getText()).toContain(
			"The storage of information, or access to information that is already stored, on your device such as advertising identifiers, device identifiers, cookies, and similar technologies."
		);
		expect(el.getText()).not.toContain(
			"The collection and processing of information about your use of this site to subsequently personalize advertising for you in other contexts, i.e. on other sites or apps, over time. Typically, the content of the site or app is used to make inferences about your interests which inform future selections."
		);
	});

	it("should correctly handle click on a purpose", () => {
		let el = element(by.css("[class*=purposes_purposeDescription]"));
		expect(el.getText()).toContain(
			"The storage of information, or access to information that is already stored, on your device such as advertising identifiers, device identifiers, cookies, and similar technologies."
		);
		const purposes = element.all(by.css("[class*=purposes_purposeItem]"));
		purposes.get(1).click();
		element.all(by.css("[class*=purposes_purposeDescription]")).then(els => {
			expect(els[1].getText()).toContain(
				"The collection and processing of information about your use of this service to subsequently personalise advertising and/or content for you in other contexts, such as on other websites or apps, over time. Typically, the content of the site or app is used to make inferences about your interests, which inform future selection of advertising and/or content."
			);
			expect(els[1].getText()).not.toContain(
				"The storage of information, or access to information that is already stored, on your device such as advertising identifiers, device identifiers, cookies, and similar technologies."
			);
		});
		
	});

	it("should correctly handle toggling of a selected purpose", () => {
		const switchEl = element(by.css("[class*=switch_switch]"));
		const label = element(by.css("[class*=switch_label]"));

		// default state
		expect(switchEl.getAttribute("class")).toContain("switch_isSelected");
		expect(label.getText()).toContain("Active");

		switchEl.click();

		// state after click
		expect(switchEl.getAttribute("class")).not.toContain("switch_isSelected");
		expect(label.getText()).toContain("Inactive");
	});

	it("should correctly update cookie when a purpose is toggled", () => {
		element(by.name("detailsSave")).click();
		let vendorCookie1;
		utils.getCookies().then(firstCookies => {
			expect(firstCookies.length).toEqual(2);
			for (let i in firstCookies) {
				const cookie = firstCookies[i];
				if (cookie.name === "euconsent") vendorCookie1 = cookie.value;
			}

			utils.clearCookies();

			browser.get("/");
			browser.sleep(300);
			element(by.name("footerReject")).click();

			let vendorCookie2;
			const switchEl = element(by.css("[class*=switch_switch]"));
			switchEl.click();
			element(by.name("detailsSave")).click();
			utils.getCookies().then(secondCookies => {
				expect(secondCookies.length).toEqual(2);
				for (let i in secondCookies) {
					const cookie = secondCookies[i];
					if (cookie.name === "euconsent") vendorCookie2 = cookie.value;
					expect(["pubconsent", "euconsent"]).toContain(cookie.name);
					expect(cookie.domain).toEqual("localhost");
					expect(cookie.value).toMatch(/[\w\d\W]+/);
				}
				expect(vendorCookie1).not.toEqual(vendorCookie2);
			});
		});
	});

	it("should display companies for selected purpose when show companies link is clicked", () => {
		// By default table with vendors should be hidden
		expect(
			element(by.css("[class*=vendortable_vendorTable]")).isPresent()
		).toBe(false);

		element(by.id("purposeShowVendors")).click();

		// After clicking show companies link table with vendors should be visible
		expect(
			element(by.css("[class*=vendortable_vendorTable]")).isPresent()
		).toBe(true);
	});
});
