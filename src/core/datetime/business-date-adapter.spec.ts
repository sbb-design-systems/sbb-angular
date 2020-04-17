import { BusinessDateAdapter } from './business-date-adapter';

describe('BusinessDateAdapter', () => {
  let businessDateAdapter: BusinessDateAdapter;
  beforeEach(() => {
    businessDateAdapter = new BusinessDateAdapter('de-ch', 50);
  });

  it('should parse date', () => {
    const params = [
      { input: '12.12.12', expectedYear: 2012, expectedMonth: 12, expectedDay: 12 },
      { input: '01.01.12', expectedYear: 2012, expectedMonth: 1, expectedDay: 1 },
      { input: '1.01.12', expectedYear: 2012, expectedMonth: 1, expectedDay: 1 },
      { input: '1.1.1', expectedYear: 2001, expectedMonth: 1, expectedDay: 1 },
      { input: '121220', expectedYear: 2020, expectedMonth: 12, expectedDay: 12 },
      { input: '12122020', expectedYear: 2020, expectedMonth: 12, expectedDay: 12 },
      { input: 'Sa, 01012020', expectedYear: 2020, expectedMonth: 1, expectedDay: 1 },
      { input: 'Sa,01012020', expectedYear: 2020, expectedMonth: 1, expectedDay: 1 },
      { input: '01012020', expectedYear: 2020, expectedMonth: 1, expectedDay: 1 },
      { input: '010100', expectedYear: 2000, expectedMonth: 1, expectedDay: 1 },
      { input: '01011802', expectedYear: 1802, expectedMonth: 1, expectedDay: 1 }
    ];

    params.forEach(param =>
      expect(businessDateAdapter.parse(param.input)!.getTime()).toBe(
        new Date(param.expectedYear, param.expectedMonth - 1, param.expectedDay).getTime()
      )
    );
  });

  it('should not parse date', () => {
    const params = [
      { input: '2020200' },
      { input: '0' },
      { input: '00' },
      { input: '000' },
      { input: '0000' },
      { input: '00000' },
      { input: '0000000' },
      { input: '000000000' }
    ];

    params.forEach(param => expect(businessDateAdapter.parse(param.input)).toBeNull());
  });
});
