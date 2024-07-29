import ProtectedRoute from "@/components/ProtectedRoute";
import TaskManager from "@/components/TaskManager";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <TaskManager />
        </ProtectedRoute>
    );
}
