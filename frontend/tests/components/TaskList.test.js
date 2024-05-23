import { render } from '@testing-library/react';
import TaskList from '@/components/TaskList';
import TaskItem from '@/components/TaskItem';
import { createRandomTaskList } from './task.helper';
import '@testing-library/jest-dom';


jest.mock('../../src/components/TaskItem', () => jest.fn(({ task, actions }) => (
    <tr data-task-id={task.id}>
        <td>{task.title}</td>
        <td>{task.description}</td>
        <td>{task.dueDate.toString()}</td>
    </tr>
)))

const mockActions = {
    toggleCompleted: jest.fn(),
    deleteTask: jest.fn(),
    editTask: jest.fn()
};


describe('TaskList Component', () => {
    let tasks;

    beforeEach(() => {
        tasks = createRandomTaskList();
    });

    it('renders each task', () => {
        render(<TaskList tasks={tasks} actions={mockActions} />);
        expect(TaskItem).toHaveBeenCalledTimes(tasks.length);
        tasks.forEach(task => {expect(TaskItem).toHaveBeenCalledWith({task, actions: mockActions}, {})});
    });

    it('does not crash on an empty list', () => {
        const tasks = [];
        const {getByText} = render(<TaskList tasks={tasks} actions={mockActions} />);
        expect(getByText('No tasks available')).toBeInTheDocument();
    });
});
