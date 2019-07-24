/**
 * The default set of translated pieces of text indexed by locale.
 * Values from window.__cmp.config.localization will override these
 * per locale.  Empty values will use the english value provided
 * inline in each component.
 */
module.exports = {
  en: {
    intro: {
      title: 'Thanks for visiting',
      domain: '',

      // Next three properties are part od one continuous message
      description: 'Ads help us run this site. When you use our site',
      // TODO translate PROJ-93
      directVendorsLink: 'selected companies',
      description_part_2:
        'may access and use information on your device for various purposes including to serve relevant ads or personalised content.',

      deviceInformationPopover: `
        <strong>Information that may be used:</strong>
        <ul>
          <li>Type of browser and its settings</li>
          <li>Information about the device's operating system</li>
          <li>Cookie information</li>
          <li>Information about other identifiers assigned to the device</li>
          <li>The IP address from which the device accesses a client's website or mobile application</li>
          <li>Information about the user's activity on that device, including web pages and mobile apps visited or used</li>
          <li>Information about the geographic location of the device when it accesses a website or mobile application</li>
        </ul>
      `,
      acceptAll: 'Accept all',
      showPurposes: 'Learn more',
    },
    details: {
      title: 'Privacy preferences',
      back: 'Back',
      save: 'OK, Continue to site',
      showVendors: 'Show all companies',
      enableAll: 'Enable all',
      disableAll: 'Disable all',
    },
    purposes: {
      active: 'Active',
      inactive: 'Inactive',
      disclaimer:
        'We and selected companies may access and use information for the purposes outlined. You may customise your choice or continue using our site if you are OK with the purposes. You can see the ',
      disclaimerVendorLink: 'complete list of companies here.',
      showVendors: 'Show companies',
      hideVendors: 'Hide companies',
      featureHeader: 'This will include the following features:',
      company: 'Company',
      switchText:
        'Publisher and their partners could collect anonymized information in order to improve your experience on our site.',
      consentScopeCurrent: 'Current site',
      consentScopeAll: 'All sites',
      consentScopeHint: 'I am giving consent to:',
    },
    vendors: {
      company: 'Company',
      offOn: 'Allow',
      description:
        'Companies carefully selected by us will use your information. Depending on the type of data they collect, use, process and other factors, certain companies rely on your consent while others require you to opt-out. For information on each partner and to exercise your choices, see below. Or to opt-out, visit the ',
      or: 'or ',
      sites: ' sites.',
      description2: 'Customise how these companies use data on the ',
      description2Link: 'previous page.',
      description3: 'You can control the preferences for all companies by ',
      description3Link: 'clicking here.',
    },
    footer: {
      message:
        'Read more about access and use of information on your device for various purposes.',
      closedMessage:
        'A reminder you can control your user privacy preferences ',
      closedMessageLink: 'here',
      deviceInformationHeader: 'Information that may be used:',
      deviceInformation: `
        <ul>
          <li>Type of browser and its settings</li>
          <li>Information about the device's operating system</li>
          <li>Cookie information</li>
          <li>Information about other identifiers assigned to the device</li>
          <li>The IP address from which the device accesses a client's website or mobile application</li>
          <li>Information about the user's activity on that device, including web pages and mobile apps visited or used</li>
          <li>Information about the geographic location of the device when it accesses a website or mobile application</li>
        </ul>
      `,
      purposesHeader: 'Purposes for storing information:',
      directVendorsLink: 'HELLJOOOO',
    },
  },
  es: {
    intro: {
      title: 'Gracias por su visita ',
      domain: '',
      description:
        'Los anuncios nos ayudan a que esta aplicación funcione. Cuando utiliza nuestra aplicación, empresas seleccionadas pueden acceder y usar información en su dispositivo para diversos fines incluso para publicar anuncios relevantes o contenido personalizado.',
      // TODO translate PROJ-93
      directVendorsLink: 'directVendorsLink es',
      description_part_2: 'rest of the message es',

      deviceInformationPopover: `
        <strong>Información que puede ser utilizada:</strong>
        <ul>
          <li>Tipo de navegador y su configuración</li>
          <li>Información sobre el sistema operativo del dispositivo</li>
          <li>Información de cookies</li>
          <li>Información sobre otros identificadores asignados al dispositivo</li>
          <li>La dirección IP desde la cual el dispositivo accede al sitio web o aplicación móvil de un cliente</li>
          <li>Información sobre la actividad del usuario en ese dispositivo, incluidas las páginas web y las aplicaciones móviles visitadas o utilizadas</li>
          <li>Información sobre la ubicación geográfica del dispositivo cuando accede a un sitio web o aplicación móvil</li>
        </ul>
      `,
      purposesPopover: `
        <strong>Propósitos para almacenar información:</strong>
        <ul>
          <li>Almacenamiento y acceso a la información</li>
          <li>Selección y entrega de anuncios</li>
          <li>Selección y entrega de contenido</li>
          <li>Personalización</li>
          <li>Medida</li>
        </ul>
      `,
      acceptAll: 'OK, continuar a la página',
      showPurposes: 'Conozca más',
    },
    details: {
      title: 'Preferencias de privacidad',
      back: 'Regresar',
      save: 'OK, continuar a la página',
      showVendors: 'Mostrar empresas',
      enableAll: 'Habilitar todo',
      disableAll: 'Deshabilitar todo',
    },
    purposes: {
      active: 'Permitir',
      inactive: 'Rechazar',
      disclaimer:
        'Nosotros y algunas empresas seleccionadas podemos acceder y usar la información para los fines descritos. Puede personalizar su elección o continuar usando nuestra aplicación si está de acuerdo con los propósitos. Puede ver la ',
      disclaimerVendorLink: 'lista completa de compañías aquí.',
      showVendors: 'Mostrar empresas',
      hideVendors: 'Esconder empresas',
      featureHeader: 'Esto incluirá las siguientes características:',
      company: 'Empresa',
      switchText: '',
    },
    vendors: {
      company: 'Empresa',
      offOn: 'Permitir',
      description:
        'Las empresas cuidadosamente seleccionadas por nosotros utilizarán su información. Dependiendo del tipo de datos que recopilan, usan, procesan y de otros factores, ciertas compañías confían en su consentimiento, mientras que otras requieren que se excluya. Puede hacer clic en el nombre de la compañía para ver su política de privacidad y ejercer sus opciones de consentimiento a continuación. Para excluir, visite los sitios de ',
      or: 'o ',
      sites: '.',
      description2: 'Personalice cómo estas empresas usan los datos en la ',
      description2Link: 'página anterior.',
      description3: '',
      description3Link: '',
    },
    footer: {
      message: '',
      closedMessage: '',
      closedMessageLink: '',
      deviceInformationHeader: 'Información que puede ser utilizada:',
      deviceInformation: `
        <ul>
          <li>Tipo de navegador y su configuración</li>
          <li>Información sobre el sistema operativo del dispositivo</li>
          <li>Información de cookies</li>
          <li>Información sobre otros identificadores asignados al dispositivo</li>
          <li>La dirección IP desde la cual el dispositivo accede al sitio web o aplicación móvil de un cliente</li>
          <li>Información sobre la actividad del usuario en ese dispositivo, incluidas las páginas web y las aplicaciones móviles visitadas o utilizadas</li>
          <li>Información sobre la ubicación geográfica del dispositivo cuando accede a un sitio web o aplicación móvil</li>
        </ul>
      `,
      purposesHeader: 'Propósitos para almacenar información:',
    },
  },
  de: {
    intro: {
      title: 'Danke für Ihren Besuch ',
      domain: '',
      description:
        'Mit Hilfe von Anzeigen können wir diese App ausführen. Wenn Sie unsere App besuchen/verwenden, können ausgewählte Unternehmen auf Ihrem Gerät Informationen für verschiedene Zwecke abrufen und verwenden, einschließlich um die relevanten Anzeigen oder personalisierten Inhalt anzuzeigen.',
      // TODO translate PROJ-93
      directVendorsLink: 'directVendorsLink de',
      description_part_2: 'rest of the message de',

      deviceInformationPopover: `
        <strong>Informationen, die verwendet werden können:</strong>
        <ul>
          <li>Browser und seine Einstellungen</li>
          <li>Informationen zum Betriebssystem des Geräts</li>
          <li>Cookie-Informationen</li>
          <li>Informationen zu anderen Kennungen, die dem Gerät zugewiesen sind</li>
          <li>Die IP-Adresse, von der das Gerät auf die Website oder die mobile Anwendung eines Kunden zugreift</li>
          <li>Informationen zu den Aktivitäten auf dem Gerät, welche Webseiten und mobilen Apps der Benutzer besucht oder verwendet hat</li>
          <li>Informationen zum Geo Location des Geräts beim Zugriff auf eine Website oder eine mobile Anwendung</li>
        </ul>
      `,
      purposesPopover: `
        <strong>Zwecke zum Speichern von Informationen:</strong>
        <ul>
          <li>Speicherung und Zugriff auf Informationen</li>
          <li>Anzeigenauswahl und Lieferung</li>
          <li>Inhaltsauswahl und Lieferung</li>
          <li>Personalisierung</li>
          <li>Messung</li>
        </ul>
      `,
      acceptAll: 'OK, Weiter zur Website',
      showPurposes: 'Erfahren Sie mehr',
    },
    details: {
      title: 'Datenschutzeinstellungen',
      back: 'Zurück',
      save: 'OK, Weiter zur Website',
      showVendors: 'Firmen zeigen',
      enableAll: 'Alle aktivieren',
      disableAll: 'Alle deaktivieren',
    },
    purposes: {
      active: 'Aktivieren',
      inactive: 'Deaktivieren',
      disclaimer:
        'Wir und ausgewählte Unternehmen können Informationen für die beschriebenen Zwecke abrufen und nutzen. Sie können Ihre Wahl anpassen oder unsere App weiter verwenden, wenn Sie mit den Zwecken einverstanden sind. Sie können die ',
      disclaimerVendorLink: 'vollständige Liste der Unternehmen hier sehen.',
      showVendors: 'Firmen zeigen',
      hideVendors: 'Firmen ausblenden',
      featureHeader: 'Dies beinhaltet die folgenden Funktionen:',
      company: 'Firmen',
      switchText: '',
    },
    vendors: {
      company: 'Firmen',
      offOn: 'Aktivieren',
      description:
        'Unternehmen, die von uns sorgfältig ausgewählt wurden, werden Ihre Informationen verwenden. Je nach der Art der Daten, die sie sammeln, nutzen, verarbeiten und anderen Faktoren, verlassen sich bestimmte Unternehmen auf Ihre Zustimmung, während andere erfordern, dass Sie sich abmelden. Sie können auf den Firmennamen klicken, um ihre Datenschutzrichtlinie einzusehen und die unten stehenden Einwilligungen zu treffen. Wenn Sie sich abmelden möchten, besuchen Sie die ',
      or: 'oder ',
      sites: ' Seiten.',
      description2:
        'Können Sie anpassen, wie diese Unternehmen Daten verwenden ',
      description2Link: 'Auf der vorherigen Seite.',
      description3: '',
      description3Link: '',
    },
    footer: {
      message: '',
      closedMessage: '',
      closedMessageLink: '',
      deviceInformationHeader: 'Informationen, die verwendet werden können:',
      deviceInformation: `
        <ul>
          <li>Browser und seine Einstellungen</li>
          <li>Informationen zum Betriebssystem des Geräts</li>
          <li>Cookie-Informationen</li>
          <li>Informationen zu anderen Kennungen, die dem Gerät zugewiesen sind</li>
          <li>Die IP-Adresse, von der das Gerät auf die Website oder die mobile Anwendung eines Kunden zugreift</li>
          <li>Informationen zu den Aktivitäten auf dem Gerät, welche Webseiten und mobilen Apps der Benutzer besucht oder verwendet hat</li>
          <li>Informationen zum Geo Location des Geräts beim Zugriff auf eine Website oder eine mobile Anwendung</li>
        </ul>
      `,
      purposesHeader: 'Zwecke zum Speichern von Informationen:',
    },
  },
  pl: {
    intro: {
      title: 'Dziękujemy za wizytę ',
      domain: '',
      description:
        'Reklamy pomagają uruchomić tę aplikację. Podczas korzystania z naszej aplikacji, wybrane firmy mogą uzyskiwać dostęp do informacji o urządzeniu i korzystać z nich w różnych celach, w tym do wyświetlania trafnych reklam lub spersonalizowanych treści.',

      // TODO translate PROJ-93
      directVendorsLink: 'directVendorsLink pl',
      description_part_2: 'rest of the message pl',

      deviceInformationPopover: `
        <strong>Informacja, którą można wykorzystać:</strong>
        <ul>
          <li>Typ przeglądarki i jej ustawienia</li>
          <li>Informacja o systemie operacyjnym urządzenia</li>
          <li>Informacja o plikach cookie</li>
          <li>Informacja o innych identyfikatorach przydzielonych do urządzenia</li>
          <li>Adres IP, z którego urządzenie uzyskuje dostęp do strony internetowej klienta lub aplikacji mobilnej</li>
          <li>Informacja o aktywności użytkownika na tym urządzeniu - w tym odwiedzanych stronach internetowych i aplikacjach mobilnych</li>
          <li>Informacja o położeniu geograficznym urządzenia, gdy uzyskuje dostęp do strony internetowej lub aplikacji mobilnej</li>
        </ul>
      `,
      purposesPopover: `
        <strong>Cele przechowywania informacji:</strong>
        <ul>
          <li>Przechowywanie i dostęp do informacji</li>
          <li>Wybór i emitowanie reklamy</li>
          <li>Wybór treści i emitowanie</li>
          <li>Personalizacja</li>
          <li>Pomiar</li>
        </ul>
      `,
      acceptAll: 'Przejdź do strony',
      showPurposes: 'Więcej',
    },
    details: {
      title: 'Preferencje prywatności',
      back: 'Wstecz',
      save: 'Przejdź do strony',
      showVendors: 'Pokaż firmy',
      enableAll: 'Pozwól wszystkim',
      disableAll: 'Zakazać wszystkich',
    },
    purposes: {
      active: 'Włącz',
      inactive: 'Wyłącz',
      disclaimer:
        'Zarówno my, jak i wybrane firmy możemy uzyskać dostęp do informacji i korzystać z nich w określonych celach. Możesz dostosować swój wybór lub kontynuować korzystanie z naszej aplikacji, jeżeli zgadzasz się z celami. ',
      disclaimerVendorLink: 'Pełną listę firm można zobaczyć tutaj.',
      showVendors: 'Pokaż firmy',
      hideVendors: 'Ukryj firmy',
      featureHeader: 'Obejmie to następujące funkcje:',
      company: 'Firmy',
      switchText: '',
    },
    vendors: {
      company: 'Firmy',
      offOn: 'Włącz',
      description:
        'Starannie wybrane przez nas firmy wykorzystają Państwa dane. W zależności od rodzaju gromadzonych danych, użycia procesów i innych czynników niektóre firmy wymagają Twojej zgody, a inne wymagają rezygnacji. Możesz kliknąć na nazwę firmy, aby zapoznać się z jej polityką prywatności i skorzystać z możliwości wyrażenia zgody poniżej. Aby zrezygnować, odwiedź strony ',
      or: 'lub ',
      sites: '.',
      description2: 'Dostosuj sposób, w jaki te firmy wykorzystują dane na ',
      description2Link: 'poprzedniej stronie.',
      description3: '',
      description3Link: '',
    },
    footer: {
      message: '',
      closedMessage: '',
      closedMessageLink: '',
      deviceInformationHeader: 'Informacja, którą można wykorzystać:',
      deviceInformation: `
        <ul>
          <li>Typ przeglądarki i jej ustawienia</li>
          <li>Informacja o systemie operacyjnym urządzenia</li>
          <li>Informacja o plikach cookie</li>
          <li>Informacja o innych identyfikatorach przydzielonych do urządzenia</li>
          <li>Adres IP, z którego urządzenie uzyskuje dostęp do strony internetowej klienta lub aplikacji mobilnej</li>
          <li>Informacja o aktywności użytkownika na tym urządzeniu - w tym odwiedzanych stronach internetowych i aplikacjach mobilnych</li>
          <li>Informacja o położeniu geograficznym urządzenia, gdy uzyskuje dostęp do strony internetowej lub aplikacji mobilnej</li>
        </ul>
      `,
      purposesHeader: 'Cele przechowywania informacji:',
    },
  },
  lt: {
    intro: {
      title: 'Dėkojame už apsilankymą ',
      domain: '',
      description:
        'Skelbimai padeda mums palaikyti šį tinklalapį. Kai jūs naudojates mūsų tinklalapiu, kai kurios pasirinktos įmonės gali turėti prieigą prie informacijos, saugomos jūsų įrenginyje, ir ją naudoti įvairiems tikslams, įskaitant pritaikymą reklamoje arba indivizualizuotame turinyje.',

      // TODO translate PROJ-93
      directVendorsLink: 'directVendorsLink es',
      description_part_2: 'rest of the message es',

      deviceInformationPopover: `
        <strong>Informacija, kuri gali būti naudojama:</strong>
        <ul>
          <li>Naršyklės tipas ir jos nustatymai</li>
          <li>Informacija apie įrenginio operacinę sistemą</li>
          <li>Informacija apie slapukus</li>
          <li>Informacija apie kitus įrenginiui priskirtus identifikatorius</li>
          <li>IP addresas, iš kurio įrenginys prisijungia prie kliento tinklalapio arba mobilios programėlės</li>
          <li>Informacija apie vartotojo veiksmus, atliekamus naudojantis šiuo įrenginiu, įskaitant jo lankomus tinklalapius ir naudojamas mobilias programėles</li>
          <li>Informacija apie geografinę prietaiso buvimo vietą, kai įrenginys prisijungia prie svetainės arba mobilios programėlės</li>
        </ul>
      `,
      purposesPopover: `
        <strong>Informacijos saugojimo paskirtys:</strong>
        <ul>
          <li>Informacijos saugojimas ir prieiga prie informacijos</li>
          <li>Reklamos parinkimas ir paleidimas</li>
          <li>Turinio pasirinkimas ir pristatymas</li>
          <li>Individualizavimas</li>
          <li>Matavimai</li>
        </ul>
      `,
      acceptAll: 'Gerai, pereiti prie svetainės',
      showPurposes: 'Sužinoti daugiau',
    },
    details: {
      title: 'Privatumo nuostatos',
      back: 'Atgal',
      save: 'Paleisk',
      showVendors: 'Rodyti įmones',
      enableAll: 'Įjungti visus',
      disableAll: 'Išjungti visus',
    },
    purposes: {
      active: 'Aktyvus',
      inactive: 'Neaktyvus',
      disclaimer:
        'Mes, kaip ir kitos pasirinktos įmonės, galime turėti prieigą prie informacijos ir naudoti ją išvardintiems tikslams. Jūs galite koreguoti savo pasirinkimą arba ir toliau naudotis mūsų tinklalapiu, jeigu sutinkate su informacijos panaudojimo tikslais. ',
      disclaimerVendorLink: 'Visą pasirinktų įmonių sąrašą galite rasti čia.',
      showVendors: 'Rodyti įmones',
      hideVendors: 'Paslėpti įmones',
      featureHeader: 'Apima šias funkcijas:',
      company: 'įmonė',
      switchText: '',
    },
    vendors: {
      company: 'įmonė',
      offOn: 'Leisti',
      description:
        'Mūsų kruopščiai atrinktos įmonės naudosis jūsų informacija. Priklausomai nuo renkamų duomenų tipo, panaudojimo, apdirbimo ir kitų veiksnių, kai kurios konkrečios įmonės remiasi jūsų sutikimu, o kitos reikalauja atsisakyti privatumo politikos, jeigu nesutinkate su privatumo nuostatomis. Jūs galite paspausti ant įmonės pavadinimo, norėdami peržiūrėti jos privatumo politiką ir sutikti su ja/atsisakyti jos. Norėdami atsisakyti, apsilankykite šiuose tinklalapiuose: ',
      or: 'arba ',
      sites: '.',
      description2:
        'Galite pasirinkti kaip šios įmonės galės naudotis jūsų duomenimis ',
      description2Link: 'ankstesniame puslapyje.',
      description3: '',
      description3Link: '',
    },
    footer: {
      message: '',
      closedMessage: '',
      closedMessageLink: '',
      deviceInformationHeader: 'Informacija, kuri gali būti naudojama:',
      deviceInformation: `
        <ul>
          <li>Naršyklės tipas ir jos nustatymai</li>
          <li>Informacija apie įrenginio operacinę sistemą</li>
          <li>Informacija apie slapukus</li>
          <li>Informacija apie kitus įrenginiui priskirtus identifikatorius</li>
          <li>IP addresas, iš kurio įrenginys prisijungia prie kliento tinklalapio arba mobilios programėlės</li>
          <li>Informacija apie vartotojo veiksmus, atliekamus naudojantis šiuo įrenginiu, įskaitant jo lankomus tinklalapius ir naudojamas mobilias programėles</li>
          <li>Informacija apie geografinę prietaiso buvimo vietą, kai įrenginys prisijungia prie svetainės arba mobilios programėlės</li>
        </ul>
      `,
      purposesHeader: 'Informacijos saugojimo paskirtys:',
    },
  },
  it: {
    intro: {
      title: 'Grazie per aver visitato ',
      domain: '',
      description:
        'Quando utilizzi il nostro sito / la nostra applicazione, le aziende selezionate possono avere accesso alle informazioni del tuo dispositivo ed usarle per diverse finalità, come ad esempio mostrarti inserzioni in linea con i tuoi interessi o contenuti personalizzati.',

      // TODO translate PROJ-93
      directVendorsLink: 'directVendorsLink es',
      description_part_2: 'rest of the message es',

      deviceInformationPopover: `
        <strong>Informazioni che potranno essere utilizzate:</strong>
        <ul>
          <li>Tipologia di browser e configurazione</li>
          <li>Informazioni sul sistema operativo del dispositivo</li>
          <li>Informazioni sui cookies</li>
          <li>Informazioni su altri dati identificativi assegnati al dispositivo</li>
          <li>Indirizzo IP da cui il dispositivo accede al sito o all’app di un cliente</li>
          <li>Informazioni sull’attività dell’utente sul dispositivo, comprese le pagine visitate e le app utilizzte</li>
          <li>Informazioni sulla posizione del dispositivo quando l’utente accede a un sito o a un’app</li>
        </ul>
      `,
      purposesPopover: `
        <strong>Finalità delle informazioni archiviate:</strong>
        <ul>
          <li>Archivio e accesso alle informazioni</li>
          <li>Selezione ed erogazione di inserzioni</li>
          <li>Selezione ed erogazione di contenuti</li>
          <li>Personalizzazione</li>
          <li>Misurazioni</li>
        </ul>
      `,
      acceptAll: 'Va bene, vai al sito',
      showPurposes: 'Maggiori informazioni',
    },
    details: {
      title: 'Opzioni privacy',
      back: 'Indietro',
      save: 'Ok, vai alla pagina',
      showVendors: 'Mostra le aziende',
      enableAll: 'Abilita tutto',
      disableAll: 'Disabilita tutto',
    },
    purposes: {
      active: 'Abilita',
      inactive: 'Disabilita',
      disclaimer:
        'Noi ed altre aziende selezionate possiamo accedere alle informazioni e usarle per gli scopi descritti. Puoi personalizzare la tua scelta o continuare ad usare la nostra app se sei d’accordo con le nostre finalità. Puoi trovare ',
      disclaimerVendorLink: 'qui la lista delle aziende.',
      showVendors: 'Mostra le aziende',
      hideVendors: 'Nascondere le aziende',
      featureHeader: 'Ciò includerà le seguenti funzionalità:',
      company: 'Azienda',
      switchText: '',
    },
    vendors: {
      company: 'Azienda',
      offOn: 'Acconsenti',
      description:
        'Le aziende che abbiamo accuratamente selezionato utilizzeranno le tue informazioni. A seconda del tipo di dati raccolti, del loro uso, dei processi e di altri fattori, alcune aziende fanno affidamento sul tuo consenso, mentre altre potranno richiederti di rifiutare, escludendole. Puoi cliccare sul nome dell’azienda per leggere la sua privacy policy ed esercitare in seguito il tuo diritto al consenso. Per l’esclusione, visita i siti ',
      or: 'o ',
      sites: '.',
      description2:
        'Personalizza il modo in cui le aziende useranno i dati nella ',
      description2Link: 'pagina precedente',
      description3: '',
      description3Link: '',
    },
    footer: {
      message: '',
      closedMessage: '',
      closedMessageLink: '',
      deviceInformationHeader: 'Informazioni che potranno essere utilizzate:',
      deviceInformation: `
        <ul>
          <li>Tipologia di browser e configurazione</li>
          <li>Informazioni sul sistema operativo del dispositivo</li>
          <li>Informazioni sui cookies</li>
          <li>Informazioni su altri dati identificativi assegnati al dispositivo</li>
          <li>Indirizzo IP da cui il dispositivo accede al sito o all’app di un cliente</li>
          <li>Informazioni sull’attività dell’utente sul dispositivo, comprese le pagine visitate e le app utilizzte</li>
          <li>Informazioni sulla posizione del dispositivo quando l’utente accede a un sito o a un’app</li>
        </ul>
      `,
      purposesHeader: 'Finalità delle informazioni archiviate:',
    },
  },
  fr: {
    intro: {
      title: 'Merci d’avoir visité ',
      domain: '',
      description:
        'La publicité nous permet de faire fonctionner notre app. Lorsque vous utilisez notre app certaines entreprises sélectionnées peuvent avoir accès et utiliser des informations concernant votre appareil à des fins diverses, incluant des publicités pertinentes ou du contenu personnalisé.',

      // TODO translate PROJ-93
      directVendorsLink: 'directVendorsLink es',
      description_part_2: 'rest of the message es',

      deviceInformationPopover: `
        <strong>Peuvent être utilisées:</strong>
        <ul>
          <li>Des informations sur le type de navigateur et ses réglages</li>
          <li>Des informations sur le système d’exploitation de l’appareil</li>
          <li>Des informations sur les Cookies</li>
          <li>Des informations sur d’autres identifiants assignés à l’appareil</li>
          <li>L’adresse IP à partir de laquelle le système accède au site du client ou à l’application mobile du client</li>
          <li>Des informations sur l’activité de l’utilisateur sur l’appareil en question, incluant les pages web et les applications mobiles visitées ou utilisées</li>
          <li>Des informations sur la situation géographique de l’appareil lorsque celui-ci accède à un site ou une application mobile</li>
        </ul>
      `,
      purposesPopover: `
        <strong>Les raisons pour lesquelles les informations sont conservées:</strong>
        <ul>
          <li>Stockage et accès à l’information</li>
          <li>Sélection de la publicité et de sa livraison</li>
          <li>Sélection du contenu et de sa livraison</li>
          <li>Personnalisation</li>
          <li>Mesures</li>
        </ul>
      `,
      acceptAll: 'OK, Continuer vers le Site',
      showPurposes: 'En savoir plus',
    },
    details: {
      title: 'Préférences au sujet de la vie privée',
      back: 'Retour',
      save: 'OK, Continuer vers le Site',
      showVendors: 'Montrer les entreprises',
      enableAll: 'Activer tout',
      disableAll: 'Désactiver tout',
    },
    purposes: {
      active: 'Activer',
      inactive: 'Désactiver',
      disclaimer:
        'Certaines entreprises et nous-même pouvons accéder et utiliser ces informations pour les raisons décrites. Vous avez la possibilité de personnaliser vos choix et de continuer à utiliser notre app si vous êtes en accord avec les raisons évoquées. Vous pouvez accéder à la ',
      disclaimerVendorLink: 'liste complète des entreprises ici.',
      showVendors: 'Montrer les entreprises',
      hideVendors: 'Masquer les entreprises',
      featureHeader: 'Ceci inclura les caractéristiques suivantes:',
      company: 'Entreprise',
      switchText: '',
    },
    vendors: {
      company: 'Entreprise',
      offOn: 'Autoriser',
      description:
        'Des entreprises sélectionnées par nos soins utiliseront vos informations. En fonction du type de données collectées, utilisées, traitées ou autre, certaines entreprises dépendent de votre consentement alors que d’autres ont besoin de votre clause de retrait (opt-out). Vous pouvez cliquer sur le nom des entreprises afin d’accéder à leur politique sur la vie privée et d’exercer votre choix de consentement ci-dessous. Afin d’activer votre clause de retrait (opt-out), vous pouvez visiter les sites ',
      or: 'ou ',
      sites: '.',
      description2:
        'Personnalisez la manière dont ces entreprises utilisent votre donnée sur la ',
      description2Link: 'page précédente.',
      description3: '',
      description3Link: '',
    },
    footer: {
      message: '',
      closedMessage: '',
      closedMessageLink: '',
      deviceInformationHeader: 'Peuvent être utilisées:',
      deviceInformation: `
        <ul>
          <li>Des informations sur le type de navigateur et ses réglages</li>
          <li>Des informations sur le système d’exploitation de l’appareil</li>
          <li>Des informations sur les Cookies</li>
          <li>Des informations sur d’autres identifiants assignés à l’appareil</li>
          <li>L’adresse IP à partir de laquelle le système accède au site du client ou à l’application mobile du client</li>
          <li>Des informations sur l’activité de l’utilisateur sur l’appareil en question, incluant les pages web et les applications mobiles visitées ou utilisées</li>
          <li>Des informations sur la situation géographique de l’appareil lorsque celui-ci accède à un site ou une application mobile</li>
        </ul>
      `,
      purposesHeader:
        'Les raisons pour lesquelles les informations sont conservées:',
    },
  },
  cs: {
    intro: {
      title: 'Vítejte,',
      domain: '',
      description:
        'údaje o tom, jak procházíte naše stránky a jaký obsah vás zajímá, nám pomáhají zlepšovat naše stávající služby a vyvíjet nové. Můžeme vám doporučovat obsah a zobrazovat reklamu na základě vašich zájmů a také vyhodnocovat úspěšnost jednotlivých služeb, obsahu nebo reklamy. K některým informacím mohou mít přístup i vybrané společnosti, které jsou našimi partnery. ',

      // TODO translate PROJ-93
      directVendorsLink: ' directVendorsLink es ',
      description_part_2: 'rest of the message es',

      deviceInformationPopover:
        '<strong>Jaké informace můžeme použít:</strong><ul><li>typ prohlížeče a jeho nastavení,</li><li>informace o operačním systému zařízení,</li><li>informace uložené v souborech cookies,</li><li>informace o jiných identifikačních údajích zařízení,</li><li>IP adresa, ze které zařízení získává přístup ke stránkám či k mobilní aplikaci,</li><li>informace ohledně vaší aktivity, včetně navštívených webů či použitých mobilních aplikací,</li><li>informace o zeměpisné poloze zařízení v průběhu návštěvy webu či v průběhu užívání mobilní aplikace.</li></ul>',
      acceptAll: 'rozumím a přijímám',
      showPurposes: 'více informací',
    },
    details: {
      title: 'Nastavení soukromí',
      back: 'Zpět',
      save: 'OK, pokračovat na stránku',
      showVendors: 'Ukázat společnosti',
      enableAll: 'Zapnout vše',
      disableAll: 'Vypnout vše',
    },
    purposes: {
      active: 'Povoleno',
      inactive: 'Zakázáno',
      disclaimer:
        'Naše společnost a námi vybrané společnosti mohou mít přístup k uvedeným informacím a užívat je k následujícím účelům. Můžete váš výběr upravit, nebo, pokud s těmito účely souhlasíte, pokračovat na stránku. Zde naleznete ',
      disclaimerVendorLink: 'kompletní seznam společností.',
      showVendors: 'Ukázat společnosti',
      hideVendors: 'Skrýt společnosti',
      featureHeader: 'Tyto údaje zpracováváme následujícím způsobem:',
      company: 'společnosti',
      switchText:
        'Za účelem zlepšování služeb můžeme my nebo naši smluvní partneři uchovávat a zpracovávat vaše údaje ve výše uvedeném rozsahu.',
      consentScopeCurrent: 'Tento web',
      consentScopeAll: 'Všechny weby CPEx',
      consentScopeHint: 'Souhlas uděluji pro:',
    },
    vendors: {
      company: 'Společnost',
      offOn: 'Povolit',
      description:
        'Vaše informace budou moci užívat pečlivě vybrané společnosti. V závislosti na určitých faktorech a typu dat, která budou shromažďovat, využívat a zpracovávat, budou od vás určité společnosti vyžadovat udělení souhlasu s nakládáním s těmito informacemi, zatímco jiné společnosti jej budou implicitně předpokládat a vyžadovat jen případný nesouhlas (opt-out). Pro zobrazení zásad ochrany osobních údajů jednotlivých společností můžete kliknout na název společnosti a upravit si příslušná nastavení. Pro opt-out, tedy zamítnutí souhlasu se zpracováním a uchováváním údajů, navštivte stránky ',
      or: 'nebo ',
      sites: '.',
      description2:
        'Nastavení užívání dat těmito společnostmi můžete upravit na ',
      description2Link: 'předchozí stránce.',
      description3: 'Pro změnu nastavení pro všechny společnosti najednou ',
      description3Link: 'klikněte zde.',
    },
    footer: {
      message:
        'Zjistěte více o zpracování a využití informací z vašeho zařízení k různým účelům.',
      closedMessage: 'Nastavení svého soukromí můžete ',
      closedMessageLink: 'upravit zde.',
      deviceInformationHeader: 'Informace, které mohou být použity:',
      deviceInformation:
        '<ul><li>typ prohlížeče a jeho nastavení,</li><li>informace o operačním systému zařízení,</li><li>informace uložené v souborech cookies,</li><li>informace o jiných identifikačních údajích zařízení,</li><li>IP adresa, ze které zařízení získává přístup ke stránkám či k mobilní aplikaci,</li><li>informace ohledně vaší aktivity, včetně navštívených webů či použitých mobilních aplikací,</li><li>informace o zeměpisné poloze zařízení v průběhu návštěvy webu či v průběhu užívání mobilní aplikace.</li></ul>',
      purposesHeader: 'Jak s daty zacházíme:',
    },
  },
};
