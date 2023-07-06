import { SbbMultiTouchSupport } from './multiTouchSupport';

describe('MultiTouchSupport', () => {
  let service: SbbMultiTouchSupport;
  let map: any;

  const initialZoom = 11;

  beforeEach(() => {
    service = new SbbMultiTouchSupport();
    map = {
      panBy: jasmine.createSpy(),
      setZoom: jasmine.createSpy(),
      getZoom: () => initialZoom,
      getContainer: () => ({
        addEventListener: () => {},
      }),
    };
    service.onAdd(map);
  });

  const expectPanByToHaveBeenCalledWithNearly = (
    [expectedX, expectedY]: number[],
    precision: number,
    options = {},
  ) => {
    const panByArgs = map.panBy.calls.mostRecent().args;
    const coordinates = panByArgs[0];
    const actualX = coordinates[0];
    const actualY = coordinates[1];
    const actualOptions = panByArgs[1];
    expect(actualX).toBeCloseTo(expectedX, precision);
    expect(actualY).toBeCloseTo(expectedY, precision);
    expect(actualOptions).toEqual({ animate: false, ...options });
  };

  const expectSetZoomToHaveBeenCalledWithNearly = (
    expectedZoomLevel: number,
    precision: number,
  ) => {
    expect(map.setZoom.calls.mostRecent().args[0]).toBeCloseTo(expectedZoomLevel, precision);
  };

  it('pans correctly', () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2, screenY: 2 },
        { screenX: 3, screenY: 3 },
      ],
    };
    const moveEvent = {
      touches: [
        { screenX: 2.01, screenY: 1.99 },
        { screenX: 3.01, screenY: 2.99 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.01, 0.01], 2);
    expectSetZoomToHaveBeenCalledWithNearly(initialZoom, 0);
  });

  it('zooms correctly', () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2, screenY: 2 },
        { screenX: 3, screenY: 3 },
      ],
    };
    const moveEvent = {
      touches: [
        { screenX: 1.99, screenY: 1.99 },
        { screenX: 3.01, screenY: 3.01 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([0, 0], 0);
    expectSetZoomToHaveBeenCalledWithNearly(11.044, 3);
  });

  it('pans and zooms correctly', () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2, screenY: 2 },
        { screenX: 3, screenY: 3 },
      ],
    };
    const moveEvent = {
      touches: [
        { screenX: 2.01, screenY: 2.01 },
        { screenX: 3.03, screenY: 3.03 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.02, -0.02], 2); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.044, 3);
  });

  it('pans and zooms correctly in multiple steps', () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2, screenY: 2 },
        { screenX: 3, screenY: 3 },
      ],
    };
    const moveEvent1 = {
      touches: [
        { screenX: 2.01, screenY: 2.01 },
        { screenX: 3.01, screenY: 3.01 },
      ],
    };
    const moveEvent2 = {
      touches: [
        { screenX: 1.99, screenY: 1.99 },
        { screenX: 3.01, screenY: 3.01 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent1 as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.01, -0.01], 2);
    expectSetZoomToHaveBeenCalledWithNearly(initialZoom, 0);

    // when
    service.touchMove(moveEvent2 as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([0.01, 0.01], 2); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.044, 3);
  });

  it("doesn't pan or zoom if fingers only rotate", () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2.0, screenY: 2.0 },
        { screenX: 3.0, screenY: 3.0 },
      ],
    };
    const moveEvent = {
      touches: [
        { screenX: 1.99, screenY: 2.01 },
        { screenX: 3.01, screenY: 2.99 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([0, 0], 0);
    expectSetZoomToHaveBeenCalledWithNearly(initialZoom, 0);
  });

  it("DOESN'T zoom beneath the TOUCH_ZOOM_THRESHOLD", () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2, screenY: 2 },
        { screenX: 3, screenY: 3 },
      ],
    };
    const moveEvent = {
      touches: [
        { screenX: 2.02, screenY: 2.02 },
        { screenX: 3.03, screenY: 3.03 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.025, -0.025], 3); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(initialZoom, 0);
  });

  it('DOES zoom above the TOUCH_ZOOM_THRESHOLD', () => {
    // given
    const startEvent = {
      touches: [
        { screenX: 2, screenY: 2 },
        { screenX: 3, screenY: 3 },
      ],
    };
    const moveEvent = {
      touches: [
        { screenX: 2.02, screenY: 2.02 },
        { screenX: 3.031, screenY: 3.031 },
      ],
    };

    // when
    service.touchStart(startEvent as unknown as TouchEvent);
    service.touchMove(moveEvent as unknown as TouchEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.0255, -0.0255], 4); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.0242, 4);
  });
});
