package entity

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID          string    `json:"id"`
	AccountFrom *Account  `json:"account_from"`
	AccountTo   *Account  `json:"account_to"`
	Amount      float64   `json:"amount"`
	CreatedAt   time.Time `json:"created_at"`
}

func NewTransaction(accountFrom *Account, accountTo *Account, amount float64) (*Transaction, error) {
	transaction := &Transaction{
		ID:          uuid.NewString(),
		AccountFrom: accountFrom,
		AccountTo:   accountTo,
		Amount:      amount,
		CreatedAt:   time.Now(),
	}

	if err := transaction.Validate(); err != nil {
		return nil, err
	}

	transaction.Commit()

	return transaction, nil
}

func (t *Transaction) Commit() {
	t.AccountFrom.Debit(t.Amount)
	t.AccountTo.Credit(t.Amount)
}

func (t *Transaction) Validate() error {
	if t.Amount <= 0 {
		return errors.New("amount must be greater than zero")
	}
	if t.AccountFrom.Balance < t.Amount {
		return errors.New("insufficient funds")
	}
	return nil
}
