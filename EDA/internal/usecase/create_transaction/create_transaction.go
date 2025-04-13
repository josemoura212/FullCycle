package create_transaction

import (
	"github.com/josemoura212/FullCycle/EDA/internal/entity"
	"github.com/josemoura212/FullCycle/EDA/internal/gateway"
	"github.com/josemoura212/FullCycle/EDA/pkg/events"
)

type CreateTransactionInputDTO struct {
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type CreateTransactionOutputDTO struct {
	ID string `json:"id"`
}

type CreateTransactionUseCase struct {
	TransactionGateway gateway.TransactionGateway
	AccountGateway     gateway.AccountGateway
	eventDispatcher    events.EventDispatcherInterface
	transactionCreated events.EventInterface
}

func NewCreateTransactionUseCase(t gateway.TransactionGateway, a gateway.AccountGateway, e events.EventDispatcherInterface, transactionCreated events.EventInterface) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		TransactionGateway: t,
		AccountGateway:     a,
		eventDispatcher:    e,
		transactionCreated: transactionCreated,
	}
}

func (uc *CreateTransactionUseCase) Execute(input CreateTransactionInputDTO) (*CreateTransactionOutputDTO, error) {
	accountFrom, err := uc.AccountGateway.FindByID(input.AccountIDFrom)
	if err != nil {
		return nil, err
	}

	accountTo, err := uc.AccountGateway.FindByID(input.AccountIDTo)
	if err != nil {
		return nil, err
	}

	transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)
	if err != nil {
		return nil, err
	}

	err = uc.TransactionGateway.Create(transaction)
	if err != nil {
		return nil, err
	}

	output := &CreateTransactionOutputDTO{
		ID: transaction.ID,
	}

	uc.transactionCreated.SetPayload(output)
	uc.eventDispatcher.Dispatch(uc.transactionCreated)

	return output, nil
}
