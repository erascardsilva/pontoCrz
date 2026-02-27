package backend

import (
	"math"
)

type DMCColor struct {
	ID    string
	Name  string
	Hex   string
	R, G, B uint8
}

var DMCPalette = []DMCColor{
	{"BLANC", "White", "#ffffff", 255, 255, 255},
	{"ECRU", "Ecru", "#f0ead6", 240, 234, 214},
	{"310", "Black", "#000000", 0, 0, 0},
	{"666", "Christmas Red - BRT", "#e31d23", 227, 29, 35},
	{"321", "Christmas Red", "#c8102e", 200, 16, 46},
	{"816", "Royal Red", "#9b1b30", 155, 27, 48},
	{"814", "Deep Wine", "#7a1727", 122, 23, 39},
	{"606", "Bright Orange-Red", "#ff3300", 255, 51, 0},
	{"900", "Dark Orange Spice", "#cd4a0c", 205, 74, 12},
	{"947", "Burnt Orange", "#eb6d2d", 235, 109, 45},
	{"741", "Medium Tangerine", "#ff9a00", 255, 154, 0},
	{"740", "Tangerine", "#ff8200", 255, 130, 0},
	{"970", "Light Pumpkin", "#f2920c", 242, 146, 12},
	{"444", "Dark Lemon", "#ffd300", 255, 211, 0},
	{"307", "Lemon", "#f4d03f", 244, 208, 63},
	{"703", "Bright Christmas Green", "#3ba439", 59, 164, 57},
	{"701", "Light Christmas Green", "#008a3d", 0, 138, 61},
	{"699", "Christmas Green", "#006400", 0, 100, 0},
	{"890", "Ultra Dark Pistachio Green", "#003200", 0, 50, 0},
	{"796", "Dark Royal Blue", "#003da5", 0, 61, 165},
	{"791", "Very Dark Cornflower Blue", "#202e54", 32, 46, 84},
	{"820", "Very Dark Royal Blue", "#00205b", 0, 32, 91},
	{"334", "Medium Baby Blue", "#7096c4", 112, 150, 196},
	{"827", "Very Light Blue", "#bdd6e6", 189, 214, 230},
	{"550", "Very Dark Violet", "#5a2d81", 90, 45, 129},
	{"208", "Very Dark Lavender", "#833177", 131, 49, 119},
	{"210", "Medium Lavender", "#b996c1", 185, 150, 193},
	{"602", "Medium Cranberry", "#da2a7d", 218, 42, 125},
	{"605", "Very Light Cranberry", "#f4b9d3", 244, 185, 211},
	{"433", "Medium Brown", "#784b3d", 120, 75, 61},
	{"434", "Light Brown", "#9c6b4e", 156, 107, 78},
	{"435", "Very Light Brown", "#ba8b61", 186, 139, 97},
	{"436", "Tan", "#cc9c71", 204, 156, 113},
	{"437", "Light Tan", "#e0bd9c", 224, 189, 156},
	{"938", "Ultra Dark Coffee Brown", "#362419", 54, 36, 25},
	{"801", "Dark Coffee Brown", "#523624", 82, 54, 36},
	{"762", "Very Light Pearl Gray", "#e4e4e4", 228, 228, 228},
	{"415", "Pearl Gray", "#d4d4d4", 212, 212, 212},
	{"414", "Dark Steel Gray", "#8c8c8c", 140, 140, 140},
	{"413", "Dark Anthracite Gray", "#545454", 84, 84, 84},
}

func FindNearestDMC(r, g, b uint8) DMCColor {
	var nearest DMCColor
	minDist := math.MaxFloat64

	for _, dmc := range DMCPalette {
		dist := colorDistance(r, g, b, dmc.R, dmc.G, dmc.B)
		if dist < minDist {
			minDist = dist
			nearest = dmc
		}
	}
	return nearest
}

func colorDistance(r1, g1, b1, r2, g2, b2 uint8) float64 {
	dr := float64(r1) - float64(r2)
	dg := float64(g1) - float64(g2)
	db := float64(b1) - float64(b2)
	return math.Sqrt(dr*dr + dg*dg + db*db)
}
