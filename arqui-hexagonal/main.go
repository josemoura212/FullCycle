package main

import (
	"database/sql"

	db2 "github.com/josemoura212/FullCycle/arqui-hexagonal/adapters/db"
	app "github.com/josemoura212/FullCycle/arqui-hexagonal/application"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, _ := sql.Open("sqlite3", "sqlite.db")
	productDbAdapter := db2.NewProductDb(db)
	produectService := app.NewProductService(productDbAdapter)
	product, _ := produectService.Create("Product Example", 30)

	produectService.Enable(product)
}