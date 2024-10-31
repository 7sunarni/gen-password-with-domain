package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"path"
	"strings"
	"sync"
)

type Storage interface {
	SetHostAlias(host string, alias string, date string) error
	GetHostByAlias(alias string) (string, error)
	SetUpdateTime(host string, alias string, date string) error
	GetUpdateTime(alias string) (string, error)
}

type Payload struct {
	Host  string `json:"host"`
	Alias string `json:"alias"`
	Date  string `json:"date"`
}

type CSV struct {
	items     [][]string
	fileName  string
	itemLock  *sync.Mutex
	writeLock *sync.Mutex
}

func NewCSV(fileName string) (Storage, error) {
	c := &CSV{
		fileName:  fileName,
		itemLock:  &sync.Mutex{},
		writeLock: &sync.Mutex{},
	}
	if err := c.load(); err != nil {
		return nil, err
	}
	return c, nil
}

func (c *CSV) save() error {
	c.writeLock.Lock()
	defer c.writeLock.Unlock()

	// FIXME:
	f, err := os.OpenFile(path.Join(workDir, c.fileName), os.O_RDWR|os.O_CREATE, os.ModePerm)
	if err != nil {
		return err
	}
	defer f.Close()

	if err != nil {
		return err
	}

	w := csv.NewWriter(f)
	defer w.Flush()

	for _, record := range c.items {
		if len(record) < 2 {
			continue
		}
		if err := w.Write(record); err != nil {
			return err
		}
	}
	return nil
}

func (c *CSV) load() error {
	c.writeLock.Lock()
	defer c.writeLock.Unlock()
	f, err := os.OpenFile(workDir+c.fileName, os.O_RDWR|os.O_CREATE, os.ModePerm)
	if err != nil {
		return err
	}
	r := csv.NewReader(f)
	items := make([][]string, 0)
	for {
		records, err := r.Read()
		if err != nil {
			break
		}

		if len(records) < 2 {
			continue
		}
		items = append(items, records)
	}
	c.items = items
	return nil
}

func (c *CSV) getIndex(alias string) int {
	c.itemLock.Lock()
	defer c.itemLock.Unlock()

	for index, item := range c.items {
		for _, record := range item {
			if record == alias {
				return index
			}
		}
	}
	return -1
}

func (c *CSV) SetHostAlias(name string, alias string, date string) error {
	i := c.getIndex(alias)
	if i != -1 {
		return fmt.Errorf("%s exist %s", alias, c.items[i][0])
	}
	nameIndex := c.getIndex(name)

	c.itemLock.Lock()
	defer c.itemLock.Unlock()
	if nameIndex == -1 {
		c.items = append(c.items, []string{name, date, alias})
	} else {
		added := c.items[nameIndex]
		added = append(added, alias)
		c.items[nameIndex] = added
	}
	return c.save()
}

func (c *CSV) GetHostByAlias(alias string) (string, error) {
	alias = strings.ToLower(alias)
	index := c.getIndex(alias)
	if index == -1 {
		return "", fmt.Errorf("%s not found", alias)
	}
	return c.items[index][0], nil
}

func (c *CSV) SetUpdateTime(host string, alias string, date string) error {
	i := c.getIndex(host)
	c.itemLock.Lock()
	defer c.itemLock.Unlock()
	if i == -1 {
		item := []string{host, date}
		if alias != "" {
			item = append(item, alias)
		}
		c.items = append(c.items, item)
	} else {
		current := c.items[i]
		current[1] = date
		c.items[i] = current
	}
	return c.save()
}

func (c *CSV) GetUpdateTime(alias string) (string, error) {
	alias = strings.ToLower(alias)
	index := c.getIndex(alias)
	if index == -1 {
		return "", fmt.Errorf("%s not found", alias)
	}
	return c.items[index][1], nil
}

type Bolt struct {
}
