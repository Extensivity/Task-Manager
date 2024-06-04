import TaskItem from '@/components/TaskItem';

export default function TaskList({ tasks, actions }) {
    return (
        <tbody data-testid='TaskList' className='TestList'>
            {tasks.length === 0 ? (
                <tr>
                    <td colSpan="5">No tasks available</td>
                </tr>
            ) : (
                tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        actions={actions}
                    />
                ))
            )}
        </tbody>
    );
}
