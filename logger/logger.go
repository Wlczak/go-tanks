package logger

import "go.uber.org/zap"

func GetLogger() zap.Logger {
	cfg := zap.Config{
		Encoding:         "json",
		Level:            zap.NewAtomicLevelAt(zap.InfoLevel),
		OutputPaths:      []string{"stdout", "logger/logs/app.log"},
		ErrorOutputPaths: []string{"stderr"},
		EncoderConfig:    zap.NewProductionEncoderConfig(),
		InitialFields:    map[string]interface{}{},
	}

	logger, err := cfg.Build()

	if err != nil {
		panic(err)
	}
	return *logger
}
