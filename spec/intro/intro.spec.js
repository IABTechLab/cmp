describe('intro page', () => {

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  it('smoke test', () => {
    browser.get("/")
    const url = browser.getCurrentUrl();
    expect(url).toEqual('http://localhost:8080/')
  });
})
