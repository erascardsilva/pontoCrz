// PontoCrz — Bridge Wails (PickFile, ProcessImage, SaveImage)
// Autor: Erasmo Cardoso - Software Engineer | Electronics Specialist
package main

import (
	"context"
	"pontoCrz/backend"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// PickFile opens a file dialog to select an image
func (a *App) PickFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Selecione uma imagem",
		Filters: []runtime.FileFilter{
			{DisplayName: "Imagens (*.png;*.jpg;*.jpeg)", Pattern: "*.png;*.jpg;*.jpeg"},
		},
	})
}

// ProcessImage converts the image to cross stitch
func (a *App) ProcessImage(filePath string, width int, colorLimit int) (*backend.ProcessedImage, error) {
	return backend.ProcessImage(filePath, width, colorLimit)
}

func (a *App) SaveImage(filePath string, width int, colorLimit int, pointSize int) error {
	savePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Salvar Gráfico de Ponto Cruz",
		DefaultFilename: "ponto_cruz.jpg",
		Filters: []runtime.FileFilter{
			{DisplayName: "Imagens JPG", Pattern: "*.jpg"},
		},
	})
	if err != nil || savePath == "" {
		return err
	}

	res, err := backend.ProcessImage(filePath, width, colorLimit)
	if err != nil {
		return err
	}

	if pointSize < 5 {
		pointSize = 20
	}

	return backend.SaveToJPG(savePath, res, pointSize)
}
