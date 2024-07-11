export default function TaskItem({ task, actions }) {
    const priority = ["Low", "Medium", "High"][task.priority];

    return (
        <tr data-testid="TaskItem" className="TaskItem">
            <td className="TaskItem-checkbox">
                <input
                    data-testid="TaskItem-checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => actions.toggleComplete(task.id)}
                />
            </td>
            <td data-testid="TaskItem-title" className="TaskItem-title">{task.title}</td>
            <td data-testid="TaskItem-description" className="TaskItem-description">{task.description}</td>
            <td data-testid="TaskItem-due date" className="TaskItem-duedate">{new Date(task.dueDate).toLocaleString()}</td>
            <td data-testid="TaskItem-priority" className="TaskItem-priority">{priority}</td>
            <td data-testid="TaskItem-actions" className="TaskItem-actions">
                <button data-testid="TaskItem-edit" className="TaskItem-button" onClick={() => actions.editTask(task.id)}>Edit</button>
                <button data-testid="TaskItem-delete" className="TaskItem-button" onClick={() => actions.deleteTask(task.id)}>Delete</button>
            </td>
        </tr>
    );
}
