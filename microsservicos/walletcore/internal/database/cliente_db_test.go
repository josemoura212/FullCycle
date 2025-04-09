package database

import (
	"database/sql"
	"testing"

	"github.com/josemoura212/FullCycle/microsservicos/walletcore/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type ClienteDBTestSuite struct {
	suite.Suite
	db       *sql.DB
	clientDB *ClientDb
}

func (s *ClienteDBTestSuite) SetupTest() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	s.clientDB = NewClientDb(db)
}

func (s *ClienteDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
}

func TestClienteDBTestSuite(t *testing.T) {
	suite.Run(t, new(ClienteDBTestSuite))
}

func (s *ClienteDBTestSuite) TestSaveClient() {
	client := &entity.Client{
		ID:    "1",
		Name:  "John",
		Email: "j@J",
	}

	err := s.clientDB.Save(client)
	s.Nil(err)

}

func (s *ClienteDBTestSuite) TestGetClient() {
	client, _ := entity.NewClient("John", "j@J")
	s.clientDB.Save(client)

	clientDB, err := s.clientDB.Get(client.ID)
	s.Nil(err)
	s.Equal(client.ID, clientDB.ID)
	s.Equal(client.Name, clientDB.Name)
	s.Equal(client.Email, clientDB.Email)
	s.Equal(client.CreatedAt, clientDB.CreatedAt)
}
