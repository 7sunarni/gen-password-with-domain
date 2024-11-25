package main

import (
	"net/http"
	"os"
	"path/filepath"
)

var workDir string

func main() {
	workDir = filepath.Dir(os.Args[0])
	port := os.Getenv("HTTP_PORT")
	if port == "" {
		port = "80"
	}

	key := os.Getenv("TLS_CERT")
	cert := os.Getenv("TLS_KEY")
	_, err := os.Stat(key)
	if err != nil {
		http.ListenAndServe("0.0.0.0:"+port, NewMixedHandler())
	} else {
		http.ListenAndServeTLS("0.0.0.0:443", key, cert, NewMixedHandler())
	}
}
