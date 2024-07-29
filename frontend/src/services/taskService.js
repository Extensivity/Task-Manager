const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const getTasks = async () => {
    try {
        const payload = { method: 'GET', headers: { 'Content-Type': 'application/json' }}
        const response = await fetch(`${API_URL}/tasks`, payload);
        if (!response.ok) { throw new Error('Failed to fetch tasks'); }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getTaskById = async (id) => {
    try {
        if (id < 0) throw new Error('Invalid task ID');
        const payload = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
        const response = await fetch(`${API_URL}/tasks/${id}`, payload);
        if (!response.ok) { throw new Error('Failed to fetch task'); }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const payload = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        };
        const response = await fetch(`${API_URL}/tasks`, payload);
        if (!response.ok) { throw new Error('Failed to create task'); }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateTask = async (id, taskData) => {
    try {
        const payload = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        };
        const response = await fetch(`${API_URL}/tasks/${id}`, payload);
        if (!response.ok) { throw new Error('Failed to update task'); }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const payload = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        const response = await fetch(`${API_URL}/tasks/${id}`, payload);
        if (!response.ok) { throw new Error('Failed to delete task'); }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const taskService = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};

export default taskService;
