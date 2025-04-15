package main

import "fmt"

func main() {
	evento := []string{"test", "test2", "test3", "test4"}
	// evento = evento[:2]

	evento = append(evento[:0],evento[1:]... )
	fmt.Println(evento)
}