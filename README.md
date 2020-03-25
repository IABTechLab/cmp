# Deprecated

Note that the DigiTrust CMP is no longer supported and will not support TCF v2. By June 30, 2020 - at the latest - all publishers should _remove_ the DigiTrust CMP and transition to a v2 compliant CMP.

At some point shortly after June 30, 2020, production releases of the DigiTrust CMP will cease to function (the javascript will do nothing) and publishers continuing to use it will no longer be in compliance with GDPR.

For further details please see [this blog post](#TODO).

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

Development server can be accessed at url:
`http://localhost:8080/`

## Testing

```sh
npm test
```

## Releasing

```
git checkout candidate ; git pull        # pull changes from upstream candidate into local candidate
git merge --no-ff master                 # merge from master -> candidate
git tag vX.X.X                           # tag the code for release (please do not use X.X.X)
git push --tags origin                   # push tags upstream
git push --force origin vX.X.X:release   # push the vX.X.X code onto the release branch, trigging production release
```
