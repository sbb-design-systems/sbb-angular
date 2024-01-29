import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  createFakeEvent,
  createMouseEvent,
  dispatchMouseEvent,
  wrappedErrorMessage,
} from '@sbb-esta/angular/core/testing';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SbbTableModule } from '../table.module';

import { SbbSort, SbbSortState, SBB_SORT_DEFAULT_OPTIONS } from './sort';
import { SbbSortDirection } from './sort-direction';
import {
  getSortDuplicateSortableIdError,
  getSortHeaderMissingIdError,
  getSortHeaderNotContainedWithinSortError,
  getSortInvalidDirectionError,
} from './sort-errors';
import { SbbSortHeader } from './sort-header';

describe('SbbSort', () => {
  describe('without default options', () => {
    let fixture: ComponentFixture<SimpleSbbSortApp>;
    let component: SimpleSbbSortApp;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleSbbSortApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have the sort headers register and deregister themselves', () => {
      const sortables = component.sbbSort.sortables;
      expect(sortables.size).toBe(4);
      expect(sortables.get('defaultA')).toBe(component.defaultA);
      expect(sortables.get('defaultB')).toBe(component.defaultB);

      fixture.destroy();
      expect(sortables.size).toBe(0);
    });

    it('should mark itself as initialized', fakeAsync(() => {
      let isMarkedInitialized = false;
      component.sbbSort.initialized.subscribe(() => (isMarkedInitialized = true));

      tick();
      expect(isMarkedInitialized).toBeTruthy();
    }));

    it('should use the column definition if used within a cdk table', () => {
      const cdkTableSbbSortAppFixture = TestBed.createComponent(CdkTableSbbSortApp);
      const cdkTableSbbSortAppComponent = cdkTableSbbSortAppFixture.componentInstance;

      cdkTableSbbSortAppFixture.detectChanges();
      cdkTableSbbSortAppFixture.detectChanges();

      const sortables = cdkTableSbbSortAppComponent.sbbSort.sortables;
      expect(sortables.size).toBe(3);
      expect(sortables.has('column_a')).toBe(true);
      expect(sortables.has('column_b')).toBe(true);
      expect(sortables.has('column_c')).toBe(true);
    });

    it('should use the column definition if used within an sbb table', () => {
      const sbbTableSbbSortAppFixture = TestBed.createComponent(SbbTableSbbSortApp);
      const sbbTableSbbSortAppComponent = sbbTableSbbSortAppFixture.componentInstance;

      sbbTableSbbSortAppFixture.detectChanges();
      sbbTableSbbSortAppFixture.detectChanges();

      const sortables = sbbTableSbbSortAppComponent.sbbSort.sortables;
      expect(sortables.size).toBe(3);
      expect(sortables.has('column_a')).toBe(true);
      expect(sortables.has('column_b')).toBe(true);
      expect(sortables.has('column_c')).toBe(true);
    });

    describe('checking correct arrow direction and view state for its various states', () => {
      let expectedStates: Map<string, { viewState: string; arrowDirection: string }>;

      beforeEach(() => {
        // Starting state for the view and directions - note that overrideStart is reversed to be
        // desc
        expectedStates = new Map<string, { viewState: string; arrowDirection: string }>([
          ['defaultA', { viewState: 'asc', arrowDirection: 'asc' }],
          ['defaultB', { viewState: 'asc', arrowDirection: 'asc' }],
          ['overrideStart', { viewState: 'desc', arrowDirection: 'desc' }],
          ['overrideDisableClear', { viewState: 'asc', arrowDirection: 'asc' }],
        ]);
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should be correct when mousing over headers and leaving on mouseleave', () => {
        // Mousing over the first sort should set the view state to hint (asc)
        component.dispatchMouseEvent('defaultA', 'mouseenter');
        expectedStates.set('defaultA', { viewState: 'asc-to-hint', arrowDirection: 'asc' });
        component.expectViewAndDirectionStates(expectedStates);

        // Mousing away from the first sort should hide the arrow
        component.dispatchMouseEvent('defaultA', 'mouseleave');
        expectedStates.set('defaultA', { viewState: 'hint-to-asc', arrowDirection: 'asc' });
        component.expectViewAndDirectionStates(expectedStates);

        // Mousing over another sort should set the view state to hint (desc)
        component.dispatchMouseEvent('overrideStart', 'mouseenter');
        expectedStates.set('overrideStart', { viewState: 'desc-to-hint', arrowDirection: 'desc' });
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should be correct when mousing over header and then sorting', () => {
        // Mousing over the first sort should set the view state to hint
        component.dispatchMouseEvent('defaultA', 'mouseenter');
        expectedStates.set('defaultA', { viewState: 'asc-to-hint', arrowDirection: 'asc' });
        component.expectViewAndDirectionStates(expectedStates);

        // Clicking sort on the header should set it to be active immediately
        // (since it was already hinted)
        component.dispatchMouseEvent('defaultA', 'click');
        expectedStates.set('defaultA', { viewState: 'active', arrowDirection: 'active-asc' });
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should be correct when cycling through a default sort header', () => {
        // Sort the header to set it to the active start state
        component.sort('defaultA');
        expectedStates.set('defaultA', {
          viewState: 'asc-to-active',
          arrowDirection: 'active-asc',
        });
        component.expectViewAndDirectionStates(expectedStates);

        // Sorting again will reverse its direction
        component.dispatchMouseEvent('defaultA', 'click');
        expectedStates.set('defaultA', { viewState: 'active', arrowDirection: 'active-desc' });
        component.expectViewAndDirectionStates(expectedStates);

        // Sorting again will remove the sort and animate away the view
        component.dispatchMouseEvent('defaultA', 'click');
        expectedStates.set('defaultA', { viewState: 'active-to-desc', arrowDirection: 'desc' });
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should not enter sort with animations if an animations is disabled', () => {
        // Sort the header to set it to the active start state
        component.defaultA._disableViewStateAnimation = true;
        component.sort('defaultA');
        expectedStates.set('defaultA', { viewState: 'active', arrowDirection: 'active-asc' });
        component.expectViewAndDirectionStates(expectedStates);

        // Sorting again will reverse its direction
        component.defaultA._disableViewStateAnimation = true;
        component.dispatchMouseEvent('defaultA', 'click');
        expectedStates.set('defaultA', { viewState: 'active', arrowDirection: 'active-desc' });
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should be correct when sort has changed while a header is active', () => {
        // Sort the first header to set up
        component.sort('defaultA');
        expectedStates.set('defaultA', {
          viewState: 'asc-to-active',
          arrowDirection: 'active-asc',
        });
        component.expectViewAndDirectionStates(expectedStates);

        // Sort the second header and verify that the first header animated away
        component.dispatchMouseEvent('defaultB', 'click');
        expectedStates.set('defaultA', { viewState: 'active-to-asc', arrowDirection: 'asc' });
        expectedStates.set('defaultB', {
          viewState: 'asc-to-active',
          arrowDirection: 'active-asc',
        });
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should be correct when sort has been disabled', () => {
        // Mousing over the first sort should set the view state to hint
        component.disabledColumnSort = true;
        fixture.detectChanges();

        component.dispatchMouseEvent('defaultA', 'mouseenter');
        component.expectViewAndDirectionStates(expectedStates);
      });

      it('should be correct when sorting programmatically', () => {
        component.active = 'defaultB';
        component.direction = 'asc';
        fixture.detectChanges();

        expectedStates.set('defaultB', {
          viewState: 'asc-to-active',
          arrowDirection: 'active-asc',
        });
        component.expectViewAndDirectionStates(expectedStates);
      });
    });

    it('should be able to cycle from asc -> desc from either start point', () => {
      component.disableClear = true;

      component.start = 'asc';
      testSingleColumnSortDirectionSequence(fixture, ['asc', 'desc']);

      // Reverse directions
      component.start = 'desc';
      testSingleColumnSortDirectionSequence(fixture, ['desc', 'asc']);
    });

    it('should be able to cycle asc -> desc -> [none]', () => {
      component.start = 'asc';
      testSingleColumnSortDirectionSequence(fixture, ['asc', 'desc', '']);
    });

    it('should be able to cycle desc -> asc -> [none]', () => {
      component.start = 'desc';
      testSingleColumnSortDirectionSequence(fixture, ['desc', 'asc', '']);
    });

    it('should allow for the cycling the sort direction to be disabled per column', () => {
      const container = fixture.nativeElement.querySelector('#defaultA .sbb-sort-header-container');

      component.sort('defaultA');
      expect(component.sbbSort.direction).toBe('asc');
      expect(container.getAttribute('tabindex')).toBe('0');
      expect(container.getAttribute('role')).toBe('button');

      component.disabledColumnSort = true;
      fixture.detectChanges();

      component.sort('defaultA');
      expect(component.sbbSort.direction).toBe('asc');
      expect(container.hasAttribute('tabindex')).toBe(false);
      expect(container.hasAttribute('role')).toBe(false);
    });

    it('should allow for the cycling the sort direction to be disabled for all columns', () => {
      const container = fixture.nativeElement.querySelector('#defaultA .sbb-sort-header-container');

      component.sort('defaultA');
      expect(component.sbbSort.active).toBe('defaultA');
      expect(component.sbbSort.direction).toBe('asc');
      expect(container.getAttribute('tabindex')).toBe('0');

      component.disableAllSort = true;
      fixture.detectChanges();

      component.sort('defaultA');
      expect(component.sbbSort.active).toBe('defaultA');
      expect(component.sbbSort.direction).toBe('asc');
      expect(container.getAttribute('tabindex')).toBeFalsy();

      component.sort('defaultB');
      expect(component.sbbSort.active).toBe('defaultA');
      expect(component.sbbSort.direction).toBe('asc');
      expect(container.getAttribute('tabindex')).toBeFalsy();
    });

    it('should reset sort direction when a different column is sorted', () => {
      component.sort('defaultA');
      expect(component.sbbSort.active).toBe('defaultA');
      expect(component.sbbSort.direction).toBe('asc');

      component.sort('defaultA');
      expect(component.sbbSort.active).toBe('defaultA');
      expect(component.sbbSort.direction).toBe('desc');

      component.sort('defaultB');
      expect(component.sbbSort.active).toBe('defaultB');
      expect(component.sbbSort.direction).toBe('asc');
    });

    it(
      'should throw an error if an SbbSortable is not contained within an SbbSort ' + 'directive',
      () => {
        expect(() =>
          TestBed.createComponent(SbbSortHeaderMissingSbbSortApp).detectChanges(),
        ).toThrowError(wrappedErrorMessage(getSortHeaderNotContainedWithinSortError()));
      },
    );

    it('should throw an error if two SbbSortables have the same id', () => {
      expect(() =>
        TestBed.createComponent(SbbSortDuplicateSbbSortableIdsApp).detectChanges(),
      ).toThrowError(wrappedErrorMessage(getSortDuplicateSortableIdError('duplicateId')));
    });

    it('should throw an error if an SbbSortable is missing an id', () => {
      expect(() => TestBed.createComponent(SbbSortableMissingIdApp).detectChanges()).toThrowError(
        wrappedErrorMessage(getSortHeaderMissingIdError()),
      );
    });

    it('should throw an error if the provided direction is invalid', () => {
      expect(() =>
        TestBed.createComponent(SbbSortableInvalidDirection).detectChanges(),
      ).toThrowError(wrappedErrorMessage(getSortInvalidDirectionError('ascending')));
    });

    it('should allow let SbbSortable override the default sort parameters', () => {
      testSingleColumnSortDirectionSequence(fixture, ['asc', 'desc', '']);

      testSingleColumnSortDirectionSequence(fixture, ['desc', 'asc', ''], 'overrideStart');

      testSingleColumnSortDirectionSequence(fixture, ['asc', 'desc'], 'overrideDisableClear');
    });

    it('should toggle indicator hint on button focus/blur and hide on click', () => {
      const header = fixture.componentInstance.defaultA;
      const container = fixture.nativeElement.querySelector('#defaultA .sbb-sort-header-container');
      const focusEvent = createFakeEvent('focus');
      const blurEvent = createFakeEvent('blur');

      // Should start without a displayed hint
      expect(header._showIndicatorHint).toBeFalsy();

      // Focusing the button should show the hint, blurring should hide it
      container.dispatchEvent(focusEvent);
      expect(header._showIndicatorHint).toBeTruthy();

      container.dispatchEvent(blurEvent);
      expect(header._showIndicatorHint).toBeFalsy();

      // Show the indicator hint. On click the hint should be hidden
      container.dispatchEvent(focusEvent);
      expect(header._showIndicatorHint).toBeTruthy();

      header._handleClick();
      expect(header._showIndicatorHint).toBeFalsy();
    });

    it('should toggle indicator hint on mouseenter/mouseleave and hide on click', () => {
      const header = fixture.componentInstance.defaultA;
      const headerElement = fixture.nativeElement.querySelector('#defaultA');
      const mouseenterEvent = createMouseEvent('mouseenter');
      const mouseleaveEvent = createMouseEvent('mouseleave');

      // Should start without a displayed hint
      expect(header._showIndicatorHint).toBeFalsy();

      // Mouse enter should show the hint, blurring should hide it
      headerElement.dispatchEvent(mouseenterEvent);
      expect(header._showIndicatorHint).toBeTruthy();

      headerElement.dispatchEvent(mouseleaveEvent);
      expect(header._showIndicatorHint).toBeFalsy();

      // Show the indicator hint. On click the hint should be hidden
      headerElement.dispatchEvent(mouseenterEvent);
      expect(header._showIndicatorHint).toBeTruthy();

      header._handleClick();
      expect(header._showIndicatorHint).toBeFalsy();
    });

    it('should apply the aria-sort label to the header when sorted', () => {
      const sortHeaderElement = fixture.nativeElement.querySelector('#defaultA');
      expect(sortHeaderElement.getAttribute('aria-sort')).toBe('none');

      component.sort('defaultA');
      fixture.detectChanges();
      expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');

      component.sort('defaultA');
      fixture.detectChanges();
      expect(sortHeaderElement.getAttribute('aria-sort')).toBe('descending');

      component.sort('defaultA');
      fixture.detectChanges();
      expect(sortHeaderElement.getAttribute('aria-sort')).toBe('none');
    });

    it('should not render the arrow if sorting is disabled for that column', fakeAsync(() => {
      const sortHeaderElement = fixture.nativeElement.querySelector('#defaultA');

      // Switch sorting to a different column before asserting.
      component.sort('defaultB');
      fixture.componentInstance.disabledColumnSort = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(sortHeaderElement.querySelector('.sbb-sort-header-arrow')).toBeFalsy();
    }));

    it('should render the arrow if a disabled column is being sorted by', fakeAsync(() => {
      const sortHeaderElement = fixture.nativeElement.querySelector('#defaultA');

      component.sort('defaultA');
      fixture.componentInstance.disabledColumnSort = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(sortHeaderElement.querySelector('.sbb-sort-header-arrow')).toBeTruthy();
    }));

    it('should add a default aria description to sort buttons', () => {
      const sortButton = fixture.nativeElement.querySelector('.sbb-sort-header-container');
      const descriptionId = sortButton.getAttribute('aria-describedby');
      expect(descriptionId).toBeDefined();

      const descriptionElement = document.getElementById(descriptionId);
      expect(descriptionElement?.textContent).toBe('Sort');
    });

    it('should add a custom aria description to sort buttons', () => {
      const sortButton = fixture.nativeElement.querySelector(
        '#defaultB .sbb-sort-header-container',
      );
      let descriptionId = sortButton.getAttribute('aria-describedby');
      expect(descriptionId).toBeDefined();

      let descriptionElement = document.getElementById(descriptionId);
      expect(descriptionElement?.textContent).toBe('Sort second column');

      fixture.componentInstance.secondColumnDescription = 'Sort 2nd column';
      fixture.detectChanges();
      descriptionId = sortButton.getAttribute('aria-describedby');
      descriptionElement = document.getElementById(descriptionId);
      expect(descriptionElement?.textContent).toBe('Sort 2nd column');
    });

    it('should render arrows after sort header by default', () => {
      const sbbSortWithArrowPositionFixture = TestBed.createComponent(SbbSortWithArrowPosition);

      sbbSortWithArrowPositionFixture.detectChanges();

      const containerA = sbbSortWithArrowPositionFixture.nativeElement.querySelector(
        '#defaultA .sbb-sort-header-container',
      );
      const containerB = sbbSortWithArrowPositionFixture.nativeElement.querySelector(
        '#defaultB .sbb-sort-header-container',
      );

      expect(containerA.classList.contains('sbb-sort-header-position-before')).toBe(false);
      expect(containerB.classList.contains('sbb-sort-header-position-before')).toBe(false);
    });

    it('should render arrows before if appropriate parameter passed', () => {
      const sbbSortWithArrowPositionFixture = TestBed.createComponent(SbbSortWithArrowPosition);
      const sbbSortWithArrowPositionComponent = sbbSortWithArrowPositionFixture.componentInstance;
      sbbSortWithArrowPositionComponent.arrowPosition = 'before';

      sbbSortWithArrowPositionFixture.detectChanges();

      const containerA = sbbSortWithArrowPositionFixture.nativeElement.querySelector(
        '#defaultA .sbb-sort-header-container',
      );
      const containerB = sbbSortWithArrowPositionFixture.nativeElement.querySelector(
        '#defaultB .sbb-sort-header-container',
      );

      expect(containerA.classList.contains('sbb-sort-header-position-before')).toBe(true);
      expect(containerB.classList.contains('sbb-sort-header-position-before')).toBe(true);
    });

    it('should render arrows in proper position based on arrowPosition parameter', () => {
      const sbbSortWithArrowPositionFixture = TestBed.createComponent(SbbSortWithArrowPosition);
      const sbbSortWithArrowPositionComponent = sbbSortWithArrowPositionFixture.componentInstance;

      sbbSortWithArrowPositionFixture.detectChanges();

      const containerA = sbbSortWithArrowPositionFixture.nativeElement.querySelector(
        '#defaultA .sbb-sort-header-container',
      );
      const containerB = sbbSortWithArrowPositionFixture.nativeElement.querySelector(
        '#defaultB .sbb-sort-header-container',
      );

      expect(containerA.classList.contains('sbb-sort-header-position-before')).toBe(false);
      expect(containerB.classList.contains('sbb-sort-header-position-before')).toBe(false);

      sbbSortWithArrowPositionComponent.arrowPosition = 'before';

      sbbSortWithArrowPositionFixture.detectChanges();

      expect(containerA.classList.contains('sbb-sort-header-position-before')).toBe(true);
      expect(containerB.classList.contains('sbb-sort-header-position-before')).toBe(true);
    });
  });

  describe('with default options', () => {
    let fixture: ComponentFixture<SbbSortWithoutExplicitInputs>;
    let component: SbbSortWithoutExplicitInputs;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        providers: [
          {
            provide: SBB_SORT_DEFAULT_OPTIONS,
            useValue: {
              disableClear: true,
            },
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SbbSortWithoutExplicitInputs);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be able to cycle from asc -> desc from either start point', () => {
      component.start = 'asc';
      testSingleColumnSortDirectionSequence(fixture, ['asc', 'desc']);

      // Reverse directions
      component.start = 'desc';
      testSingleColumnSortDirectionSequence(fixture, ['desc', 'asc']);
    });
  });

  describe('with default arrowPosition', () => {
    let fixture: ComponentFixture<SbbSortWithoutInputs>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        providers: [
          {
            provide: SBB_SORT_DEFAULT_OPTIONS,
            useValue: {
              disableClear: true,
              arrowPosition: 'before',
            },
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SbbSortWithoutInputs);
      fixture.detectChanges();
    });

    it('should render arrows in proper position', () => {
      const containerA = fixture.nativeElement.querySelector(
        '#defaultA .sbb-sort-header-container',
      );
      const containerB = fixture.nativeElement.querySelector(
        '#defaultB .sbb-sort-header-container',
      );

      expect(containerA.classList.contains('sbb-sort-header-position-before')).toBe(true);
      expect(containerB.classList.contains('sbb-sort-header-position-before')).toBe(true);
    });
  });
});

