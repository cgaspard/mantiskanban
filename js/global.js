
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.htmlencode = function() {
  var el = document.createElement("div");
  el.innerText = el.textContent = this.toString();
  return el.innerHTML;
}

var colorCodes = {
	"A" : {
		"background" : "#bf0000",
		"foreground" : "#FFFFFF"
	},
	"B" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"C" : {
		"background" : "#7acf00",
		"foreground" : "#444444"
	},
	"D" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"E" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"F" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"G" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"H" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"I" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"J" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"K" : {
		"background" : "#6a00d7",
		"foreground" : "#FFFFFF"
	},
	"L" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"M" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"N" : {
		"background" : "#ff9200",
		"foreground" : "#444444"
	},
	"O" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"P" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"Q" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"R" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"S" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"T" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"U" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"V" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"W" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"X" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"Y" : {
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"Z" : {
		"background" : "#000000",
		"foreground" : "#FFFFFF"
	}
}