import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import TaskItem from '@/components/TaskItem';
import { getPriorityValue, createRandomTask } from './task.helper';


function renderWrapper(child) {
    const TaskItemWrapper = ({children}) => (
        <table>
            <tbody>
                {children}
            </tbody>
        </table>
    );

    return render(
        <TaskItemWrapper>
            {child}
        </TaskItemWrapper>
    );
}


describe('TaskItem Component', () => {
    let task;
    let actions;
    beforeEach(() => {
        task = createRandomTask();
        actions = {
            toggleComplete: jest.fn(),
            editTask: jest.fn(),
            deleteTask: jest.fn()
        }
    });

    it('renders correctly with task details', () => {
        const { getByText } = renderWrapper(<TaskItem task={task} actions={actions} />);
        expect(getByText(task.title)).toBeInTheDocument();
        expect(getByText(task.description)).toBeInTheDocument();
        expect(getByText(new Date(task.dueDate).toLocaleString())).toBeInTheDocument();
    });

    it.each([true, false])('display the correct completed value (%s)', (completed) => {
        task.completed = completed;
        const { getByTestId } = renderWrapper(<TaskItem task={task} actions={actions} />);
        const element = getByTestId('TaskItem-checkbox')
        if (completed) expect(element).toBeChecked();
        else expect(element).not.toBeChecked();
    });
    
    it.each(["Low", "Medium", "High"])('displays the correct priority (%s)', (priority) => {
        task.priority = getPriorityValue(priority);
        const { getByText } = renderWrapper(<TaskItem task={task} actions={actions}/>);
        expect(getByText(priority)).toBeInTheDocument();
    });

    describe('calls the additional actions', () => {
        it('calls toggleComplete function when checkbox is clicked', () => {
            const { getByTestId } = renderWrapper(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TaskItem-checkbox'));
            expect(actions.toggleComplete).toHaveBeenCalledWith(task.id);
        });

        it('calls editTask function when edit button is clicked', () => {
            const { getByTestId } = renderWrapper(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TaskItem-edit'));
            expect(actions.editTask).toHaveBeenCalledWith(task.id);
        });
        
        it('calls deleteTask function when delete button is clicked', () => {
            const { getByTestId } = renderWrapper(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TaskItem-delete'));
            expect(actions.deleteTask).toHaveBeenCalledWith(task.id);
        });
    }); 
});

