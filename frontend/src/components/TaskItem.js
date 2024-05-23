export default function TaskItem({ task, actions }) {
    const priority = ["Low", "Medium", "High"][task.priority];
    return (
        <tr className="TaskItem">
            <td className="TaskItem-checkbox">
                <input data-testid="TestItem-checkbox" type="checkbox" checked={task.completed} onChange={ actions.toggleCompleted(task.id) } />
            </td>
            <td className="TaskItem-title">{task.title}</td>
            <td className="TaskItem-description">{task.description}</td>
            <td className="TaskItem-duedate">{task.dueDate.toString()}</td>
            <td className="TaskItem-priority">{priority}</td>
            <td className="TaskItem-actions">
                <button data-testid="TestItem-edit" className="TaskItem-button" onClick={ actions.editTask(task.id) }>Edit</button>
                <button data-testid="TestItem-delete" className="TaskItem-button" onClick={ actions.deleteTask(task.id) }>Delete</button>
            </td>
        </tr>
    );
}
