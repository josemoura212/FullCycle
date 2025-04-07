package gateway

import "github.com/josemoura212/FullCycle/microsservicos/walletcore/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}