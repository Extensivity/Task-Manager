import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskModal from '@/components/TaskModal';
import Modal from 'react-modal';

const mockOnSave = jest.fn();
const mockOnClose = jest.fn();

describe('TaskModal Component', () => {
    const mockTask = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-06-05T10:00',
        priority: 1,
    };

    beforeAll(() => {
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
        Modal.setAppElement('#root');
    });

    beforeEach(() => {
        mockOnSave.mockClear();
        mockOnClose.mockClear();
    });

    it('renders the modal when isOpen is true', () => {
        render(
            <TaskModal
                task={null}
                onSave={mockOnSave}
                onClose={mockOnClose}
                isOpen={true}
            />,
            { container: document.getElementById('root') }
        );

        expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    it('renders the task details for editing when task is provided', () => {
        render(
            <TaskModal
                task={mockTask}
                onSave={mockOnSave}
                onClose={mockOnClose}
                isOpen={true}
            />,
            { container: document.getElementById('root') }
        );

        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2024-06-05T10:00')).toBeInTheDocument();
        expect(screen.getByLabelText(/Priority:/i)).toHaveValue('1');
    });

    it('handles input changes correctly', () => {
        render(
            <TaskModal
                task={null}
                onSave={mockOnSave}
                onClose={mockOnClose}
                isOpen={true}
            />,
            { container: document.getElementById('root') }
        );

        fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'New Description' } });
        fireEvent.change(screen.getByLabelText(/Due Date:/i), { target: { value: '2024-06-10T10:00' } });
        fireEvent.change(screen.getByLabelText(/Priority:/i), { target: { value: '2' } });

        expect(screen.getByDisplayValue('New Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('New Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2024-06-10T10:00')).toBeInTheDocument();
        expect(screen.getByLabelText(/Priority:/i)).toHaveValue('2');
    });

    it('calls onSave and onClose on form submission', async () => {
        render(
            <TaskModal
                task={null}
                onSave={mockOnSave}
                onClose={mockOnClose}
                isOpen={true}
            />,
            { container: document.getElementById('root') }
        );

        fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'New Description' } });
        fireEvent.change(screen.getByLabelText(/Due Date:/i), { target: { value: '2024-06-10T10:00' } });
        fireEvent.change(screen.getByLabelText(/Priority:/i), { target: { value: '2' } });

        fireEvent.submit(screen.getByRole('button', { name: /Add/i }));

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith({
                title: 'New Task',
                description: 'New Description',
                dueDate: '2024-06-10T10:00',
                priority: '2'
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('calls onClose when the modal is closed via close button', () => {
        render(
            <TaskModal
                task={null}
                onSave={mockOnSave}
                onClose={mockOnClose}
                isOpen={true}
            />,
            { container: document.getElementById('root') }
        );

        fireEvent.click(screen.getByRole('button', { name: /Close/i }));

        expect(mockOnClose).toHaveBeenCalled();
    });
});