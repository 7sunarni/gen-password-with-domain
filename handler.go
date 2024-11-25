package main

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

type MixedHandler struct {
	mux              *http.ServeMux
	storage          Storage
	copyPasteContent string
}

func (m *MixedHandler) host(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		q := r.URL.Query().Get("alias")
		name, err := m.storage.GetHostByAlias(q)
		if err != nil {
			w.Write([]byte(""))
			return
		}
		w.Write([]byte(name))
		return
	}
	if r.Method == http.MethodPost {
		d := new(Payload)
		if err := json.NewDecoder(r.Body).Decode(d); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		if d.Host == "" || d.Date == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing parameter"))
			return
		}
		if err := m.storage.SetHostAlias(d.Host, d.Alias, d.Date); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		return
	}
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Write([]byte(fmt.Sprintf("%s method not allowed", r.RequestURI)))
}

func (m *MixedHandler) date(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		q := r.URL.Query().Get("alias")
		date, err := m.storage.GetUpdateTime(q)
		if err != nil {
			w.Write([]byte(""))
			return
		}
		w.Write([]byte(date))
		return
	}
	if r.Method == http.MethodPost {
		d := new(Payload)
		if err := json.NewDecoder(r.Body).Decode(d); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		if d.Host == "" || d.Date == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing parameter"))
			return
		}
		if err := m.storage.SetUpdateTime(d.Host, d.Alias, d.Date); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		return
	}
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Write([]byte(fmt.Sprintf("%s method not allowed", r.RequestURI)))
}

// TODO: clear file
func (m *MixedHandler) upload(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	if strings.Contains(header.Filename, "/") {
		w.WriteHeader(http.StatusOK)
		return
	}
	fileName := "temp-" + header.Filename
	if err := ioutil.WriteFile(path.Join(workDir, fileName), data, os.ModePerm); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fileName))
}

func NewMixedHandler() http.Handler {
	mux := http.DefaultServeMux
	s, err := NewCSV("csv.db")
	if err != nil {
		log.Fatal(err)
	}
	handler := &MixedHandler{
		mux:              mux,
		storage:          s,
		copyPasteContent: "",
	}
	mux.HandleFunc("/api/host", handler.host)
	mux.HandleFunc("/api/date", handler.date)
	mux.HandleFunc("/api/upload", handler.upload)
	mux.HandleFunc("/api/cp", handler.cp)
	handler.mux = mux
	return handler
}

func (m *MixedHandler) tryServeStatic(w http.ResponseWriter, r *http.Request) (found bool) {
	u := r.RequestURI
	u = strings.ReplaceAll(u, "/", "")
	// 防止路径穿越
	u = strings.TrimLeft(u, ".")
	if u == "" {
		u = "index.html"
	}
	found = false
	filepath.WalkDir(workDir, func(path string, info fs.DirEntry, err error) error {
		if info.IsDir() {
			return nil
		}
		if info.Name() == u {
			found = true
			return nil
		}
		return nil
	})

	if !found {
		return
	}
	fullPath := path.Join(workDir, u)
	data, err := ioutil.ReadFile(fullPath)
	if err != nil {
		w.Write([]byte(fmt.Sprintf("read file %s failed: %s", fullPath, err.Error())))
		return
	}
	w.Write(data)
	return
}

func (m *MixedHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if m.tryServeStatic(w, r) {
		return
	}
	m.mux.ServeHTTP(w, r)
}

func (m *MixedHandler) cp(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(m.copyPasteContent))
		return
	}
	if r.Method == http.MethodPost {
		data := make(map[string]string)
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		content := data["content"]
		m.copyPasteContent = content
		w.WriteHeader(http.StatusOK)
		return
	}
}
