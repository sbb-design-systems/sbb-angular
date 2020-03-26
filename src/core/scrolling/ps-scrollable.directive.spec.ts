import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { PsComponentScrollable, PsDirectiveScrollable } from './ps-scrollable.directive';

describe('PsDirectiveScrollable', () => {
  const perfectScrollbarMock = {
    psScrollY: new Subject(),
    psScrollX: new Subject()
  };
  const scrollDispatcherMock = {
    register(): void {},
    deregister(): void {}
  };

  it('should emit on inner scroll', () => {
    const directive = new PsDirectiveScrollable(
      perfectScrollbarMock as any,
      new ElementRef<HTMLElement>(null!),
      scrollDispatcherMock as any,
      null!,
      null!
    );
    let counter = 0;
    directive.elementScrolled().subscribe(() => ++counter);
    perfectScrollbarMock.psScrollX.next();
    expect(counter).toBe(1);
    perfectScrollbarMock.psScrollY.next();
    expect(counter).toBe(2);
  });
});

describe('PsComponentScrollable', () => {
  const perfectScrollbarMock = {
    psScrollY: new Subject(),
    psScrollX: new Subject()
  };
  const scrollDispatcherMock = {
    register(): void {},
    deregister(): void {}
  };

  it('should emit on inner scroll', () => {
    const directive = new PsComponentScrollable(
      perfectScrollbarMock as any,
      new ElementRef<HTMLElement>(null!),
      scrollDispatcherMock as any,
      null!,
      null!
    );
    let counter = 0;
    directive.elementScrolled().subscribe(() => ++counter);
    perfectScrollbarMock.psScrollX.next();
    expect(counter).toBe(1);
    perfectScrollbarMock.psScrollY.next();
    expect(counter).toBe(2);
  });
});
