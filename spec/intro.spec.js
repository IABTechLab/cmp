/* global browser,element,by */
const utils = require("./support/utils");

describe(utils.suiteTitle("Intro page"), () => {
	beforeEach(() => {
		utils.clearCookies();
		browser.waitForAngularEnabled(false);
		browser.get("/");
		browser.sleep(500);
	});

	it("smoke test", () => {
		const url = browser.getCurrentUrl();
		expect(url).toEqual("http://localhost:8080/");
	});

	it("has a page title", () => {
		const el = element.all(by.css("[class^=CMP_title_title]")).first();
		browser.wait(protractor.ExpectedConditions.visibilityOf(el), 1000);
		expect(el.getText()).toContain("Thanks for visiting");
	});

	it("does not write a cookie when Learn More is clicked", () => {
		element(by.name("footerReject")).click();
		utils.getCookies().then(cookies => {
			expect(cookies.length).toEqual(0);
		});
	});

	it("writes a cookie when submitted", () => {
		element(by.name("footerAccept")).click();
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

	it("expands the language at the bottom when the caret icon is clicked", () => {
		element(by.name("ctrl")).click();

		const titleEl = element(by.css("[class*=title_title]"));
		expect(titleEl.getText()).toContain("Information that may be used:");

		const bodyEl = element(by.css("[class*=summary_content]"));
		expect(bodyEl.getText()).toContain(
			"Information about other identifiers assigned to the device"
		);
		expect(bodyEl.getText()).toContain("Type of browser and its settings");
	});
});
