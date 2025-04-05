package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j")
	account1 := NewAccount(client1)

	client2, _ := NewClient("Jane Doe", "j@j")
	account2 := NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := NewTransaction(account1, account2, 100.0)
	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, account1.Balance, 900.0)
	assert.Equal(t, account2.Balance, 1100.0)
}

func TestCreateTransactionWithNegativeAmount(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j")
	account1 := NewAccount(client1)

	client2, _ := NewClient("Jane Doe", "j@j")
	account2 := NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := NewTransaction(account1, account2, -100.0)
	assert.NotNil(t, err)
	assert.Nil(t, transaction)

	assert.Equal(t, account1.Balance, 1000.0)
	assert.Equal(t, account2.Balance, 1000.0)
}

func TestCreateTransactionWithInsuficientBalance(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j")
	account1 := NewAccount(client1)

	client2, _ := NewClient("Jane Doe", "j@j")
	account2 := NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := NewTransaction(account1, account2, 2000.0)
	assert.NotNil(t, err)
	assert.Nil(t, transaction)

	assert.Error(t, err, "insufficient funds")

	assert.Equal(t, account1.Balance, 1000.0)
	assert.Equal(t, account2.Balance, 1000.0)
}
