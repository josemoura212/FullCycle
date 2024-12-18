package events

import "time"

type EventInterface interface {
	GetName() string
	GetDateTime() time.Time
	GetPayload() interface{}
}

type EventHandlerInterface interface {
	Handle(event EventInterface)
}

type EventDispatcherInterface interface {
	Register(eventName string,handle EventHandlerInterface)
	Dispatch(event EventInterface)
	Remove(eventName string, handle EventHandlerInterface)
	Has(eventName string, handle EventHandlerInterface) bool
	Clear()
}