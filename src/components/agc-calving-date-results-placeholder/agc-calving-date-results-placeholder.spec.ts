import { TestWindow } from '@stencil/core/testing';
import { AgcCalvingDateResultsPlaceholder } from './agc-calving-date-results-placeholder';

describe('agc-calving-date-results-placeholder', () => {
  it('should build', () => {
    expect(new AgcCalvingDateResultsPlaceholder()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAgcCalvingDateResultsPlaceholderElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AgcCalvingDateResultsPlaceholder],
        html: '<agc-calving-date-results-placeholder></agc-calving-date-results-placeholder>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
