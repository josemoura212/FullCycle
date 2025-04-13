package create_transaction

import (
	"context"

	"github.com/josemoura212/FullCycle/EDA/internal/entity"
	"github.com/josemoura212/FullCycle/EDA/internal/gateway"
	"github.com/josemoura212/FullCycle/EDA/pkg/events"
	"github.com/josemoura212/FullCycle/EDA/pkg/uow"
)

type CreateTransactionInputDTO struct {
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type CreateTransactionOutputDTO struct {
	ID            string  `json:"id"`
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type CreateTransactionUseCase struct {
	uow                uow.UowInterface
	eventDispatcher    events.EventDispatcherInterface
	transactionCreated events.EventInterface
}

func NewCreateTransactionUseCase(
	uow uow.UowInterface,
	e events.EventDispatcherInterface,
	transactionCreated events.EventInterface,
) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		uow:                uow,
		eventDispatcher:    e,
		transactionCreated: transactionCreated,
	}
}

func (uc *CreateTransactionUseCase) Execute(ctx context.Context, input CreateTransactionInputDTO) (*CreateTransactionOutputDTO, error) {
	output := &CreateTransactionOutputDTO{}
	err := uc.uow.Do(ctx, func(_ *uow.Uow) error {
		accouuntRepository := uc.GetAccountRepository(ctx)
		transactionRepository := uc.GetTransactionRepository(ctx)

		accountFrom, err := accouuntRepository.FindByID(input.AccountIDFrom)
		if err != nil {
			return err
		}

		accountTo, err := accouuntRepository.FindByID(input.AccountIDTo)
		if err != nil {
			return err
		}

		transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)
		if err != nil {
			return err
		}

		err = accouuntRepository.UpdateBalance(accountFrom)
		if err != nil {
			return err
		}

		err = accouuntRepository.UpdateBalance(accountTo)
		if err != nil {
			return err
		}

		err = transactionRepository.Create(transaction)
		if err != nil {
			return err
		}

		output.ID = transaction.ID
		output.AccountIDFrom = input.AccountIDFrom
		output.AccountIDTo = input.AccountIDTo
		output.Amount = input.Amount

		return nil
	})

	if err != nil {
		return nil, err
	}

	uc.transactionCreated.SetPayload(output)
	uc.eventDispatcher.Dispatch(uc.transactionCreated)

	return output, nil
}

func (uc *CreateTransactionUseCase) GetAccountRepository(ctx context.Context) gateway.AccountGateway {
	repo, err := uc.uow.GetRepository(ctx, "AccountDB")
	if err != nil {
		panic(err)
	}
	return repo.(gateway.AccountGateway)
}

func (uc *CreateTransactionUseCase) GetTransactionRepository(ctx context.Context) gateway.TransactionGateway {
	repo, err := uc.uow.GetRepository(ctx, "TransactionDB")
	if err != nil {
		panic(err)
	}
	return repo.(gateway.TransactionGateway)
}
