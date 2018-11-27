import { DateFormats } from './date-formats';


export const DATE_PIPE_DATE_FORMATS: DateFormats = {
    parse: {
        dateInput: 'dd.MM.yyyy'
    },
    display: {
        monthLabel: 'MMM',
        dateInput: 'EEEEEE, dd.MM.yyyy',
        yearLabel: 'yyyy',
        dateA11yLabel:'dd MM yyyy',
        monthA11yLabel: 'MMMM' ,
        yearA11yLabel: 'yyyy'
    }
};
