import TaskList from '@/components/TaskList';
import { deleteTask, getTasks, updateTask } from '@/services/taskService';
import { useEffect, useState, useCallback } from 'react';

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
    const [filterConfig, setFilterConfig] = useState({ completed: 'all' });

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
        toggleCompleted: async (taskId) => {
            const task = tasks.find((task) => task.id === taskId);
            const completed = !task.completed;
            await updateTask(taskId, { ...task, completed });
            await fetchTasks();
        },
        editTask: async (taskId, update) => {
            await updateTask(taskId, update);
            await fetchTasks();
        },
        deleteTask: async (taskId) => {
            await deleteTask(taskId);
            await fetchTasks();
        }
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
                <button className='TaskManager-add TaskManager-btn'>Add Task</button>
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
        </div>
    );
}
