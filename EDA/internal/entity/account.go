package entity

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID         string    `json:"id"`
	Client     *Client   `json:"client"`
	Balance    float64   `json:"balance"`
	CreatedAt  time.Time `json:"created_at"`
	UpadatedAt time.Time `json:"updated_at"`
}

func NewAccount(client *Client) *Account {
	if client == nil {
		return nil
	}
	account := &Account{
		ID:         uuid.New().String(),
		Client:     client,
		Balance:    0,
		CreatedAt:  time.Now(),
		UpadatedAt: time.Now(),
	}

	return account
}

func (a *Account) Credit(amount float64) {

	a.Balance += amount
	a.UpadatedAt = time.Now()
}

func (a *Account) Debit(amount float64) {

	a.Balance -= amount
	a.UpadatedAt = time.Now()
}
