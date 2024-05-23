import { fireEvent, render } from '@testing-library/react';
import TaskItem from '@/components/TaskItem';
import { createRandomTask } from './task.helper';
import '@testing-library/jest-dom';


function getPriorityValue(prio) {
    const priority = { Low: 0, Medium: 1, High: 2 };
    return priority[prio];
}

describe('TaskItem Component', () => {
    let task;
    let actions;
    beforeEach(() => {
        task = createRandomTask();
        actions = {
            toggleCompleted: jest.fn(),
            editTask: jest.fn(),
            deleteTask: jest.fn()
        }
    });

    it('renders correctly with task details', () => {
        const { getByText } = render(<TaskItem task={task} actions={actions}/>);
        expect(getByText(task.title)).toBeInTheDocument();
        expect(getByText(task.description)).toBeInTheDocument();
        expect(getByText(task.dueDate.toString())).toBeInTheDocument();
    });

    it.each([true, false])('display the correct completed value (%s)', (completed) => {
        task.completed = completed;
        const { getByTestId } = render(<TaskItem task={task} actions={actions} />);
        if (completed) { expect(getByTestId('TestItem-checkbox')).toBeChecked(); }
        else { expect(getByTestId('TestItem-checkbox')).not.toBeChecked(); }
    });
    
    it.each(["Low", "Medium", "High"])('displays the correct priority (%s)', (priority) => {
        task.priority = getPriorityValue(priority);
        const { getByText } = render(<TaskItem task={task} actions={actions}/>);
        expect(getByText(priority)).toBeInTheDocument();
    });

    describe('calls the additional actions', () => {
        it('calls toggleCompleted function when checkbox is clicked', () => {
            const { getByTestId } = render(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TestItem-checkbox'));
            expect(actions.toggleCompleted).toHaveBeenCalledWith(task.id);
        });
        
        it('calls editTask function when edit button is clicked', () => {
            const { getByTestId } = render(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TestItem-edit'));
            expect(actions.toggleCompleted).toHaveBeenCalledWith(task.id);
        });
        
        it('calls editTask function when delete button is clicked', () => {
            const { getByTestId } = render(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TestItem-delete'));
            expect(actions.toggleCompleted).toHaveBeenCalledWith(task.id);
        });
    }); 
});

