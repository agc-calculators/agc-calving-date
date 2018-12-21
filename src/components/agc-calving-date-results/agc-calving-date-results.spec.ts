import { TestWindow } from '@stencil/core/testing';
import { AgcCalvingDateResults } from './agc-calving-date-results';

describe('agc-calving-date-results', () => {
  it('should build', () => {
    expect(new AgcCalvingDateResults()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAgcCalvingDateResultsElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AgcCalvingDateResults],
        html: '<agc-calving-date-results></agc-calving-date-results>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
