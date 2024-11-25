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
		port = "38080"
	}

	if err := http.ListenAndServeTLS("0.0.0.0:443", "/etc/letsencrypt/live/7sunarni.reborn.tk/fullchain.pem", "/etc/letsencrypt/live/7sunarni.reborn.tk/privkey.pem", NewMixedHandler()); err != nil {
		http.ListenAndServe("0.0.0.0:"+port, NewMixedHandler())

	}
}
