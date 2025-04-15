package gateway

import "github.com/josemoura212/FullCycle/EDA/internal/entity"

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}