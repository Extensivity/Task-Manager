import { useEffect, useState } from 'react';
import Modal from 'react-modal';

export default function TaskModal({ task, onSave, onClose, isOpen }) {
    const [formData, setFormData] = useState({});
    const [isModalOpen, setModalOpenState] = useState(isOpen);

    useEffect(() => {
        setModalOpenState(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (task) setFormData(task);
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isModalOpen} onRequestClose={onClose}>
            <h2>{task ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='TaskForm-title'>Title: </label>
                <input id='TaskForm-title' type="text" name="title" value={formData.title || ''} onChange={handleChange} />

                <label htmlFor='TaskForm-Description'>Description: </label>
                <input id='TaskForm-Description' type="text" name="description" value={formData.description || ''} onChange={handleChange} />

                <label htmlFor='TaskForm-dueDate'>Due Date: </label>
                <input id='TaskForm-dueDate' type="datetime-local" min={new Date().toISOString().slice(0, -8)} name="dueDate" value={formData.dueDate || ''} onChange={handleChange} />

                <label htmlFor='TaskForm-priority'>Priority: </label>
                <select id='TaskForm-priority' name="priority" value={formData.priority || 0} onChange={handleChange}>
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                </select>

                <button type="submit">{task ? 'Save' : 'Add'}</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </Modal>
    );
}
