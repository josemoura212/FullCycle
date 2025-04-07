package gateway

import "github.com/josemoura212/FullCycle/microsservicos/walletcore/internal/entity"

type AccountGateway interface {
	Save(account *entity.Account) error
	FindByID(id string) (*entity.Account, error)
}