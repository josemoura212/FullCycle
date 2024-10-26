package handler

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestHandler_JsonError(t *testing.T) {
	msg := "Hello Json"
	result := JsonError(msg)

	require.Equal(t, []byte(`{"message":"Hello Json"}`), result)

}