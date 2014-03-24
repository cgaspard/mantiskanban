var LoadingIssuesList = new Array();
var DebugOn = false;
var $ = jQuery;

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
// added this logging function from paul irish to debug if needed.
window.log = function(){
	if(DebugOn == 1){
		log.history = log.history || [];   // store logs to an array for reference
  		log.history.push(arguments);
  		if(this.console){
    		console.log( Array.prototype.slice.call(arguments) );
    		console.log(Mantis.CurrentProjectID);
  		}
	}
	else{

	}
};

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

window.addEventListener("load", window_load);


function window_load() {

	document.getElementById('newAttachmentFile').addEventListener('change', HandleFileSelect, false);

	var preConfiguredMantisURL = DefaultSettings.connectURL;

	LoadSettingsFromLocalStorage();

	if(DefaultSettings.connectURL != undefined && DefaultSettings.connectURL != "") {
		document.getElementById("mantisURL").value = DefaultSettings.connectURL;
	} else if (preConfiguredMantisURL != undefined && preConfiguredMantisURL != "") {
		document.getElementById("mantisURL").value = preConfiguredMantisURL;
	}

	//make sure that the username and password form doesnt actually submit. 
	//need this here as a fail safe because jQuery is included.
	$('#userLoginForm').submit(function() {
  		Login();
  		return false;
	});

	$("#project-selector").hide();

	document.getElementById("username").focus();

    jQuery(document).ready(function ($) {
        $('#tabs').tab();
    });
    
	AutoLogin();


/*	$(document).bind('keyup', 'shift+ctrl+g', function() {
		document.getElementById("searchfield").focus();
	});*/

}

  function HandleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var newAttachmentDiv = document.createElement('div');
          newAttachmentDiv.setAttribute("class", "newfileattach");
          var data = e.target.result.substring(e.target.result.indexOf(",") + 1);
          newAttachmentDiv.setAttribute("filedata", data);
          //newAttachmentDiv.setAttribute("filedataulr",e.target.result);
          newAttachmentDiv.setAttribute("filename", theFile.name);
          var mimeType = "";
          if(theFile.type == undefined || theFile.type == "") {
          	mimeType = "application/octet-stream";	
          } else {
          	mimeType = theFile.type;
          	
          }
          newAttachmentDiv.setAttribute("filetype", mimeType);	
          newAttachmentDiv.innerHTML = theFile.name + " (" + mimeType + ") " + Math.round(data.length / 1024, 2) + "Kb";
          document.getElementById('newAttachmentList').appendChild(newAttachmentDiv);
          document.getElementById('newAttachmentFile').value = "";
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

function ShallowCopy(o) {
  var copy = Object.create(o);
  for (prop in o) {
    if (o.hasOwnProperty(prop)) {
      copy[prop] = o[prop];
    }
  }
  return copy;
}

function get_gravatar(email, size) {
 
    // MD5 (Message-Digest Algorithm) by WebToolkit
    // 
 
    var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
 
    var size = size || 80;
 
    return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
}

 
function Login() {
	log("Login() called.");
	
	document.getElementById("username").focus();
	Mantis.ConnectURL = document.getElementById("mantisURL").value;
	
	try {
		var retObj = Mantis.Login(document.getElementById("username").value, document.getElementById("password").value);
		Kanban.CurrentUser = new KanbanUser(retObj.account_data);
		Kanban.CurrentUser.Password = document.getElementById("password").value;
	} catch (e) {
		var form = document.getElementById("loginButton");
		$(form).before('<center><div class="alert alert-danger text-center" style="width:320px !important"><b>Error:</b> ' + e.message + '<button type="button" class="close" data-dismiss="alert">&times;</button></div><center>');
		return;
	}

	DefaultSettings.connectURL = Mantis.ConnectURL;
	saveSettingsToStorageMechanism();

	StartLoading();
	
	//put the user-entered data into the DefaultSettings array.
	DefaultSettings.username = document.getElementById("username").value;
	DefaultSettings.stayLoggedIn = 1;
	DefaultSettings.lastAccessTime = Math.round(new Date().getTime() / 1000);

	LoadSettingsFromLocalStorage();
	if(DefaultSettings.kanbanListWidth == undefined) {
		DefaultSettings.kanbanListWidth = getStyleRule(".kanbanlist", "width");
	}

	Kanban.ApplySettingsAtLogin();

	if(urlParams.project) {
		document.getElementById("seletedproject").value = urlParams.project;
	}


	LoadKanbanProjects();
	BuildProjectsGUI();

	HideLoginArea();
	ShowProjectArea();

	if(urlParams.issue) {
		document.getElementById("searchfield").value = urlParams.issue;
		SearchForStory();
		return;
	}

	SelectProject();

	Mantis.Preload();

	StopLoading();

}