/**
 * Performs a sequence of sorting on a single column to see if the sort directions are
 * consistent with expectations. Detects any changes in the fixture to reflect any changes in
 * the inputs and resets the SbbSort to remove any side effects from previous tests.
 */
function testSingleColumnSortDirectionSequence(
  fixture: ComponentFixture<SimpleSbbSortApp | SbbSortWithoutExplicitInputs>,
  expectedSequence: SbbSortDirection[],
  id: SimpleSbbSortAppColumnIds = 'defaultA',
) {
  // Detect any changes that were made in preparation for this sort sequence
  fixture.detectChanges();

  // Reset the sort to make sure there are no side affects from previous tests
  const component = fixture.componentInstance;
  component.sbbSort.active = '';
  component.sbbSort.direction = '';

  // Run through the sequence to confirm the order
  const actualSequence = expectedSequence.map(() => {
    component.sort(id);

    // Check that the sort event's active sort is consistent with the SbbSort
    expect(component.sbbSort.active).toBe(id);
    expect(component.latestSortEvent.active).toBe(id);

    // Check that the sort event's direction is consistent with the SbbSort
    expect(component.sbbSort.direction).toBe(component.latestSortEvent.direction);
    return component.sbbSort.direction;
  });
  expect(actualSequence).toEqual(expectedSequence);

  // Expect that performing one more sort will loop it back to the beginning.
  component.sort(id);
  expect(component.sbbSort.direction).toBe(expectedSequence[0]);
}

