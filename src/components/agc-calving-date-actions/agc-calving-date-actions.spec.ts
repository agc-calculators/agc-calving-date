import { TestWindow } from '@stencil/core/testing';
import { AgcCalvingDateActions } from './agc-calving-date-actions';

describe('agc-calving-date-actions', () => {
  it('should build', () => {
    expect(new AgcCalvingDateActions()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAgcCalvingDateActionsElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AgcCalvingDateActions],
        html: '<agc-calving-date-actions></agc-calving-date-actions>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
