import { faker } from '@faker-js/faker';

export function getPriorityValue(prio) {
    const priority = { Low: 0, Medium: 1, High: 2 };
    return priority[prio];
}

export function createRandomTask(futureOnly=true) {
    const r = { days: 10 };
    const soon = faker.date.soon(r);
    const dueDate = futureOnly ? soon : faker.date.between({ from: faker.date.recent(r), to: soon })
    
    return {
        id: faker.number.int(),
        title: faker.lorem.word(),
        description: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
        priority: faker.helpers.arrayElement([0, 1, 2]),
        dueDate: dueDate
    };
}

export function createRandomTaskList(min=10, max=50) {
    const length = faker.number.int(min, max);
    return Array.from({ length }, () => createRandomTask(false));
}
