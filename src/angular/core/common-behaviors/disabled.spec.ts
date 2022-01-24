import { mixinDisabled } from './disabled';

describe('MixinDisabled', () => {
  it('should augment an existing class with a disabled property', () => {
    class EmptyClass {}

    const classWithDisabled = mixinDisabled(EmptyClass);
    const instance = new classWithDisabled();

    expect(instance.disabled)
      .withContext('Expected the mixed-into class to have a disabled property')
      .toBe(false);

    instance.disabled = true;
    expect(instance.disabled)
      .withContext('Expected the mixed-into class to have an updated disabled property')
      .toBe(true);
  });
});
