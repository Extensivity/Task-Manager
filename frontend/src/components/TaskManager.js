import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';
import { useEffect, useState, useCallback } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '@/services/taskService';


export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
    const [filterConfig, setFilterConfig] = useState({ completed: 'all' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        let tempTasks = [...tasks];
        if (filterConfig.completed !== 'all') {
            tempTasks = tempTasks.filter(task =>
                filterConfig.completed === 'incomplete' ? !task.completed : task.completed
            );
        }

        if (sortConfig.key && sortConfig.direction !== 'default') {
            tempTasks.sort((a, b) => {
                const multi = sortConfig.direction === 'asc' ? 1 : -1;
                if (a[sortConfig.key] < b[sortConfig.key]) return -1 * multi;
                if (a[sortConfig.key] > b[sortConfig.key]) return 1 * multi;
                return 0;
            });
        }

        setFilteredTasks(tempTasks);
    }, [tasks, filterConfig, sortConfig]);

    const actions = {
        toggleComplete: async (taskId) => {
            let task = tasks.find((task) => task.id == taskId);
            await updateTask(task.id, { ...task, completed: !task.completed });
            fetchTasks();
        },
        editTask: (taskId) => {
            let task = tasks.find((task) => task.id == taskId);
            setTaskToEdit(task);
            setIsModalOpen(true);
        },
        deleteTask: async (taskId) => {
            await deleteTask(taskId);
            fetchTasks();
        }
    };

    const handleAddTask = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (task) => {
        if (taskToEdit) await updateTask(taskToEdit.id, task);
        else await createTask(task);
        fetchTasks();
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const sortTasks = (key) => () => {
        setSortConfig((prevState) => {
            let direction = 'asc';
            if (prevState.key === key) {
                if (prevState.direction === 'asc') direction = 'desc';
                if (prevState.direction === 'desc') direction = 'default';
            }
            return { key, direction };
        });
    };

    const filterTasksByCompletion = () => {
        setFilterConfig((prevState) => {
            let completed = 'incomplete';
            if (prevState.completed === 'incomplete') completed = 'complete';
            if (prevState.completed === 'complete') completed = 'all';
            return { ...prevState, completed };
        });
    };

    if (loading) {
        return (
            <div className='TaskManager'>
                <span className='TaskManager-loading'>
                    Loading...
                </span>
            </div>
        );
    }

    return (
        <div className='TaskManager'>
            <div className="TaskManager-header">
                <h1 className='TaskManager-title'>Task List</h1>
                <button className='TaskManager-add TaskManager-btn' onClick={handleAddTask}>Add Task</button>
            </div>
            <table className='TaskManager-table'>
                <thead className='TaskManager-table-header'>
                    <tr>
                        <th onClick={filterTasksByCompletion}>Completed</th>
                        <th onClick={sortTasks('title')}>Title</th>
                        <th onClick={sortTasks('description')}>Description</th>
                        <th onClick={sortTasks('dueDate')}>Due Date</th>
                        <th onClick={sortTasks('priority')}>Priority</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <TaskList tasks={filteredTasks} actions={actions} />
            </table>
            <TaskModal task={taskToEdit} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} />
        </div>
    );
}
