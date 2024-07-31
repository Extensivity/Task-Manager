package main

import (
	"log"
	"net/http"
	"taskmanager/handlers"
)

func main() {
	http.HandleFunc("/tasks", handlers.HandleTasks)
	http.HandleFunc("/tasks/", handlers.HandleTask)
	http.HandleFunc("/login", handlers.HandleLogin)
	http.HandleFunc("/register", handlers.HandleRegister)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}
