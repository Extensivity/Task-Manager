package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"taskmanager/models"
	"taskmanager/store"
)

func HandleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		tasks := store.GetTasks()
		json.NewEncoder(w).Encode(tasks)
	case "POST":
		var task models.Task
		if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		store.AddTask(task)
		w.WriteHeader(http.StatusCreated)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HandleTask(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/tasks/")
	switch r.Method {
	case "GET":
		task, found := store.GetTask(id)
		if !found {
			http.Error(w, "Task not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(task)
	case "PUT":
		var task models.Task
		if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		store.UpdateTask(id, task)
	case "DELETE":
		store.DeleteTask(id)
		w.WriteHeader(http.StatusNoContent)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
