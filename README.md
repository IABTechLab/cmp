# DigiTrust CMP
CMP is a tool for publishers to engage users of their properties and gather & store end user consent.

This code was forked from https://github.com/appnexus/cmp.

### Installation

```sh
git clone https://github.com/digi-trust/cmp.git
cd cmp
yarn install
```

## Build for Production

```sh
npm run build
```

This produces a production build of the `cmp` script and the docs application:
+ `./build/cmp.bundle.js` - CMP script to include on your site
+ `./build/docs/` - Application hosting the documentation

## Documentation

Instructions to install the CMP as well as API docs and examples are available in the `docs`
application included with the repo.

```sh
npm start
```

The documentation can be viewed at:
`http://localhost:5000/docs/`

## Development
You can start a development server that will monitor changes to all CMP and docs files with:
```sh
npm run dev
```

Development server can be accessed at:
`http://localhost:8080/`

## Testing

```sh
npm test
```

Your system must also have an environment variable of `FIREFOX_BIN` set in order for the E2E tests to correctly run Firefox. http://kb.mozillazine.org/Installation_directory lists the default installation directories if you're not able to find it on your own.
