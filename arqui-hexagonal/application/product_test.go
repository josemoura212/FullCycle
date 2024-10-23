package application_test

import (
	"testing"

	"github.com/josemoura212/FullCycle/application"
	uuid "github.com/satori/go.uuid"
	"github.com/stretchr/testify/require"
)

func TestProduct_Enable(t *testing.T) {
	product := application.Product{}

	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 10

	err := product.Enable()

	require.Nil(t, err)

	product.Price = 0
	err = product.Enable()
	require.Equal(t, "the price must be greater than 0 to enable the product", err.Error())
}

func TestProduct_Disable(t *testing.T) {
	product := application.Product{}

	product.Name = "Hello"
	product.Status = application.ENABLED
	product.Price = 0

	err := product.Disable()

	require.Nil(t, err)

	product.Price = 10
	err = product.Disable()
	require.Equal(t, "the price must be zero in order to have the product disabled", err.Error())
}

func TestProduct_IsValid(t *testing.T) {
	product := application.Product{}
	product.ID = uuid.NewV4().String()
	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 10

	_, err := product.IsValid()
	require.Nil(t, err)

	product.Status = "INVALID"
	_, err = product.IsValid()
	require.Equal(t, "the status must be enabled or disabled",err.Error())

	product.Status = application.ENABLED
	_, err = product.IsValid()
	require.Nil(t, err)

	product.Price = -10
	_, err = product.IsValid()
	require.Equal(t, "the price must be greater or equal zero", err.Error())
}

func TestProduct_GetId(t *testing.T) {
	product := application.Product{}
	product.ID = uuid.NewV4().String()

	require.NotEmpty(t, product.GetId())
	require.Equal(t, product.ID, product.GetId())

}


func TestProduct_GetName(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"

	require.NotEmpty(t, product.GetName())
	require.Equal(t, product.Name, product.GetName())
}

func TestProduct_GetStatus(t *testing.T) {
	product := application.Product{}
	product.Status = application.DISABLED

	require.NotEmpty(t, product.GetStatus())
	require.Equal(t, product.Status, product.GetStatus())
}

func TestProduct_GetPrice(t *testing.T) {
	product := application.Product{}
	product.Price = 10

	require.NotEmpty(t, product.GetPrice())
	require.Equal(t, product.Price, product.GetPrice())
}