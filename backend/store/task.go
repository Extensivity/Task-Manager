package store

import (
	"sync"
	"taskmanager/models"
)

var (
	tasks = make(map[string]models.Task)
	mu    sync.Mutex
)

func GetTasks() []models.Task {
	mu.Lock()
	defer mu.Unlock()

	result := make([]models.Task, 0, len(tasks))
	for _, task := range tasks {
		result = append(result, task)
	}
	return result
}

func GetTask(id string) (models.Task, bool) {
	mu.Lock()
	defer mu.Unlock()

	task, exists := tasks[id]
	return task, exists
}

func AddTask(task models.Task) {
	mu.Lock()
	defer mu.Unlock()

	tasks[task.ID] = task
}

func UpdateTask(id string, task models.Task) {
	mu.Lock()
	defer mu.Unlock()

	if _, exists := tasks[id]; exists {
		tasks[id] = task
	}
}

func DeleteTask(id string) {
	mu.Lock()
	defer mu.Unlock()

	delete(tasks, id)
}
