
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.htmlencode = function() {
  var el = document.createElement("div");
  el.innerText = el.textContent = this.toString();
  return el.innerHTML;
}

function GetStyleCodeFor3Digits(digits, opacity) {
	var setOpacityTo = (opacity == undefined) ? "1" : opacity;
	var colorObject = GetColorCodeFor3Digits(digits);
	var textContrast = GetColorContrastForRBG(colorObject.first, colorObject.second, colorObject.third);
	return "color: " + textContrast + "; background: rgba(" + colorObject.first + "," + colorObject.second + "," + colorObject.third + ", " + setOpacityTo + ") !important; /* W3C */"
}


function GetStyleCodeFor3DigitsHalfShaded(digits) {
	var colorObject = GetColorCodeFor3Digits(digits);
	var textContrast = GetColorContrastForRBG(colorObject.first, colorObject.second, colorObject.third);
	return "color: " + textContrast + "; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,rgba(" + colorObject.first + "," + colorObject.second + "," + colorObject.third + ",1) 51%,rgba(" + colorObject.first + "," + colorObject.second + "," + colorObject.third + ",1) 100%) !important; /* W3C */"
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function GetColorContrastForRBG(r, g, b) {
	var hexValue = rgbToHex(r, g, b);
	return getContrastYIQ(hexValue);
}

function getContrastYIQ(hexcolor){
	if(hexcolor.indexOf("#") > 0) hexcolor = hexcolor.replace("#", '');
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? '#343434' : 'white';
}

function GetColorCodeFor3Digits(digits) {
	var first = Math.round(digits.charCodeAt(0) * 1.5);
	var second = Math.round(digits.charCodeAt(1) * 1.5);
	var third = Math.round(digits.charCodeAt(2) * 1.5);

	if(first < second && first < third) {
		first = 25;
	} else if(second < first && second < third) {
		second = 25;
	} else {
		third = 25;
	}

	if(first > second && first > third) {
		first = 225;
	} else if (second > first && second > third) {
		second = 225;
	} else {
		third = 225;
	}

	var percentage = 0;

	// if(first != 0 && first != 255) {
	// 	first = Math.round(((first - 96) / 26) * 255);
	// }
	// if(second != 0 && second != 255) {
	// 	second = Math.round(((second - 96) / 26) * 255);
	// }
	// if(third != 0 && third != 255) {
	// 	third = Math.round(((third - 96) / 26) * 255);
	// }

	//97 - 122
	


	return {"first":first, "second":second, "third":third};
}

var colorCodes = {
	"A" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#bf0000 51%,#bf0000 100%) !important; /* W3C */",
		"background" : "#bf0000",
		"foreground" : "#FFFFFF"
	},
	"B" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#bf0000 51%,#bf0000 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"C" : {
		"style" : "color: #444444; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#7acf00 51%,#7acf00 100%) !important; /* W3C */",
		"background" : "#7acf00",
		"foreground" : "#444444"
	},
	"D" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"E" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"F" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"G" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"H" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"I" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"J" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"K" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#6a00d7",
		"foreground" : "#FFFFFF"
	},
	"L" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"M" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"N" : {
		"style" : "color: #444444; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff9200 51%,#ff9200 100%) !important; /* W3C */",
		"background" : "#ff9200",
		"foreground" : "#444444"
	},
	"O" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"P" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"Q" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"R" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"S" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"T" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"U" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"V" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"W" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"X" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"Y" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#ff00ce 51%,#ff00ce 100%) !important; /* W3C */",
		"background" : "#ff00ce",
		"foreground" : "#FFFFFF"
	},
	"Z" : {
		"style" : "color: #FFFFFF; background: linear-gradient(135deg, rgba(255,255,255,0) 0%,rgba(41,137,216,0) 50%,#000000 51%,#000000 100%) !important; /* W3C */",
		"background" : "#000000",
		"foreground" : "#FFFFFF"
	}
}