/** Column IDs of the SimpleSbbSortApp for typing of function params in the component (e.g. sort) */
type SimpleSbbSortAppColumnIds = 'defaultA' | 'defaultB' | 'overrideStart' | 'overrideDisableClear';

@Component({
  template: `
    <div
      sbbSort
      [sbbSortActive]="active"
      [sbbSortDisabled]="disableAllSort"
      [sbbSortStart]="start"
      [sbbSortDirection]="direction"
      [sbbSortDisableClear]="disableClear"
      (sbbSortChange)="latestSortEvent = $event"
    >
      <div id="defaultA" #defaultA sbb-sort-header="defaultA" [disabled]="disabledColumnSort">
        A
      </div>
      <div
        id="defaultB"
        #defaultB
        sbb-sort-header="defaultB"
        [sortActionDescription]="secondColumnDescription"
      >
        B
      </div>
      <div id="overrideStart" #overrideStart sbb-sort-header="overrideStart" start="desc">D</div>
      <div
        id="overrideDisableClear"
        #overrideDisableClear
        sbb-sort-header="overrideDisableClear"
        disableClear
      >
        E
      </div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SimpleSbbSortApp {
  latestSortEvent: SbbSortState;

  active: string;
  start: SbbSortDirection = 'asc';
  direction: SbbSortDirection = '';
  disableClear: boolean;
  disabledColumnSort = false;
  disableAllSort = false;
  secondColumnDescription = 'Sort second column';

  @ViewChild(SbbSort) sbbSort: SbbSort;
  @ViewChild('defaultA') defaultA: SbbSortHeader;
  @ViewChild('defaultB') defaultB: SbbSortHeader;
  @ViewChild('overrideStart') overrideStart: SbbSortHeader;
  @ViewChild('overrideDisableClear') overrideDisableClear: SbbSortHeader;

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  sort(id: SimpleSbbSortAppColumnIds) {
    this.dispatchMouseEvent(id, 'click');
  }

  dispatchMouseEvent(id: SimpleSbbSortAppColumnIds, event: string) {
    const sortElement = this.elementRef.nativeElement.querySelector(`#${id}`)!;
    dispatchMouseEvent(sortElement, event);
  }

  /**
   * Checks expectations for each sort header's view state and arrow direction states. Receives a
   * map that is keyed by each sort header's ID and contains the expectation for that header's
   * states.
   */
  expectViewAndDirectionStates(
    viewStates: Map<string, { viewState: string; arrowDirection: string }>,
  ) {
    const sortHeaders = new Map([
      ['defaultA', this.defaultA],
      ['defaultB', this.defaultB],
      ['overrideStart', this.overrideStart],
      ['overrideDisableClear', this.overrideDisableClear],
    ]);

    viewStates.forEach((viewState, id) => {
      expect(sortHeaders.get(id)!._getArrowViewState()).toEqual(viewState.viewState);
      expect(sortHeaders.get(id)!._getArrowDirectionState()).toEqual(viewState.arrowDirection);
    });
  }
}

