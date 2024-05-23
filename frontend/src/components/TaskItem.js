export default function TaskItem({ task, actions }) {
    const priority = ["Low", "Medium", "High"][task.priority];
    const methods = {
        toggleCompleted: (e) => actions.toggleCompleted(task.id),
        editTask: (e) => actions.editTask(task.id),
        deleteTask: (e) => actions.deleteTask(task.id),
    };

    return (
        <tr className="TaskItem">
            <td className="TaskItem-checkbox">
                <input
                    data-testid="TestItem-checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={methods.toggleCompleted}
                />
            </td>
            <td className="TaskItem-title">{task.title}</td>
            <td className="TaskItem-description">{task.description}</td>
            <td className="TaskItem-duedate">{task.dueDate.toString()}</td>
            <td className="TaskItem-priority">{priority}</td>
            <td className="TaskItem-actions">
                <button data-testid="TestItem-edit" className="TaskItem-button" onClick={ methods.editTask }>Edit</button>
                <button data-testid="TestItem-delete" className="TaskItem-button" onClick={ methods.deleteTask }>Delete</button>
            </td>
        </tr>
    );
}
