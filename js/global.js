
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.htmlencode = function() {
  var el = document.createElement("div");
  el.innerText = el.textContent = this.toString();
  return el.innerHTML;
}

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}

function GetStyleCodeFor3Digits(digits, opacity) {
	//if(digits.length > 3) digits = digits.substring(0, 3)
	//if(digits.length < 3) digits = pad(3, digits, "0");

	var setOpacityTo = (opacity == undefined) ? "1" : opacity;
	var colorObject = GetColorCodeFor3Digits(digits);
	var textContrast = GetColorContrastForRBG(colorObject.first, colorObject.second, colorObject.third);
	return "color: " + textContrast + "; background: rgba(" + colorObject.first + "," + colorObject.second + "," + colorObject.third + ", " + setOpacityTo + ") !important; /* W3C */"
}

function FormatTextAsHTML(textToFormat) {
	var reNewLines=/[\n\r]/g;
	textToFormat=textToFormat.replace(reNewLines, "<br />");
	var reTabs=/[\t]/g;
	textToFormat=textToFormat.replace(reTabs, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

	return textToFormat.toString();
}


function GetStyleCodeFor3DigitsHalfShaded(digits) {
	//if(digits.length > 3) digits = digits.substring(0, 3)
	//if(digits.length < 3) digits = pad(3, digits, "0");

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

// Great func for random color generation (in hex.) from string 
// https://github.com/brandoncorbin/string_to_color
function string_to_color(str, prc) {
    'use strict';

    // Check for optional lightness/darkness
    var prc = typeof prc === 'number' ? prc : -10;

    // Generate a Hash for the String
    var hash = function(word) {
        var h = 0;
        for (var i = 0; i < word.length; i++) {
            h = word.charCodeAt(i) + ((h << 5) - h);
        }
        return h;
    };

    // Change the darkness or lightness
    var shade = function(color, prc) {
        var num = parseInt(color, 16),
            amt = Math.round(2.55 * prc),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16)
            .slice(1);
    };

    // Convert init to an RGBA
    var int_to_rgba = function(i) {
        var color = ((i >> 24) & 0xFF).toString(16) +
            ((i >> 16) & 0xFF).toString(16) +
            ((i >> 8) & 0xFF).toString(16) +
            (i & 0xFF).toString(16);
        return color;
    };

    return shade(int_to_rgba(hash(str)), prc);

}

// From color Hex to RGB
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function GetColorCodeFor3Digits(digits) {

	// First try: Not work as expected... :(
	//var first =  (Math.round( (( digits.charCodeAt(0) * 11 / 100) * 256) % 255) );
	//var second = (Math.round( (( digits.charCodeAt(1) * 11 / 100) * 256) % 255) );
	//var third =  (Math.round( (( digits.charCodeAt(2) * 11 / 100) * 256) % 255) );

	var colorFromName = hexToRgb(string_to_color(digits));

	var first = colorFromName.r;
	var second = colorFromName.g;
	var third = colorFromName.b;
/*
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
*/
	/*var percentage = 0;

	if(first != 0 && first != 255) {
	 	first = (Math.round(((first - 96) / 26) * 255) % 225);
	}
	if(second != 0 && second != 255) {
	 	second = (Math.round(((second - 96) / 26) * 255) % 225);
	}
	if(third != 0 && third != 255) {
	 	third = (Math.round(((third - 96) / 26) * 255) % 225);
	}*/

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
