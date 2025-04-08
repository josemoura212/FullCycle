package database

import (
	"database/sql"

	"github.com/josemoura212/FullCycle/microsservicos/walletcore/internal/entity"
)

type ClientDb struct {
	DB *sql.DB
}

func NewClientDb(db *sql.DB) *ClientDb {
	return &ClientDb{DB: db}
}

func (c *ClientDb) Get(id string) (*entity.Client, error) {
	clint := &entity.Client{}

	stmt, err := c.DB.Prepare("SELECT id, name, email created_at FROM clients WHERE id = ?")

	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(id)

	if err := row.Scan(&clint.ID, &clint.Name, &clint.Email, &clint.CreatedAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return clint, nil
}

func (c *ClientDb) Save(client *entity.Client) error {
	stmt, err := c.DB.Prepare("INSERT INTO clients (id,name, email,create_at) VALUES (?, ?,?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(client.ID, client.Name, client.Email, client.CreatedAt)

	if err != nil {
		return nil
	}
	return nil
}
