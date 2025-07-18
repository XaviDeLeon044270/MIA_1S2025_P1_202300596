package analyzer

import (
	commands "backend/commands"
	"errors"  // Importa el paquete "errors" para manejar errores
	"fmt"     // Importa el paquete "fmt" para formatear e imprimir texto
	"strings" // Importa el paquete "strings" para manipulación de cadenas
)

// Analyzer analiza el comando de entrada y ejecuta la acción correspondiente
func Analyzer(input string) (interface{}, error) {
	// Divide la entrada en tokens usando espacios en blanco como delimitadores
	tokens := strings.Fields(input)

	// Si no se proporcionó ningún comando, devuelve un error
	if len(tokens) == 0 {
		return nil, errors.New("no se proporcionó ningún comando")
	}

	// Switch para manejar diferentes comandos
	switch tokens[0] {
	case "mkdisk":
		// Llama a la función ParseMkdisk del paquete commands con los argumentos restantes
		return commands.ParseMkdisk(tokens[1:])

	case "rmdisk":
		// Llama a la función ParseRmdisk del paquete commands con los argumentos restantes
		return commands.ParseRmdisk(tokens[1:])

	case "fdisk":
		// Llama a la función ParseFdisk del paquete commands con los argumentos restantes
		return commands.ParseFdisk(tokens[1:])
		
	case "mount":
		// Llama a la función ParseMount del paquete commands con los argumentos restantes
		return commands.ParseMount(tokens[1:])
		
	default:
		// Si el comando no es reconocido, devuelve un error
		return nil, fmt.Errorf("comando desconocido: %s", tokens[0])
	}
}