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
            toggleCompleted: jest.fn(),
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
        if (completed) { expect(getByTestId('TestItem-checkbox')).toBeChecked(); }
        else { expect(getByTestId('TestItem-checkbox')).not.toBeChecked(); }
    });
    
    it.each(["Low", "Medium", "High"])('displays the correct priority (%s)', (priority) => {
        task.priority = getPriorityValue(priority);
        const { getByText } = renderWrapper(<TaskItem task={task} actions={actions}/>);
        expect(getByText(priority)).toBeInTheDocument();
    });

    describe('calls the additional actions', () => {
        it('calls toggleCompleted function when checkbox is clicked', () => {
            const { getByTestId } = renderWrapper(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TestItem-checkbox'));
            expect(actions.toggleCompleted).toHaveBeenCalledWith(task.id);
        });

        describe('Edit Task Modal', () => {
            it.todo('should open the modal when edit button is clicked');
            it.todo('after modal is open, it should modify a task, then call editTask');
        });
        
        it('calls deleteTask function when delete button is clicked', () => {
            const { getByTestId } = renderWrapper(<TaskItem task={task} actions={actions} />);
            fireEvent.click(getByTestId('TestItem-delete'));
            expect(actions.deleteTask).toHaveBeenCalledWith(task.id);
        });
    }); 
});

