export default function TaskItem({ task, actions }) {
    const priority = ["Low", "Medium", "High"][task.priority];
    const methods = {
        toggleCompleted: (e) => actions.toggleCompleted(task.id),
        editTask: (e) => {
            actions.editTask(task.id, {
                title: 'Updated Task 1'
            })
        },
        deleteTask: (e) => actions.deleteTask(task.id),
    };

    return (
        <tr data-testid="TestItem" className="TaskItem">
            <td className="TaskItem-checkbox">
                <input
                    data-testid="TestItem-checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={methods.toggleCompleted}
                />
            </td>
            <td data-testid="TaskItem-title" className="TaskItem-title">{task.title}</td>
            <td data-testid="TaskItem-description" className="TaskItem-description">{task.description}</td>
            <td data-testid="TaskItem-due date" className="TaskItem-duedate">{new Date(task.dueDate).toLocaleString()}</td>
            <td data-testid="TaskItem-priority" className="TaskItem-priority">{priority}</td>
            <td data-testid="TaskItem-actions" className="TaskItem-actions">
                <button data-testid="TestItem-edit" className="TaskItem-button" onClick={ methods.editTask }>Edit</button>
                <button data-testid="TestItem-delete" className="TaskItem-button" onClick={ methods.deleteTask }>Delete</button>
            </td>
        </tr>
    );
}
