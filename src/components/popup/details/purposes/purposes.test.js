/* eslint-disable react/jsx-no-bind */
import { h } from "preact";
import { expect } from "chai";
import style from "./purposes.less";
import { Purposes } from "./purposes";
import { renderWithThemeProvider } from "../../../../test/helpers";

describe("Purposes", () => {
  let scratch;

  beforeEach(() => {
    scratch = document.createElement("div");
  });

  it("should render links for vendors and all standard and custom purposes", () => {
    const purposes = renderWithThemeProvider(
      <Purposes
        updateCSSPrefs={() => {}}
        purposes={[
          { id: 1, name: "Purpose 1" },
          { id: 2, name: "Purpose 2" }
        ]}
        customPurposes={[{ id: 1, name: "Custom Purpose 1" }]}
        features={[]}
      />,
      scratch
    );

    const purposeLinks = purposes.querySelectorAll(`.${style.purposeItem}`);
    expect(purposeLinks.length).to.equal(3);
  });

  it("should render li elements for each Feature", () => {
    let ref = null;
    const purposes = renderWithThemeProvider(
      <Purposes
        updateCSSPrefs={() => {}}
        ref={el => {
          ref = el;
        }}
        purposes={[
          { id: 1, name: "Purpose 1" },
          { id: 2, name: "Purpose 2" }
        ]}
        customPurposes={[{ id: 1, name: "Custom Purpose 1" }]}
        features={[
          { id: 1, name: "Feature 1" },
          { id: 2, name: "Feature 2" }
        ]}
      />,
      scratch
    );
    ref.handleSelectPurposeDetail(1)();

    setTimeout(() => {
      const features = purposes.querySelectorAll(`li`);
      expect(features.length).to.equal(2);
    }, 2000);
  });

  it("should select a standard purpose", () => {
    const selectPurpose = jest.fn();
    const selectCustomPurpose = jest.fn();

    let purposes;
    renderWithThemeProvider(
      <Purposes
        updateCSSPrefs={() => {}}
        ref={ref => (purposes = ref)}
        purposes={[
          { id: 1, name: "Purpose 1" },
          { id: 2, name: "Purpose 2" }
        ]}
        features={[]}
        selectPurpose={selectPurpose}
        selectCustomPurpose={selectCustomPurpose}
      />,
      scratch
    );

    purposes.handleSelectPurposeDetail(1)();
    purposes.handleSelectPurpose({ currentPurposeIndex: 1, isSelected: true });

    expect(selectPurpose.mock.calls[0][0]).to.equal(2);
    expect(selectPurpose.mock.calls[0][1]).to.equal(true);
    expect(selectCustomPurpose.mock.calls).to.be.empty;
  });

  it("should select a custom purpose", () => {
    const selectPurpose = jest.fn();
    const selectCustomPurpose = jest.fn();

    let purposes;
    renderWithThemeProvider(
      <Purposes
        updateCSSPrefs={() => {}}
        ref={ref => (purposes = ref)}
        purposes={[
          { id: 1, name: "Purpose 1" },
          { id: 2, name: "Purpose 2" }
        ]}
        customPurposes={[{ id: 1, name: "Custom Purpose 1" }]}
        features={[]}
        selectPurpose={selectPurpose}
        selectCustomPurpose={selectCustomPurpose}
      />,
      scratch
    );

    purposes.handleSelectPurposeDetail(2)();
    purposes.handleSelectPurpose({ currentPurposeIndex: 2, isSelected: true });

    expect(selectCustomPurpose.mock.calls[0][0]).to.equal(1);
    expect(selectCustomPurpose.mock.calls[0][1]).to.equal(true);
    expect(selectPurpose.mock.calls).to.be.empty;
  });
});
