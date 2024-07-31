package store

import (
	"sync"
	"taskmanager/models"
)

var (
	tasks  = make(map[string]models.Task)
	taskMu sync.Mutex
)

func GetTasks() []models.Task {
	taskMu.Lock()
	defer taskMu.Unlock()

	result := make([]models.Task, 0, len(tasks))
	for _, task := range tasks {
		result = append(result, task)
	}
	return result
}

func GetTask(id string) (models.Task, bool) {
	taskMu.Lock()
	defer taskMu.Unlock()

	task, exists := tasks[id]
	return task, exists
}

func AddTask(task models.Task) {
	taskMu.Lock()
	defer taskMu.Unlock()

	tasks[task.ID] = task
}

func UpdateTask(id string, task models.Task) {
	taskMu.Lock()
	defer taskMu.Unlock()

	if _, exists := tasks[id]; exists {
		tasks[id] = task
	}
}

func DeleteTask(id string) {
	taskMu.Lock()
	defer taskMu.Unlock()

	delete(tasks, id)
}
