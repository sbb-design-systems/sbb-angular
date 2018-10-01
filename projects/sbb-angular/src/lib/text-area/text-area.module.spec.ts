import { TextAreaModule } from './text-area.module';

describe('TextAreaModule', () => {
  let textAreaModule: TextAreaModule;

  beforeEach(() => {
    textAreaModule = new TextAreaModule();
  });

  it('should create an instance', () => {
    expect(textAreaModule).toBeTruthy();
  });
});
