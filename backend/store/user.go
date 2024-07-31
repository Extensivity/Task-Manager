package store

import (
	"errors"
	"sync"
	"taskmanager/models"
)

var (
	users  = make(map[string]string)
	userMu sync.Mutex
)

func AddUser(user models.User) error {
	userMu.Lock()
	defer userMu.Unlock()

	if _, exists := users[user.Username]; exists {
		return errors.New("user already exists")
	}
	users[user.Username] = user.Password
	return nil
}

func ValidateUser(user models.User) bool {
	userMu.Lock()
	defer userMu.Unlock()

	password, exists := users[user.Username]
	return exists && password == user.Password
}