function DeleteIssue(kanbanIssue) {
	try {
		if(confirm("Are you sure you want to delete this issues?")) {
			StartLoading();
			var storyID = $("#edit-story-id").val();
			var kanbanStory = Kanban.GetStoryByFieldValue("ID", storyID);

			Mantis.IssueDelete(kanbanStory.ID, function() {
				try {
					StopLoading();
					kanbanStory.Delete();
				} catch(ex) {
					StopLoading();
				}
			});
		}
	} catch(e) {
		StopLoading()
	}

}


function HideLoginArea() {
	document.getElementById("loginarea").style.display = "none";
}
function ShowLoginArea() {
	document.getElementById("loginarea").style.display = "inline-block";
}

function ShowProjectArea() {
	document.getElementById("projectarea").style.display = "inline-block";
	document.getElementById("contentarea").style.display = "block";
	document.getElementById("priorities-displayer").style.display = "block";
	
}

function HideProjectArea() {
	document.getElementById("projectarea").style.display = "none";
	document.getElementById("contentarea").style.display = "none";
	document.getElementById("priorities-displayer").style.display = "none";
}

function modifyStyleRule(selectorText, style, value) {
	var sheets = document.styleSheets;
	var sheet, rules, rule;
	var i, j, k, l;

	for (i=0, iLen=sheets.length; i<iLen; i++) {
		sheet = sheets[i];

		// W3C model
		if (sheet.cssRules) {
			rules = sheet.cssRules;

			for (j=0, jLen=rules.length; j<jLen; j++) {
				rule = rules[j];

				if (rule.selectorText == selectorText) {
					rule.style[style] = value;
				}
			}
		} else if (sheet.rules) {
			rules = sheet.rules;

			for (k=0, kLen=rules.length; k<kLen; k++) {
				rule = rules[k];

				// An alternative is to just modify rule.style.cssText,
				// but this way keeps it consistent with W3C model
		        if (rule.selectorText == selectorText) {
		        	rule.style[style] = value;

					// Alternative
					// rule.style.cssText = value;
		        }
			}
		}		
	}
}

function getStyleRule(selectorText, style, value) {
	try { 
		var sheets = document.styleSheets;
		var sheet, rules, rule;
		var i, j, k, l;

		for (i=0, iLen=sheets.length; i<iLen; i++) {
			sheet = sheets[i];

			// W3C model
			if (sheet.cssRules) {
				rules = sheet.cssRules;

				for (j=0, jLen=rules.length; j<jLen; j++) {
					rule = rules[j];

					if (rule.selectorText == selectorText) {
						if(rule.style[style] == undefined) return "";
						return rule.style[style];
					}
				}
			} else if (sheet.rules) {
				rules = sheet.rules;

				for (k=0, kLen=rules.length; k<kLen; k++) {
					rule = rules[k];

					// An alternative is to just modify rule.style.cssText,
					// but this way keeps it consistent with W3C model
			        if (rule.selectorText == selectorText) {
			        	if(rule.style[style] == undefined) return "";
			        	return rule.style[style];

						// Alternative
						// rule.style.cssText = value;
			        }
				}
			}		
		}
		/// We didn't find the value so return nothing
		return "";
	} catch (e) {
		return "";
	}
}

/* Remove rule from supplied sheet
*/
function removeRule(sheet, rule) {

  // W3C model
  if (typeof sheet.deleteRule == 'function') {
    sheet.deleteRule(rule);

  // IE model
  } else if (sheet.removeRule) {
    sheet.removeRule(rule);
  }
}

/* Add rule from supplied sheet
** Rule is added as last rule in sheet
*/
function addRule(sheet, selectorText, value) {

  // W3C model
  if (typeof sheet.insertRule == 'function') {
    sheet.insertRule(selectorText + ' {' + value + '}', sheet.cssRules.length);

  // IE model
  } else if (sheet.addRule) {
    sheet.addRule(selectorText, value, sheet.rules.length);
  }
}
function Logout() {
	Kanban.Lists = [];
	Kanban.Stories = [];
	Kanban.Projects = [];
	Kanban.ClearListGUI();

	Mantis.ClearForLogout();
	
	HideProjectArea();
	ShowLoginArea();
}

