package server

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/josemoura212/FullCycle/arqui-hexagonal/adapters/web/handler"
	"github.com/josemoura212/FullCycle/arqui-hexagonal/application"
)

type Webserver struct {
	Service application.ProductServiceInterface
}

func MakeNewWebserver() *Webserver{
	return &Webserver{}
}

func (w Webserver) Server() {

	r := mux.NewRouter()
	n := negroni.New(
		negroni.NewLogger(),
	)

	handler.MakeProductHandler(r, n, w.Service)
	http.Handle("/",r)
	server := &http.Server{
		ReadHeaderTimeout: 10 *time.Second,
		WriteTimeout: 10 *time.Second,
		Addr: ":8910",
		Handler: http.DefaultServeMux,
		ErrorLog: log.New(os.Stderr, "log: ", log.Lshortfile),
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}