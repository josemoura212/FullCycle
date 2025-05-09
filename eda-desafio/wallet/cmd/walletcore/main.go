package main

import (
	"context"
	"database/sql"
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
	"github.com/josemoura212/FullCycle/EDA/internal/database"
	"github.com/josemoura212/FullCycle/EDA/internal/event"
	"github.com/josemoura212/FullCycle/EDA/internal/event/handler"
	"github.com/josemoura212/FullCycle/EDA/internal/usecase/create_account"
	"github.com/josemoura212/FullCycle/EDA/internal/usecase/create_client"
	"github.com/josemoura212/FullCycle/EDA/internal/usecase/create_transaction"
	"github.com/josemoura212/FullCycle/EDA/internal/web"
	"github.com/josemoura212/FullCycle/EDA/internal/web/webserver"
	"github.com/josemoura212/FullCycle/EDA/pkg/events"
	"github.com/josemoura212/FullCycle/EDA/pkg/kafka"
	"github.com/josemoura212/FullCycle/EDA/pkg/uow"
)

func runMigrations(db *sql.DB) {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	if err != nil {
		panic(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS accounts (id varchar(255), client_id varchar(255), balance int, created_at date)")
	if err != nil {
		panic(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS transactions (id varchar(255), account_id_from varchar(255), account_id_to varchar(255), amount int, created_at date)")
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`INSERT INTO clients (id, name, email, created_at) VALUES
		('1', 'Client One', 'client1@example.com', NOW()),
		('2', 'Client Two', 'client2@example.com', NOW()),
		('3', 'Client Three', 'client3@example.com', NOW())
		ON DUPLICATE KEY UPDATE id=id`)
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`INSERT INTO accounts (id, client_id, balance, created_at) VALUES
		('1', '1', 1000, NOW()),
		('2', '2', 1000, NOW()),
		('3', '3', 1000, NOW())
		ON DUPLICATE KEY UPDATE id=id`)
	if err != nil {
		panic(err)
	}

	fmt.Println("Migrations executed")
}

func createKafkaTopics() {
	adminClient, err := ckafka.NewAdminClient(&ckafka.ConfigMap{"bootstrap.servers": "kafka:29092"})
	if err != nil {
		panic(fmt.Sprintf("Failed to create Kafka admin client: %s", err))
	}
	defer adminClient.Close()

	topics := []ckafka.TopicSpecification{
		{Topic: "transactions", NumPartitions: 1, ReplicationFactor: 1},
		{Topic: "balances", NumPartitions: 1, ReplicationFactor: 1},
	}

	_, err = adminClient.CreateTopics(context.Background(), topics)
	if err != nil {
		panic(fmt.Sprintf("Failed to create Kafka topics: %s", err))
	}

	fmt.Println("Kafka topics created: transactions, balances")
}

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "mysql", "3306", "wallet"))

	if err != nil {
		panic(err)
	}

	defer db.Close()

	runMigrations(db)

	createKafkaTopics()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}

	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispatcher := events.NewEventDispatcher()
	eventDispatcher.Register("TransactionCreated", handler.NewTransactionCreatedKafkaHandler(kafkaProducer))
	eventDispatcher.Register("BalanceUpdated", handler.NewUpdatedBalanceKafkaHandler(kafkaProducer))
	transactionCreatedEvent := event.NewTransactionCreated()
	balanceUpdatedEvent := event.NewBalanceUpdated()

	clientDB := database.NewClientDB(db)
	accountDB := database.NewAccountDB(db)

	ctx := context.Background()
	uow := uow.NewUow(ctx, db)

	uow.Register("AccountDB", func(tx *sql.Tx) interface{} {
		return database.NewAccountDB(db)
	})

	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})

	createClientUseCase := create_client.NewCreateClientUseCase(clientDB)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDB, clientDB)
	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent, balanceUpdatedEvent)

	webserver := webserver.NewWebServer(":8080")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webserver.AddHandler("/clients", clientHandler.CreateClient)
	webserver.AddHandler("/accounts", accountHandler.CreateAccount)
	webserver.AddHandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server is running")

	webserver.Start()
}