class FakeDataSource extends DataSource<any> {
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return collectionViewer.viewChange.pipe(map(() => []));
  }
  disconnect() {}
}

@Component({
  template: `
    <cdk-table [dataSource]="dataSource" sbbSort>
      <ng-container cdkColumnDef="column_a">
        <cdk-header-cell *cdkHeaderCellDef #sortHeaderA sbb-sort-header> Column A </cdk-header-cell>
        <cdk-cell *cdkCellDef="let row"> {{ row.a }} </cdk-cell>
      </ng-container>

      <ng-container cdkColumnDef="column_b">
        <cdk-header-cell *cdkHeaderCellDef #sortHeaderB sbb-sort-header> Column B </cdk-header-cell>
        <cdk-cell *cdkCellDef="let row"> {{ row.b }} </cdk-cell>
      </ng-container>

      <ng-container cdkColumnDef="column_c">
        <cdk-header-cell *cdkHeaderCellDef #sortHeaderC sbb-sort-header> Column C </cdk-header-cell>
        <cdk-cell *cdkCellDef="let row"> {{ row.c }} </cdk-cell>
      </ng-container>

      <cdk-header-row *cdkHeaderRowDef="columnsToRender"></cdk-header-row>
      <cdk-row *cdkRowDef="let row; columns: columnsToRender"></cdk-row>
    </cdk-table>
  `,
  standalone: true,
  imports: [SbbTableModule, CdkTableModule],
})
class CdkTableSbbSortApp {
  @ViewChild(SbbSort) sbbSort: SbbSort;

