import { fireEvent, render } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import TaskItem from '../../src/components/TaskItem';
import '@testing-library/jest-dom'


function getPriorityValue(prio) {
    const priority = { Low: 0, Medium: 1, High: 2 }
    return priority[prio]
}


function createRandomTask() {
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
    }
}

describe('TaskItem Component', () => {
    let task;
    beforeEach(() => { task = createRandomTask() });

    it('renders correctly with task details', () => {
        const { getByText } = render(<TaskItem task={task} />);
        expect(getByText(task.title)).toBeInTheDocument();
        expect(getByText(task.description)).toBeInTheDocument();
        expect(getByText(task.dueDate)).toBeInTheDocument();
    });
    
    it.each(["Low", "Medium", "High"])('displays the correct priority (%s)', (priority) => {
        task.priority = getPriorityValue(priority);
        const { getByText } = render(<TaskItem task={task} />);
        expect(getByText(priority).toBeInTheDocument());
    });
    
    it('calls toggleCompleted function when clicked', () => {
        const toggleCompleted = jest.fn();
        const { getByTestId } = render(<TaskItem task={task} toggleCompleted={toggleCompleted} />);
        fireEvent.click(getByTestId('test-item'));
        expect(toggleCompleted).toHaveBeenCalledWith(task.id);
    });
});

