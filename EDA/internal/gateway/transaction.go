package gateway

import "github.com/josemoura212/FullCycle/EDA/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}