import { faker } from '@faker-js/faker';

export function getPriorityValue(prio) {
    const priority = { Low: 0, Medium: 1, High: 2 };
    return priority[prio];
}

export function createRandomTask() {
    return {
        id: faker.number.int(),
        title: faker.lorem.word(),
        description: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
        priority: faker.helpers.arrayElement([0, 1, 2]),
        dueDate: faker.date.between({
            from: faker.date.recent({ days: 10 }),
            to: faker.date.soon({ days: 10 })
        })
    };
}

export function createRandomTaskList() {
    const length = faker.number.int(10, 50);
    return Array.from({ length }, createRandomTask);
}