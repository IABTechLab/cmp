/* eslint-disable max-nested-callbacks */

import { expect } from "chai";
import config from "./config";

jest.mock("./portal");
const mockPortal = require("./portal");

import {
  fetchVendorList,
  fetchLocalizedPurposeList,
  fetchCustomPurposeList
} from "./vendor";

describe("vendor", () => {
  beforeEach(() => {
    mockPortal.sendPortalCommand = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    window.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => {} }));
  });

  it("fetchVendorList sends requests local vendors.json", done => {
    fetchVendorList().then(() => {
      expect(window.fetch.mock.calls.length).to.equal(1);
      done();
    });
  });
  it("fetchVendorList sends a portal command", done => {
    window.fetch = jest.fn().mockImplementation(() => Promise.reject());
    fetchVendorList().then(() => {
      expect(mockPortal.sendPortalCommand.mock.calls[0][0]).to.deep.equal({
        command: "readVendorList"
      });
      done();
    });
  });

  it("fetchLocalizedPurposeList fetches the configured URL based on language params", done => {
    config.update({
      forceLocale: "DE"
    });

    fetchLocalizedPurposeList().then(() => {
      expect(window.fetch.mock.calls[0][0]).to.equal(
        "https://vendorlist.consensu.org/purposes-de.json"
      );
      done();
    });
  });

  it("fetchCustomPurposeList returns nothing if there is no customPurposeListLocation", done => {
    config.update({
      customPurposeListLocation: undefined
    });

    fetchCustomPurposeList().then(() => {
      expect(window.fetch.mock.calls).to.be.empty;
      done();
    });
  });

  it("fetchCustomPurposeList returns nothing if storePublisherData = false", done => {
    config.update({
      storePublisherData: true
    });

    fetchCustomPurposeList().then(() => {
      expect(window.fetch.mock.calls).to.be.empty;
      done();
    });
  });

  it("fetchCustomPurposeList fetches the configured URL", done => {
    config.update({
      customPurposeListLocation: "somepath.json"
    });

    fetchCustomPurposeList().then(() => {
      expect(window.fetch.mock.calls[0][0]).to.equal("somepath.json");
      done();
    });
  });
});
