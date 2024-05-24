import '@testing-library/jest-dom';
import { createRandomTask, createRandomTaskList } from '../components/task.helper';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '@/services/taskService';
import { faker } from '@faker-js/faker';

global.fetch = jest.fn();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

describe('Task Service', () => {
    let fetchSpy;
    let errorSpy;

    beforeAll(() => {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
        }));
    });

    afterEach(() => {
        errorSpy.mockClear();
        fetchSpy.mockClear();
    });

    afterAll(() => {
        errorSpy.mockRestore();
        fetchSpy.mockRestore();
    });

    describe("Creation", () => {
        it('should notify the backend about a new task', async () => {
            const newTask = createRandomTask();
            const expectingPayload = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            }
            
            fetchSpy.mockResolvedValueOnce({
                ok: true,
                json: async () => newTask
            });
            
            const result = await createTask(newTask);
            
            expect(result).toEqual(newTask);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(expectingPayload)
            );
        });

        it.each(['title', 'description', 'dueDate', 'priority'])('should not add a task with a missing element (%s)', async (key) => {
            const newTask = createRandomTask();
            delete newTask[key];
            const expectingPayload = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            }

            const resolveErrorMessage = `${(key == 'dueDate') ? 'Due date' : capitalizeFirstLetter(key)} is required`
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 400,
                json: async () => ({ error: resolveErrorMessage })
            });
            
            await expect(createTask(newTask)).rejects.toThrow('Failed to create task');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(expectingPayload)
            );
        });
        it('should not add a task with a due date before the current day', async () => {
            const newTask = createRandomTask();
            newTask.dueDate = faker.date.past();
            const expectingPayload = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            }
            
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 400,
                json: async () => ({ error: 'Due date cannot be in the past' })
            });

            await expect(createTask(newTask)).rejects.toThrow('Failed to create task');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(expectingPayload)
            );
        });
        it('should not add a task with a negative priority', async () => {
            const newTask = createRandomTask();
            newTask.priority = -1;
            const expectingPayload = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            }
            
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 400,
                json: async () => ({ error: 'Priority must be a positive number' })
            });
    
            await expect(createTask(newTask)).rejects.toThrow('Failed to create task');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(expectingPayload)
            );
        });
    });
    
    describe("Read all tasks", () => {
        const payload = { method: 'GET', headers: { 'Content-Type': 'application/json' }};

        it('should handle a failure to fetch tasks', async () => {
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 500,
                json: async () => ({ error: 'Internal Server Error' })
            });

            await expect(getTasks()).rejects.toThrow('Failed to fetch tasks');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        })
        
        it('should handle an empty task list', async () => {
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => []});
            
            const result = await getTasks();
            
            expect(result).toEqual([]);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should fetch a list of tasks from the backend endpoint', async () => {
            const tasks = createRandomTaskList();
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => tasks});
            
            const result = await getTasks();
            
            expect(result).toEqual(tasks);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should handle tasks with special characters', async () => {
            const task = createRandomTask();
            task.description = 'Description with special characters: !@#$%^&*() and Unicode: 漢字';
            const tasks = [task];
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => tasks});
            
            const result = await getTasks();
            
            expect(result).toEqual(tasks);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should handle tasks with boundary dates', async () => {
            const tasks = [createRandomTask(), createRandomTask()];
            tasks[0].dueDate = faker.date.past();
            tasks[1].dueDate = faker.date.future();
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => tasks });

            const result = await getTasks();

            expect(result).toEqual(tasks);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should handle a large number of tasks efficiently', async () => {
            const tasks = createRandomTaskList(10**5, 10**6);
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => tasks });
    
            const result = await getTasks();
    
            expect(result).toEqual(tasks);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
    });
    
    describe("Read single task", () => {
        const payload = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

        it('should fail if the task id is negative', async () => {
            const taskId = -1
            await expect(getTaskById(taskId)).rejects.toThrow('Invalid task ID');
            expect(errorSpy).toHaveBeenCalledTimes(1);
        });
        it('should fail if the task does not exist', async () => {
            const taskId = 10**6;
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 404,
                json: async () => ({ error: 'Task not found' })
            });

            await expect(getTaskById(taskId)).rejects.toThrow('Failed to fetch task');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should fetch a single of task from the backend endpoint', async () => {
            const task = createRandomTask();
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => task });

            const result = await getTaskById(1);

            expect(result).toEqual(task);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should handle task with special characters', async () => {
            const task = createRandomTask();
            task.description = 'Description with special characters: !@#$%^&*() and Unicode: 漢字';
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => task });

            const result = await getTaskById(1);

            expect(result).toEqual(task);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it.each(['past', 'future'])('should handle task with boundary dates (%s)', async (boundary) => {
            const task = createRandomTask();
            task.dueDate = (boundary == 'past') ? faker.date.past() : faker.date.future();
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => task });

            const result = await getTaskById(1);

            expect(result).toEqual(task);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
    });
    
    describe("Update", () => {
        it('should fail if the task does not exist', async () => {
            const task = createRandomTask();
            const payload = {
                body: JSON.stringify(task), method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            };
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 404,
                json: async () => ({ error: 'Task not found' })
            });

            await expect(updateTask(999, task)).rejects.toThrow('Failed to update task');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should update the task with given id', async () => {
            const task = createRandomTask();
            const payload = {
                body: JSON.stringify(task), method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            };
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => ({ ...task, updated: true }) });
            
            const result = await updateTask(1, task);
            
            expect(result).toEqual({ ...task, updated: true });
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should handle multiple simultaneous updates', async () => {
            const tasks = [createRandomTask(), createRandomTask()];
            const updatedTasks = tasks.map(task => task);
            fetchSpy.mockImplementation((url, options) => {
                const taskId = parseInt(url.split('/').pop());
                const updatedTask = updatedTasks.find(task => task.id === taskId);
                return Promise.resolve({ ok: true, json: async () => ({ ...updatedTask, updated: true }) });
            });
            
            const results = await Promise.all(
                tasks.map(task => updateTask(task.id, task))
            );
            
            expect(results).toEqual([
                { ...updatedTasks[0], updated: true },
                { ...updatedTasks[1], updated: true }
            ]);
            tasks.forEach(task => {
                const payload = {
                    body: JSON.stringify(task), method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                };
                expect(fetchSpy).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.objectContaining(payload)
                );
            });
        });
    });
    
    describe("Delete", () => {
        const payload = { method: 'DELETE', headers: { 'Content-Type': 'application/json' }};
        
        it('should fail if the task does not exist', async () => {
            const taskId = 999;
            fetchSpy.mockResolvedValueOnce({
                ok: false, status: 404,
                json: async () => ({ error: 'Task not found' })
            });

            await expect(deleteTask(taskId)).rejects.toThrow('Failed to delete task');
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
        it('should handle the deletion of a task with given id', async () => {
            const taskId = 1;
            const message = { message: 'Task deleted successfully' };
            fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => message });

            const result = await deleteTask(taskId);

            expect(result).toEqual(message);
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining(payload)
            );
        });
    });
});