function SelectProject(openStoryID) {
	console.log("SelectProject() called.");

	CloseEditStory();
	CloseAddStory();

	Mantis.CurrentProjectID = document.getElementById("seletedproject").value;

	//put selected project into localstorage so that next time the user logs in it loads their current project.
	DefaultSettings.currentProject = Mantis.CurrentProjectID;
	saveSettingsToStorageMechanism();

	StartLoading();

	Kanban.Lists = [];
	Kanban.Stories = [];
	Kanban.ClearListGUI();

	Mantis.CurrentProjectID = document.getElementById("seletedproject").value;

	UpdateFilterList();

	BuildKanbanListFromMantisStatuses();
	
	Kanban.BuildListGUI();

	VerifyDefaultFitlers();

	if(Kanban.CurrentProject.ParentProject) {
		document.getElementById("selected-project-name").innerHTML = Kanban.CurrentProject.ParentProject.Name + "&nbsp;&nbsp;/&nbsp;&nbsp;" + Kanban.CurrentProject.Name;	
	} else {
		document.getElementById("selected-project-name").innerHTML = Kanban.CurrentProject.Name;	
	}

	

	if(Mantis.DefaultFilterID !== null && Mantis.DefaultFilterID != 0) {
		window.setTimeout(function(filterID, retObj) {
			LoadFilterAsync(Mantis.DefaultFilterID, 0, 0, function(filterID, retObj) {
				DoneLoadingIssuesCallback(filterID, retObj);
				if(document.getElementById("searchfield").value != "") {
					SearchForStory(false);
				}
			});
		}, 0);
		if(Mantis.ClosedIssuesFilterID !== null) {
			window.setTimeout("LoadFilterAsync(Mantis.ClosedIssuesFilterID, 1, Kanban.NumberOfClosedMessagesToLoad, DoneLoadingIssuesCallback)", 0);
		}
	} else {
		var retObj = Mantis.ProjectGetIssues(Mantis.CurrentProjectID, 0, 0);
		CreateKanbanStoriesFromMantisIssues(retObj);
		$(".tempLoadingDiv").hide();//hide the loading gifs
		if(document.getElementById("searchfield").value != "") {
			SearchForStory(false);
		}

		StopLoading();
	}
}

function VerifyDefaultFitlers() {
	var foundClosedFilter = false;
	var foundFilter = false;
	for(var fcount = 0; fcount < Mantis.ProjectFilterList.length; fcount++) {
		if(Mantis.ProjectFilterList[fcount].id == Mantis.DefaultFilterID) {
			foundFilter = true;
		}
	}
	for(var fcount = 0; fcount < Mantis.ProjectFilterList.length; fcount++) {
		if(Mantis.ProjectFilterList[fcount].id == Mantis.ClosedIssuesFilterID) {
			foundClosedFilter = true;
		}
	}
	if(!foundFilter) Mantis.DefaultFilterID = null;
	if(!foundClosedFilter) Mantis.ClosedIssuesFilterID = null;

}

function UpdateFilter(filterID) {
	Mantis.DefaultFilterID = filterID;
	SelectProject();
}

function UpdateFilterList() {

	log("UpdateFilterList() called.");

	var filterList = document.getElementById("filterlist");
	var filterListArray = Mantis.FilterGet(Mantis.CurrentProjectID)
	Mantis.ProjectFilterList = filterListArray;

	while(filterList.children.length > 0) { 
	 	filterList.removeChild(filterList.children[0]);
	} 

	for(var i = 0; i < filterListArray.length; i++) {
	
		var filter = filterListArray[i];

		var filterItem = document.createElement("li");
		filterItem.setAttribute("filterid", filter.id);

		var filterItemLink = document.createElement("a");
		filterItemLink.setAttribute("href", "#");
		filterItemLink.setAttribute("filterid", filter.id);
		filterItemLink.setAttribute("onclick", "UpdateFilter(" + filter.id + ");");
		filterItemLink.innerHTML = filter.name;
		filterItem.appendChild(filterItemLink);

		filterList.appendChild(filterItem);

	}
}

function LoadFilterAsync(FilterID, Page, Limit, Callback) {
	try {
		var retObj = Mantis.FilterGetIssues(Mantis.CurrentProjectID, FilterID, Page, Limit);
		Callback(FilterID, retObj);
	}catch (e) {
		try {
			var retObj = Mantis.ProjectGetIssues(Mantis.CurrentProjectID, 0, 0);
			CreateKanbanStoriesFromMantisIssues(retObj);
		} catch (e) {
			if(Mantis.DefaultFilterID == FilterID) Mantis.DefaultFilterID = null;
			if(Mantis.ClosedIssuesFilterID == FilterID) Mantis.ClosedIssuesFilterID =  null;
			saveCurrentSettings();
			StopLoading();
			alert("Error Loading Stories For Filter: " + e.message);
		}

	} finally {
		StopLoading();
	}
}

