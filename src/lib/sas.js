import log from './log';

const addPixel = url => {
  const el = document.createElement('img');
  el.setAttribute('src', url);
  el.setAttribute('height', '1');
  el.setAttribute('width', '1');
  document.body.appendChild(el);
  return Promise.resolve();
};

export const notifySas = (url, consent) => {
  const pixelUrl = url
    .replace('%CONSENT%', consent)
    // GDPR should not be 1 when no consent
    .replace('GDPR=1', consent ? 'GDPR=1' : 'GDPR=0');

  log.info('Notify SAS', pixelUrl);

  return addPixel(pixelUrl).then(() => {
    const stamp = Date.now();
    log.info('SAS notified ', stamp);
    localStorage.setItem('sasLastCalled', stamp);
  });
};
