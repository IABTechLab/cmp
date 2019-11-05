import "core-js/fn/array/reduce";
import "core-js/fn/array/fill";
import "core-js/fn/array/map";
import "core-js/fn/array/for-each";
import "core-js/fn/array/filter";
import "core-js/fn/array/from";

import { coreInit } from "./lib/core";
import { CMP_GLOBAL_NAME } from "./lib/cmp";
function start() {
	const { config } = window[CMP_GLOBAL_NAME] || {};
	console.log("Config:", config);
	coreInit({
		theme: {
			colorPrimary: "#0a82be",
			colorBorder: "#f7f7f7",
			colorTextPrimary: "#333333",
			titleTextColor: "#333333",
			titleFontSize: 25,
			colorLinkColor: "#0a82be",
			colorTableBackground: "#f7f7f7",
			buttonBackground: "#0a82be",
			buttonTextColor: "#ffffff",
			activeTabBackground: "#0a82be",
			activeTabTextColor: "#ffffff",
			inactiveTabBackground: "#eaeaea",
			inactiveTabTextColor: "#0a82be",
			fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
			customFontUrl:
				"https://fonts.googleapis.com/css?family=Noto+Sans&amp;subset=latin-ext"
		},

		variant: "A",
		localization: {
			cs: {
				intro: {
					title: "Vítejte u nás,",
					description:
						"údaje o tom, jak procházíte naše stránky a jaký obsah vás zajímá, nám pomáhají zlepšovat naše stávající služby a vyvíjet nové. Můžeme vám doporučovat obsah a zobrazovat reklamu na základě vašich zájmů a také vyhodnocovat úspěšnost jednotlivých služeb, obsahu nebo reklamy. K některým informacím mohou mít přístup i vybrané společnosti, které jsou našimi partnery. Váš souhlas může být použit i pro ostatní členy a partnery <a href='https://www.cpex.cz/cmp/#publishers' target='_blank'>sdružení CPEx</a> a jimi provozovanou <a href='https://www.cpex.cz/cmp/#domains' target='_blank'>skupinu webů</a>.",
					showPurposes: "Podrobné nastavení"
				},
				purposes: {
					disclaimer:
						"Členové a partneři <a href='https://www.cpex.cz/cmp/#publishers' target='_blank'>sdružení CPEx z.s.p.o.</a> a námi vybrané společnosti mohou mít přístup k uvedeným informacím a užívat je k účelům uvedeným níže. Váš výběr můžete upravit, nebo, pokud s těmito účely souhlasíte, pokračovat na stránku. Zde naleznete kompletní seznam námi vybraných ",
					disclaimerVendorLink: "společností třetích stran."
				},
				vendors: {
					description:
						"Vaše informace budou moci užívat pečlivě vybrané společnosti. V závislosti na určitých faktorech a typu dat, která budou shromažďovat, využívat a zpracovávat, budou od vás určité společnosti vyžadovat udělení souhlasu s nakládáním s těmito informacemi, zatímco jiné společnosti jej budou implicitně předpokládat a vyžadovat jen případný nesouhlas (opt-out). Pro zobrazení zásad ochrany osobních údajů jednotlivých společností můžete kliknout na název společnosti a upravit si příslušná nastavení. Pro opt-out, tedy zamítnutí souhlasu se zpracováním a uchováváním údajů společností Google nebo Facebook, klikněte na příslušný link v závorce (<a href='https://policies.google.com/privacy?hl=cs' target='_blank'>Google</a>, <a href='https://www.facebook.com/policies/cookies/' target='_blank'>Facebook</a>) nebo navštivte stránky ",
					offOn: "Povoleno"
				}
			}
		},

		publisher: "CPEx",
		sasEnabled: "false",
		sasInterval: 24,
		sasUrls: [
			"https://a.blesk.cz/cnc1/SETSV/TTL=33696000/consent=%CONSENT%/GDPR=1",
			"https://a.denik.cz/vlm/SETSV/TTL=33696000/consent=%CONSENT%/GDPR=1",
			"https://a.1gr.cz/mafra/SETSV/TTL=33696000/consent=%CONSENT%/GDPR=1",
			"https://a.centrum.cz/cent/SETSV/TTL=33696000/consent=%CONSENT%/GDPR=1",
			"https://a.csfd.cz/csfd/SETSV/TTL=33696000/consent=%CONSENT%/GDPR=1"
		],
		duplicateConsent: 0,
		storePublisherData: 0,
		storeConsentGlobally: 0,
		storePublisherConsentGlobally: 1,
		globalPublisherConsentLocation:
			"https://cdn.cpex.cz/cmp/general/portal.html",
		logging: 1,
		forceLocale: "cs",
		gdprAppliesGlobally: 1,
		repromptOptions: {
			fullConsentGiven: 360,
			someConsentGiven: 7,
			noConsentGiven: 21
		},
		geoIPVendor: "https://cdn.digitrust.mgr.consensu.org/1/geoip.json",
		testingMode: "normal",
		blockBrowsing: 1,
		layout: "modal",
		showFooterAfterSubmit: 1,
		digitrust: {
			redirects: 1
		},

		purposes: [
			{
				id: 1,
				name: "Ukládání a zpracování údajů",
				description:
					"Údaje ukládáme a zpětně přistupujeme k datům a informacím, které už jsou na vašem zařízení uloženy – např. reklamním identifikátorům, identifikátorům zařízení, souborům cookies a dalším podobným technologiím."
			},
			{
				id: 2,
				name: "Personalizace",
				description:
					"Shromažďujeme a zpracováváme informace o tom, jak naše služby používáte, a následně je využíváme pro personalizaci reklamy nebo obsahu. Tato data mohou být využita i na dalších webových stránkách a aplikacích, ať už našich, nebo našich smluvních partnerů. Údaje o obsahu webových stránek nebo aplikací, které navštěvujete, zpravidla využíváme pro odvození vašich zájmů, na jejichž základě vám následně zobrazujeme reklamu nebo doporučujeme obsah."
			},
			{
				id: 3,
				name: "Výběr, zobrazování a reporting reklamy",
				description:
					"Shromažďujeme informace o vašich zájmech, o reklamách, které jsme vám zobrazili, o frekvenci jejich zobrazení, času a místě a zda jste v souvislosti s danou reklamou provedli nějakou akci, například klik na reklamu nebo nákup, a slučujeme je s již dříve uloženými daty. To nám umožňuje lépe vybírat reklamu, kterou vám zobrazujeme, a následně vyhodnotit její účinnost. V této souvislosti nesledujeme údaje, na jejichž základě provádíme personalizaci obsahu nebo reklam v rámci ostatních webů, aplikací nebo služeb, ať už našich, nebo našich partnerů."
			},
			{
				id: 4,
				name: "Výběr, zobrazování a reporting obsahu",
				description:
					"Shromažďujeme informace o vašich zájmech, o obsahu, který jsme vám zobrazili, o frekvenci jeho zobrazení, času a místě jeho zobrazení a zda jste v souvislosti s daným obsahem provedli nějakou akci, například klik na odkaz, a slučujeme je s již dříve uloženými daty. To nám umožňuje lépe vybírat obsah, který vám zobrazujeme, a následně vyhodnotit jeho účinnost. V této souvislosti nesledujeme údaje, na jejichž základě provádíme personalizaci obsahu nebo reklam v rámci ostatních webů, aplikací nebo služeb, ať už našich, nebo našich partnerů."
			},
			{
				id: 5,
				name: "Měření",
				description:
					"Sledujeme informace o vašich zájmech, o obsahu, který jsme vám zobrazili, o frekvenci jeho zobrazení, času a místě jeho zobrazení a zda jste v souvislosti s daným obsahem provedli nějakou akci, například klik na odkaz, a slučujeme je s již dříve uloženými daty. Tyto informace slučujeme s daty, která o vašem chování máme z minulosti. Tyto informace nám umožňují změřit, jaká je úspěšnost obsahu, který vám zobrazujeme. V této souvislosti nesledujeme údaje, na jejichž základě provádíme personalizaci obsahu nebo reklam v rámci ostatních webů, aplikací nebo služeb, ať už našich, nebo našich partnerů."
			}
		],
		features: [
			{
				id: 1,
				name: "Párování off-line údajů",
				description:
					"slučujeme je s daty z off-line zdrojů, která jsme už získali dříve,"
			},
			{
				id: 2,
				name: "Propojování zařízení",
				description:
					"zpracováváme data, která umožňují vaši identifikaci napříč zařízeními, která používáte,"
			},
			{
				id: 3,
				name: "Údaje o přesné zeměpisné poloze",
				description:
					"v případě, že k tomuto účelu má třetí strana souhlas, zpracováváme data o vaší přesné zeměpisné poloze."
			}
		]
	});
}

start();