function DoneLoadingIssuesCallback(filterID, retObj) {
		CreateKanbanStoriesFromMantisIssues(retObj);
		LoadingIssuesList.splice(LoadingIssuesList.indexOf(filterID) -1, 1);
		if(LoadingIssuesList.length == 0) {
			console.log("Done Loading " + filterID);
			StopLoading();
		}
		$(".tempLoadingDiv").hide();//hide the loading gifs
}

function StartLoading() {
	document.getElementById("loadedimage").style.display = "none";
	document.getElementById("loadingimage").style.display = "inline";
}

function StopLoading() {
	document.getElementById("loadingimage").style.display = "none";
	document.getElementById("loadedimage").style.display = "inline";
}

function BuildKanbanListFromMantisStatuses() {
	var hasCutomFieldForStatus = false;
	Kanban.UsingCustomField = false;
	if(Mantis.ProjectCustomFields.length > 0) {
		for(var cf = 0; cf < Mantis.ProjectCustomFields.length; cf++) {
			var customfield = Mantis.ProjectCustomFields[cf]
			if(customfield.field.name == Kanban._listIDField) {
				hasCutomFieldForStatus = true;
				Kanban.UsingCustomField = true;
				var possiblevalues = customfield.possible_values.split("|");
				for(var pv = 0; pv < possiblevalues.length; pv++ ) {
					possiblevalue = possiblevalues[pv];
					var newKanbanList = new KanbanList(possiblevalue);
					newKanbanList.UsesCustomField = true;
					Kanban.AddListToArray(newKanbanList);
				}
			}
		}
	}
	if(!Kanban.UsingCustomField) {
		for(var si = 0; si < Mantis.Statuses.length; si++) {
			var status = Mantis.Statuses[si]
			Kanban.AddListToArray(new KanbanList(status));
		}
	}
}

function SwapSelectedProject(newProjectID) {
	var nodeList = document.getElementsByClassName("projectbutton");
	for(var i = 0; i < nodeList.length; i++) {
		if(nodeList[i].id == newProjectID) {
			nodeList[i].setAttribute("selected", "true");
		} else {
			nodeList[i].setAttribute("selected", "false");
		}
	}
}

function LoadKanbanProjects() {
	for(var i = 0; i < Mantis.UserProjects.length; i++) {
		var parentProject = new KanbanProject(Mantis.UserProjects[i]);
		Kanban.Projects[Kanban.Projects.length] = parentProject;
		if(parentProject.ProjectSource.subprojects.length > 0) {
			AddProjectandSubProjectsToList(parentProject.ProjectSource.subprojects, parentProject);
		}
	}
}

function AddProjectandSubProjectsToList(projectList, parent) {
	for(var q=0; q < projectList.length; q++) {
		var subProject = new KanbanProject(projectList[q]);
		Kanban.Projects[Kanban.Projects.length] = subProject;
		subProject.ParentProject = parent;
		subProject.IsSubProject = true;
		parent.SubProjects[parent.SubProjects.length] = subProject;
		if(subProject.ProjectSource.subprojects.length > 0) {
			AddProjectandSubProjectsToList(subProject.ProjectSource.subprojects, subProject);
		}
	}
}

function BuildProjectUI(project, parent, preSelectedProjectID) {

		var projectLI = document.createElement("li");
		var projectDiv = document.createElement("a");
		projectDiv.setAttribute("id", "project" + project.ID);
		projectDiv.setAttribute("href", "");
		projectDiv.setAttribute("onclick", "document.getElementById('seletedproject').value = '" + project.ID + "'; document.getElementById('searchfield').value = ''; SelectProject(); SwapSelectedProject(this.id); return false;");
		projectDiv.setAttribute("selected", project.ID == preSelectedProjectID ? "true" : "false");
		if(project.IsSubProject) {
			projectLI.classList.add("subproject");
		}
		projectDiv.innerHTML = project.Name;
		projectLI.appendChild(projectDiv);

		parent.appendChild(projectLI);

}

