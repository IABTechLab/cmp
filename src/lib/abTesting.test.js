import * as ab from "./abTesting";

const variants = [
  {
    id: "A",
    configUrl: "https://cdn-src.cpex.cz/cmp/config-a.json",
    probability: 0.3
  },
  {
    id: "B",
    configUrl: "https://cdn-src.cpex.cz/cmp/config-b.json",
    probability: "70%"
  }
];

describe("AB testing", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("should pick a variant randomly", () => {
    const variant = ab.pickVariant(variants);

    expect(variants.find(vari => vari.id === variant.id)).not.toBeNull();
  });

  it("should use a stored variant randomly", () => {
    const variant = ab.pickVariant(variants);

    expect(variants.find(vari => vari.id === variant.id)).not.toBeNull();

    const variant2 = ab.pickVariant(variants);

    expect(variant2).toEqual(variant);
  });
});