  dataSource = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
}

@Component({
  template: `
    <sbb-table [dataSource]="dataSource" sbbSort>
      <ng-container sbbColumnDef="column_a">
        <sbb-header-cell *sbbHeaderCellDef #sortHeaderA sbb-sort-header> Column A </sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.a }} </sbb-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_b">
        <sbb-header-cell *sbbHeaderCellDef #sortHeaderB sbb-sort-header> Column B </sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.b }} </sbb-cell>
      </ng-container>

      <ng-container sbbColumnDef="column_c">
        <sbb-header-cell *sbbHeaderCellDef #sortHeaderC sbb-sort-header> Column C </sbb-header-cell>
        <sbb-cell *sbbCellDef="let row"> {{ row.c }} </sbb-cell>
      </ng-container>

      <sbb-header-row *sbbHeaderRowDef="columnsToRender"></sbb-header-row>
      <sbb-row *sbbRowDef="let row; columns: columnsToRender"></sbb-row>
    </sbb-table>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbTableSbbSortApp {
  @ViewChild(SbbSort) sbbSort: SbbSort;

  dataSource = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
}

@Component({
  template: `<div sbb-sort-header="a">A</div>`,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortHeaderMissingSbbSortApp {}

@Component({
  template: `
    <div sbbSort>
      <div sbb-sort-header="duplicateId">A</div>
      <div sbb-sort-header="duplicateId">A</div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortDuplicateSbbSortableIdsApp {}

@Component({
  template: `
    <div sbbSort>
      <div sbb-sort-header>A</div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortableMissingIdApp {}

@Component({
  template: `
    <div sbbSort sbbSortDirection="ascending">
      <div sbb-sort-header="a">A</div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortableInvalidDirection {}

@Component({
  template: `
    <div
      sbbSort
      [sbbSortActive]="active"
      [sbbSortStart]="start"
      (sbbSortChange)="latestSortEvent = $event"
    >
      <div id="defaultA" #defaultA sbb-sort-header="defaultA">A</div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortWithoutExplicitInputs {
  latestSortEvent: SbbSortState;

  active: string;
  start: SbbSortDirection = 'asc';

  @ViewChild(SbbSort) sbbSort: SbbSort;
  @ViewChild('defaultA') defaultA: SbbSortHeader;

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  sort(id: SimpleSbbSortAppColumnIds) {
    this.dispatchMouseEvent(id, 'click');
  }

  dispatchMouseEvent(id: SimpleSbbSortAppColumnIds, event: string) {
    const sortElement = this.elementRef.nativeElement.querySelector(`#${id}`)!;
    dispatchMouseEvent(sortElement, event);
  }
}

@Component({
  template: `
    <div sbbSort>
      <div id="defaultA" #defaultA sbb-sort-header="defaultA" [arrowPosition]="arrowPosition">
        A
      </div>
      <div id="defaultB" #defaultB sbb-sort-header="defaultB" [arrowPosition]="arrowPosition">
        B
      </div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortWithArrowPosition {
  arrowPosition?: 'before' | 'after';
  @ViewChild(SbbSort) sbbSort: SbbSort;
  @ViewChild('defaultA') defaultA: SbbSortHeader;
  @ViewChild('defaultB') defaultB: SbbSortHeader;
}

@Component({
  template: `
    <div sbbSort>
      <div id="defaultA" #defaultA sbb-sort-header="defaultA">A</div>
      <div id="defaultB" #defaultB sbb-sort-header="defaultB">B</div>
    </div>
  `,
  standalone: true,
  imports: [SbbTableModule],
})
class SbbSortWithoutInputs {
  @ViewChild(SbbSort) sbbSort: SbbSort;
  @ViewChild('defaultA') defaultA: SbbSortHeader;
  @ViewChild('defaultB') defaultB: SbbSortHeader;
}