function BuildProjectsGUI() {
	var projectDivContainer = document.getElementById("projectlist");
	var preSelectedProjectID = document.getElementById("seletedproject").value == "" ? Kanban.Projects[0].ID : document.getElementById("seletedproject").value;
	try { while(projectDivContainer.childNodes.length > 0) { projectDivContainer.removeChild(projectDivContainer.firstChild); } } catch(e) { }
	for(var i = 0; i < Kanban.Projects.length; i++) {
		
		var thisProject = Kanban.Projects[i];
		BuildProjectUI(thisProject, projectDivContainer, preSelectedProjectID);

	}

	if(document.getElementById("seletedproject").value == "" || !Kanban.HasProject(document.getElementById("seletedproject").value)) {
		document.getElementById("seletedproject").value = Kanban.Projects[0].ID;
	}
}

function SelectFirstMantisProjectUserAccessAccessTo(obj, doc) {
	Mantis.CurrentProjectID = obj[0].id;
}

function CreateKanbanStoriesFromMantisIssues(obj) {
	for(var is = 0; is < obj.length; is++) {
		Kanban.AddStoryToArray(new KanbanStory(obj[is]));
	}
	
}
function AutoLogin(){
	//use this function to check to see if the user has local storage for username and password and if they do log in automatically
	if (Modernizr.localstorage) {
  		log("window.localStorage is available!");
  		LoadSettingsFromLocalStorage();
	}
	else {
  		log("no native support for HTML5 storage :( maybe try dojox.storage or a third-party solution");
  		LoadSettingsFromCookieStorage();
	}
}

function OpenLightBox(itemid) {
	document.getElementById("lightboximage").setAttribute("src", $(itemid)[0].src);
	document.getElementById("attachmentdisplay").style.display = "block";
}

function CloseLightBox(itemid) {
	document.getElementById("attachmentdisplay").style.display = "none";
}

function LoadSettingsFromLocalStorage(){
	//check for users settings and login information
	//if the settings exist load them into the DefaultSettings
	if(localStorage.mantiskanbanSettings != "" && localStorage.mantiskanbanSettings != null && localStorage.mantiskanbanSettings != "undefined")
	{
		log("Local story exists!!!");
		DefaultSettings = JSON.parse(localStorage.mantiskanbanSettings);
		log("loaded user saved settings into the DefaultSettings");
		log(JSON.stringify(DefaultSettings));
		//put the username in the field if the DefaultSettings.lastAccessTime is less than 30 days ago
		var currentTime = Math.round(new Date().getTime() / 1000);
		if(((currentTime - DefaultSettings.lastAccessTime) < 2592000) && DefaultSettings.stayLoggedIn == 1){
			log("user logged in less than 30 days ago put their name in the box");
			document.getElementById("username").value = DefaultSettings.username;
			document.getElementById("password").value = "";
		}
		//if the current project in the settings is not the same as the project default then load it.
		if(DefaultSettings.currentProject != Mantis.CurrentProjectID){
			log("setting user-saved filter as default project: " + DefaultSettings.currentProject);
			Mantis.CurrentProjectID = DefaultSettings.currentProject;
			document.getElementById("seletedproject").value = Mantis.CurrentProjectID;
			log("CurrentProjectID set to " + Mantis.CurrentProjectID);
		}
	}
	//otherwise load the DefaultSettings
	else
	{
		log("Local storage don't exist!!");
		localStorage.setItem("mantiskanbanSettings", JSON.stringify(DefaultSettings));
		log("loaded DefaultSettings in to user saved settings.");
		log(localStorage.mantiskanbanSettings);
	}
}

function LoadSettingsFromCookieStorage(){

}

function saveSettingsToStorageMechanism(){
	log("saveCurrentSettings() called.");
	if (Modernizr.localstorage) {
  		localStorage.setItem("mantiskanbanSettings", JSON.stringify(DefaultSettings));
  		log("local stored settings: " + localStorage.getItem("mantiskanbanSettings"));
  		log("defaultSettings: " + JSON.stringify(DefaultSettings));
	}
	else {
  		//put the cookie version of the saveCurrentSettings() here.

	}

}

function AutoAdjustListWidth() {
	var contentArea = document.getElementById("kanbancontent")
	if(contentArea.clientWidt != contentArea.scrollWidth) {
		var newWidth = FitColsToScreen();
		document.getElementById("settings-list-width").value = newWidth;
		modifyStyleRule(".kanbanlist", "width", newWidth);		
	}
}

function FitColsToScreen(){
	var newColumnWidth = Math.floor((window.innerWidth - 80) / 7) - 2; //-80 for padding compensation
	document.getElementById("settings-list-width").value = newColumnWidth + "px";
	return newColumnWidth + "px";
}