
//====================================================
// File: i18n.js
// data: 2015/12/06
// Ctor: Zipher
// Note: Localization for html
//====================================================

//----------------------------------------------------------
/*
##Step 1: Add localiztion files
Path is i18n/lang/{lang}.js .
File name is {lang}.js. Ex: zh-TW.js for traditional Chinese
Context: 
var langObj = {
		//"stringId": "stringContext",
		"delete": "刪除", 
		"add": "新增"
	};

##Step 2: Load script in html
<script language="javascript" type="text/javascript" src="i18n/i18n.js"></script>
	
##Step 3: Lookup "stringContext" by "stringId" in html
<div>delete</div>
sould be changed to
<div class="i18ntext" data-text-id="delete"></div>
*/

$(function(){
	//load language file
	var userLang = (navigator.language || navigator.userLanguage).toLowerCase(); 
 	// alert ("The language is: " + userLang);

 	if( userLang=="zh-tw" ){
 		loadScript("i18n/lang/zh-tw.js", onLangLoaded);
 	} 
	else if( userLang=="en-us" ){
		loadScript("i18n/lang/en-us.js", onLangLoaded);
 	}
	else {
		//default to en-us
		loadScript("i18n/lang/en-us.js", onLangLoaded);
	}

});

function loadScript(src, callback){
	var my_awesome_script = document.createElement('script');
	my_awesome_script.setAttribute('src',src);
	if(callback){
		my_awesome_script.onload = callback;
	}
	document.head.appendChild(my_awesome_script);
}

function onLangLoaded(){
	$(".i18ntext").each( function(){
		$(this).text( langObj[$(this).attr("data-text-id")] );
	});
}