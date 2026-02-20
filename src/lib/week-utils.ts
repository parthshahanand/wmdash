import dayjs from 'dayjs';

interface Week {
    id: string; // "Week 1", "Week 2", etc.
    label: string; // "Week 1: Feb 1 - Feb 5"
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
}

export const getWalmartWeeks = (year: number = 2025): Week[] => {
    const weeks: Week[] = [];

    // Week 1: Feb 1 - Feb 5 (Exception)
    const week1Start = dayjs(`${year}-02-01`).startOf('day');
    const week1End = dayjs(`${year}-02-05`).endOf('day');
    weeks.push({
        id: 'Week 1',
        label: `Week 1: Feb 1 - Feb 5`,
        start: week1Start,
        end: week1End,
    });

    // Start Week 2 from Feb 6 (Thursday)
    let currentStart = dayjs(`${year}-02-06`).startOf('day');
    let weekNum = 2;

    // Generate for the fiscal year until Feb 2026
    const endOfPeriod = dayjs(`${year + 1}-02-01`);

    while (currentStart.isBefore(endOfPeriod) && weekNum <= 52) {
        const currentEnd = currentStart.add(6, 'day').endOf('day');

        weeks.push({
            id: `Week ${weekNum}`,
            label: `Week ${weekNum}: ${currentStart.format('MMM D')} - ${currentEnd.format('MMM D')}`,
            start: currentStart,
            end: currentEnd,
        });
        currentStart = currentStart.add(7, 'day');
        weekNum++;
    }

    return weeks;
};

export const isDateInWeeks = (date: Date, selectedWeeks: string[], allWeeks: Week[]): boolean => {
    if (selectedWeeks.length === 0) return true;
    const d = dayjs(date);
    return selectedWeeks.some(weekId => {
        const week = allWeeks.find(w => w.id === weekId);
        if (!week) return false;
        // Inclusive check
        return (d.isAfter(week.start.subtract(1, 'second')) && d.isBefore(week.end.add(1, 'second')));
    });
};
