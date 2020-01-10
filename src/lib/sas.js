import log from "./log";
import config from "./config";
import * as cookie from "./cookie/cookie";
import Promise from "promise-polyfill";

const addPixel = url => {
  const pixelWrapper = getPixelWrapper();
  const el = document.createElement("img");
  el.setAttribute("src", url);
  el.setAttribute("height", "1");
  el.setAttribute("width", "1");
  pixelWrapper.appendChild(el);
  return Promise.resolve();
};

// TODO rename
export const bundleSasNotify = (config, euconsent) => {
  const sasLastCalled = localStorage.getItem("sasLastCalled") || 0;
  const timestamp = Date.now();
  const intervalMs = config.sasInterval * 60 * 60 * 1000;

  let notificationCalls = [];

  if (timestamp - intervalMs > sasLastCalled) {
    notificationCalls = config.sasUrls.map(url => {
      return notifySas(url, euconsent ? euconsent.consentString : "");
    });
  }
  return Promise.all(notificationCalls);
};

export const notifySas = (url, consent) => {
  const pixelUrl = url
    .replace("%CONSENT%", consent)
  // GDPR should not be 1 when no consent
  // TODO hot fixes - implement better solution
    .replace("GDPR=1", consent ? "GDPR=1" : "GDPR=0");

  log.info("Notify SAS", pixelUrl);

  return addPixel(pixelUrl).then(() => {
    const stamp = Date.now();
    log.info("SAS notified ", stamp);
    localStorage.setItem("sasLastCalled", stamp);
  });
};

const getPixelWrapper = () => {
  let pixelWrapper = document.getElementById("pixelWrapper");
  if (!pixelWrapper) {
    pixelWrapper = document.createElement("div");
    pixelWrapper.setAttribute("id", "pixelWrapper");
    pixelWrapper.style.position = "absolute";
    pixelWrapper.style.top = "-9999px";
    pixelWrapper.style.left = "-9999px";
    document.body.appendChild(pixelWrapper);
  }
  return pixelWrapper;
};
