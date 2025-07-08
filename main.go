package main

import (
	"os"

	"github.com/Wlczak/tanks/logger"
	"github.com/Wlczak/tanks/routes"
	"github.com/Wlczak/tanks/server"
	"github.com/joho/godotenv"
)

func setupEnv() error {
	_, err := os.Stat(".env")
	if os.IsNotExist(err) {
		f, err := os.Create(".env")
		if err != nil {
			return err
		}
		defer func() {
			if err := f.Close(); err != nil {
				zap := logger.GetLogger()
				zap.Error(err.Error())
			}
		}()
	}
	err = godotenv.Load()

	return err
}

func main() {
	zap := logger.GetLogger()
	zap.Info("Starting server")

	err := setupEnv()

	if err != nil {
		zap.Fatal(err.Error())
	}

	server := server.NewServer()

	r := routes.SetupRouter(server)

	// Listen and Server in 0.0.0.0:8080
	err = r.Run(":8080")

	if err != nil {
		zap.Fatal(err.Error())
	}
}
