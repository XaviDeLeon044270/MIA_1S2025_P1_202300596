package utils

import (
	"errors"
	"fmt"
	"os"
)

// ConvertToBytes convierte un tamaño y una unidad a bytes
func ConvertToBytes(size int, unit string) (int, error) {
	switch unit {
	case "K":
		return size * 1024, nil // Convierte kilobytes a bytes
	case "M":
		return size * 1024 * 1024, nil // Convierte megabytes a bytes
	default:
		return 0, errors.New("invalid unit") // Devuelve un error si la unidad es inválida
	}
}

// Lista con todo el abecedario
var alphabet = []string{
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
}

// Mapa para almacenar la asignación de letras a los diferentes paths
var pathToLetter = make(map[string]string)

// Índice para la siguiente letra disponible en el abecedario
var nextLetterIndex = 0

// GetLetter obtiene la letra asignada a un path
func GetLetter(path string) (string, error) {
	// Asignar una letra al path si no tiene una asignada
	if _, exists := pathToLetter[path]; !exists {
		if nextLetterIndex < len(alphabet) {
			pathToLetter[path] = alphabet[nextLetterIndex]
			nextLetterIndex++
		} else {
			fmt.Println("Error: no hay más letras disponibles para asignar")
			return "", errors.New("no hay más letras disponibles para asignar")
		}
	}

	return pathToLetter[path], nil
}

// GetPath obtiene el path asignado a una letra
func GetPath(letter string) (string, error) {
	// Buscar el path asociado a la letra
	for path, assignedLetter := range pathToLetter {
		if assignedLetter == letter {
			return path, nil
		}
	}

	fmt.Println("Error: no se encontró el path asociado a la letra")
	return "", errors.New("no se encontró el path asociado a la letra")
}

// FileExists verifica si un archivo existe en la ruta especificada
func FileExists(path string) bool {
	// Intenta abrir el archivo en la ruta especificada
	_, err := os.Open(path)
	if err != nil {
		// Si ocurre un error, verifica si es porque el archivo no existe
		if os.IsNotExist(err) {
			return false // El archivo no existe
		}
		return false // Ocurrió otro error al intentar abrir el archivo
	}
	return true // El archivo existe
}
