package main

import (
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
	deliveryChan := make(chan kafka.Event)
	producer := NewKafkaProducer()
	Publish("Transferiu", "teste", producer, []byte("Transferencia2"), deliveryChan)
	go DeliveryRerport(deliveryChan)
	producer.Flush(5000)

}

func NewKafkaProducer() *kafka.Producer {
	p, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers":  "gokafka-kafka-1:9092",
		"acks":               "all",
		"enable.idempotence": "true",
	})
	if err != nil {
		log.Println(err.Error())
	}
	return p

}

func Publish(msg string, topic string, producer *kafka.Producer, key []byte, deliveryChan chan kafka.Event) error {
	message := &kafka.Message{
		Value:          []byte(msg),
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Key:            key,
	}

	err := producer.Produce(message, deliveryChan)
	if err != nil {
		return err
	}

	return nil

}

func DeliveryRerport(deliveryChan chan kafka.Event) {
	for e := range deliveryChan {
		switch ev := e.(type) {
		case *kafka.Message:
			if ev.TopicPartition.Error != nil {
				log.Println("Erro ao enviar mensagem: ", ev.TopicPartition.Error)
			} else {
				log.Printf("Mensagem enviada para o tópico %s na partição %d\n", *ev.TopicPartition.Topic, ev.TopicPartition.Partition)
			}
		default:
			// log.Printf("Evento desconhecido: %v\n", ev)s
		}
	}
}
