import '@testing-library/jest-dom';
import TaskManager from '@/components/TaskManager';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import taskService from '@/services/taskService';


jest.mock('../../src/services/taskService');


describe('TaskManager Component', () => {
    const dateTime = new Date(10 ** 6);
    const testTasks = [
        { id: 1, title: 'Task 4', completed: false, description: 'Task A', dueDate: dateTime + 5, priority: 0 },
        { id: 2, title: 'Task 5', completed: true, description: 'Task B', dueDate: dateTime + 4, priority: 1 },
        { id: 3, title: 'Task 6', completed: false, description: 'Task C', dueDate: dateTime + 3, priority: 2 },
        { id: 4, title: 'Task 1', completed: true, description: 'Task D', dueDate: dateTime + 2, priority: 0 },
        { id: 5, title: 'Task 2', completed: false, description: 'Task E', dueDate: dateTime + 1, priority: 1 },
        { id: 6, title: 'Task 3', completed: true, description: 'Task F', dueDate: dateTime + 0, priority: 2 },
    ];4

    beforeEach(() => {
        jest.clearAllMocks();
        taskService.getTasks.mockResolvedValue(testTasks);
        act(() => render(<TaskManager />));
    });

    it('renders the loading message initially', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    });

    it('renders TaskManager component after getting tasks', async () => {
        const taskTitle = testTasks[0].title;
        await waitFor(() => expect(screen.getByText(taskTitle)).toBeInTheDocument());
        testTasks.forEach(task => expect(screen.getByText(task.title)).toBeInTheDocument());
    });

    it('should open a modal when "Add Task" button is clicked', async () => {
        await waitFor(() => expect(screen.getByText('Add Task')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Add Task'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText('Title:')).toBeInTheDocument();
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
        expect(screen.getByLabelText('Due Date:')).toBeInTheDocument();
        expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
    });

    describe.each(['Completed'])('Filtering %s', (filter) => {
        const incompleteTasks = [testTasks[0], testTasks[2], testTasks[4]];
        const completedTasks = [testTasks[1], testTasks[3], testTasks[5]];

        it(`should not show ${filter.toLowerCase()} tasks on first click`, async () => {
            await waitFor(() => expect(screen.getByText(testTasks[0].title)).toBeInTheDocument());
            fireEvent.click(screen.getByText(filter));

            if (filter === 'Completed') {
                incompleteTasks.forEach(task => expect(screen.getByText(task.title)).toBeVisible());
                completedTasks.forEach(task => expect(screen.queryByText(task.title)).toBeNull());
            }
        });

        it(`should show ${filter.toLowerCase()} tasks on second click`, async () => {
            await waitFor(() => expect(screen.getByText(testTasks[0].title)).toBeInTheDocument());
            fireEvent.click(screen.getByText(filter));
            fireEvent.click(screen.getByText(filter));

            if (filter === 'Completed') {
                completedTasks.forEach(task => expect(screen.getByText(task.title)).toBeVisible());
                incompleteTasks.forEach(task => expect(screen.queryByText(task.title)).toBeNull());
            }
        });

        it(`should show all tasks on third click`, async () => {
            await waitFor(() => expect(screen.getByText(testTasks[0].title)).toBeInTheDocument());
            fireEvent.click(screen.getByText(filter));
            fireEvent.click(screen.getByText(filter));
            fireEvent.click(screen.getByText(filter));

            testTasks.forEach(task => expect(screen.getByText(task.title)).toBeVisible());
        });
    });

    describe.each(['Title', 'Description', 'Due Date', 'Priority'])('Sorting %s', (sorter) => {
        const sortTitle = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6'];
        const sortDesc = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E', 'Task F'];
        const sortDate = testTasks.map(task => new Date(task.dueDate).toLocaleString()).reverse();
        const sortPrio = ['Low', 'Low', 'Medium', 'Medium', 'High', 'High'];

        it(`should sort ${sorter.toLowerCase()} in ascending order on first click`, async () => {
            await waitFor(() => screen.getByText(testTasks[0].title));
            act(() => {
                fireEvent.click(screen.getByText(sorter));
            });

            const testElements = screen.getAllByTestId(`TaskItem-${sorter.toLowerCase()}`).map(element => element.textContent);
            switch (sorter) {
                case 'Title': expect(testElements).toEqual(sortTitle); break;
                case 'Description': expect(testElements).toEqual(sortDesc); break;
                case 'Due Date': expect(testElements).toEqual(sortDate); break;
                case 'Priority': expect(testElements).toEqual(sortPrio); break;
                default: break;
            }
        });

        it(`should sort ${sorter.toLowerCase()} in descending order on second click`, async () => {
            await waitFor(() => screen.getByText(testTasks[0].title));
            act(() => {
                fireEvent.click(screen.getByText(sorter));
                fireEvent.click(screen.getByText(sorter));
            });

            const testElements = screen.getAllByTestId(`TaskItem-${sorter.toLowerCase()}`).map(element => element.textContent);
            switch (sorter) {
                case 'Title': expect(testElements).toEqual(sortTitle.reverse()); break;
                case 'Description': expect(testElements).toEqual(sortDesc.reverse()); break;
                case 'Due Date': expect(testElements).toEqual(sortDate.reverse()); break;
                case 'Priority': expect(testElements).toEqual(sortPrio.reverse()); break;
                default: break;
            }
        });

        it(`should revert to original order on third click`, async () => {
            await waitFor(() => screen.getByText(testTasks[0].title));
            act(() => {
                fireEvent.click(screen.getByText(sorter));
                fireEvent.click(screen.getByText(sorter));
                fireEvent.click(screen.getByText(sorter));
            });

            const testElements = screen.getAllByTestId(`TaskItem-${sorter.toLowerCase()}`).map(element => element.textContent);
            let expected = [];
            switch (sorter) {
                case 'Title': expected = testTasks.map(task => task.title); break;
                case 'Description': expected = testTasks.map(task => task.description); break;
                case 'Due Date': expected = testTasks.map(task => new Date(task.dueDate).toLocaleString()); break;
                case 'Priority':
                    expected = testTasks.map(task => {
                        if (task.priority === 0) return 'Low';
                        if (task.priority === 1) return 'Medium';
                        if (task.priority === 2) return 'High';
                        else return 'Unknown';
                    });
                    break;
                default: break;
            }

            expect(testElements).toEqual(expected);
        });
    });
});

describe('TaskManager Actions', () => {
    const testTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', dueDate: new Date(), priority: 0, completed: false },
        { id: 2, title: 'Task 2', description: 'Description 2', dueDate: new Date(), priority: 1, completed: true },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        taskService.getTasks.mockResolvedValue(testTasks);
    });

    it('toggleCompleted action', async () => {
        render(<TaskManager />);

        await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

        taskService.updateTask.mockResolvedValueOnce({});
        taskService.getTasks.mockResolvedValueOnce([
            { ...testTasks[0], completed: true },
            testTasks[1]
        ]);

        // Simulate the user clicking the checkbox to complete the task
        const checkbox = screen.getAllByTestId('TaskItem-checkbox')[0];
        fireEvent.click(checkbox);

        // Verify that the updateTask and getTasks functions are called as expected
        await waitFor(() => {
            expect(taskService.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ completed: true }));
            expect(taskService.getTasks).toHaveBeenCalledTimes(2);
        });
    });


    it('editTask action | open modal to edit task', async () => {
        // editTask action doesn't actually call the api to edit a task
        // it should only open the modal, to allow editing of the task
        render(<TaskManager />);

        await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

        const editButton = screen.getAllByTestId('TaskItem-edit')[0];
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByLabelText('Title:')).toBeInTheDocument();
            expect(screen.getByLabelText('Description:')).toBeInTheDocument();
            expect(screen.getByLabelText('Due Date:')).toBeInTheDocument();
            expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
        });

    });

    it('deleteTask action', async () => {
        render(<TaskManager />);

        await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

        taskService.deleteTask.mockResolvedValueOnce({});
        taskService.getTasks.mockResolvedValueOnce([testTasks[1]]);

        const deleteButton = screen.getAllByTestId('TaskItem-delete')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(taskService.deleteTask).toHaveBeenCalledWith(1);
            expect(taskService.getTasks).toHaveBeenCalledTimes(2);
        });
    });
});
