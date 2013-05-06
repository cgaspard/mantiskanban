var LoadingIssuesList = new Array();
var DebugOn = false;
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

window.onload = function() {


	//make sure that the username and password form doesnt actually submit. 
	//need this here as a fail safe because jQuery is included.
	$('#userLoginForm').submit(function() {
  		Login();
  		return false;
	});

	$("#user-context-menu").hide();
	$("#project-selector").hide();

	document.getElementById("username").focus();

    jQuery(document).ready(function ($) {
        $('#tabs').tab();
    });
    
	AutoLogin();

}

 
function Login() {
	log("Login() called.");
	
	StartLoading();
	
	document.getElementById("username").focus();
	Mantis.CurrentUser.UserName = document.getElementById("username").value;
	Mantis.CurrentUser.Password = document.getElementById("password").value;
	
	try {
		var retObj = Mantis.Login(Mantis.CurrentUser.UserName, Mantis.CurrentUser.Password);
	} catch (e) {
		alert("Error Login: \r\n\r\n" + e.message);
		return;
	}

	//put the user-entered data into the DefaultSettings array.
	DefaultSettings.username = document.getElementById("username").value;
	DefaultSettings.stayLoggedIn = 1;
	DefaultSettings.lastAccessTime = Math.round(new Date().getTime() / 1000);

	//saveCurrentSettings();
	
	LoadKanbanProjects();
	BuildProjectsGUI();
	BuildProjectSelector();
	BuildUserSelector();
	
	HideLoginArea();
	ShowProjectArea();
	
	SelectProject();

	StopLoading();
}

function BuildProjectSelector() {
	log("BuildProjectSelector() called.");

	var projectSelector = document.getElementById("project-selector");

	try { while(projectSelector.children.length > 1) { projectSelector.removeChild(1); } } catch(e) { }

	for(var ui = 0; ui < Kanban.Projects.length; ui++) {
		var thisProject = Kanban.Projects[ui];
		var projectSelectorItem = document.createElement("li");
		projectSelectorItem.setAttribute("projectid", thisProject.ID);
		projectSelectorItem.setAttribute("onmouseout", "event.stopPropagation();");
		projectSelector.appendChild(projectSelectorItem);

		var projectSelectorItemLink = document.createElement("a");
		projectSelectorItemLink.setAttribute("href", "#");
		projectSelectorItemLink.setAttribute("projectid", thisProject.ID);
		//projectSelectorItemLink.setAttribute("onclick", "Mantis.CurrentProjectID = " thisProject.ID)
		projectSelectorItemLink.innerHTML = thisProject.Name;
		projectSelectorItem.appendChild(projectSelectorItemLink);
	}	
}

function BuildUserSelector() {
	log("BuildUserSelector() called.");

	var userContextMenu = document.getElementById("user-context-menu-container");

	try { while(userContextMenu.children.length > 0) { userContextMenu.removeChild(0); } } catch(e) { }

	for(var ui = 0; ui < Mantis.ProjectUsers.length; ui++) {
		var thisMantisUser = Mantis.ProjectUsers[ui];
		var storyDivMenuItem = document.createElement("li");
		storyDivMenuItem.setAttribute("userid", thisMantisUser.id);
		storyDivMenuItem.setAttribute("onmouseout", "event.stopPropagation();");
		userContextMenu.appendChild(storyDivMenuItem);

		var storyDivMenuItemLink = document.createElement("a");
		storyDivMenuItemLink.setAttribute("href", "#");
		storyDivMenuItemLink.setAttribute("userid", thisMantisUser.id);
		storyDivMenuItemLink.innerHTML = thisMantisUser.real_name;
		storyDivMenuItem.appendChild(storyDivMenuItemLink);
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
	document.getElementById("contentarea").style.display = "table-row";
	
}

function HideProjectArea() {
	document.getElementById("projectarea").style.display = "none";
	document.getElementById("contentarea").style.display = "none";
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

function SelectProject() {
	log("SelectProject() called.");
	Mantis.CurrentProjectID = document.getElementById("seletedproject").value;

	//put selected project into localstorage so that next time the user logs in it loads their current project.
	DefaultSettings.currentProject = Mantis.CurrentProjectID;
	saveSettingsToStorageMechanism();

	StartLoading();

	Kanban.Lists = [];
	Kanban.Stories = [];
	Kanban.ClearListGUI();

	Mantis.CurrentProjectID = document.getElementById("seletedproject").value;

	window.setTimeout("UpdateFilterList()", 100);

	BuildKanbanListFromMantisStatuses();
	
	Kanban.BuildListGUI();

	document.getElementById("selected-project-name").innerHTML = Kanban.CurrentProject.Name;

	if(Mantis.DefaultFilterID !== null) {
		window.setTimeout("LoadFilterAsync(Mantis.DefaultFilterID, 0, 0, DoneLoadingIssuesCallback)", 100);
		if(Mantis.ClosedIssuesFilterID !== null) {
			window.setTimeout("LoadFilterAsync(Mantis.ClosedIssuesFilterID, 1, Kanban.NumberOfClosedMessagesToLoad, DoneLoadingIssuesCallback)", 100);
		}
	} else {
		var retObj = Mantis.ProjectGetIssues(Mantis.CurrentProjectID, 0, 0);
		CreateKanbanStoriesFromMantisIssues(retObj);
		StopLoading();
	}
}

function UpdateFilter(filterID) {
	Mantis.DefaultFilterID = filterID;
	SelectProject();
}

function UpdateFilterList() {

	log("UpdateFilterList() called.");

	var filterList = document.getElementById("filterlist");
	var filterListArray = Mantis.FilterGet(Mantis.CurrentProjectID)
	//filterList.options.length = 0;

	//try {
	while(filterList.children.length > 0) { 
	 	filterList.removeChild(filterList.children[0]);
	 	//delete filterList.children[0];
	} 
	 //} catch(e) { }

	//	if(filter.id == Mantis.DefaultFilterID) filterList.selectedIndex = i;

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
	///Add a blank option
	
	//var filterListArray = Mantis.FilterGet(Mantis.CurrentProjectID)
	//for(var i = 0; i < filterListArray.length; i++) {
	//	var filter = filterListArray[i];
	//	filterList.options[filterList.options.length] = new Option(filter.name, filter.id);
	//	if(filter.id == Mantis.DefaultFilterID) filterList.selectedIndex = i;
	//}
	
	//$("#filterlist").trigger("liszt:updated");

	//add the listeners to the gui items here
	//addGuiListeners();

}

function LoadFilterAsync(FilterID, Page, Limit, Callback) {
	var retObj = Mantis.FilterGetIssues(Mantis.CurrentProjectID, FilterID, Page, Limit);
	Callback(FilterID, retObj);
}

function DoneLoadingIssuesCallback(filterID, retObj) {
	CreateKanbanStoriesFromMantisIssues(retObj);
	LoadingIssuesList.splice(LoadingIssuesList.indexOf(filterID) -1, 1);
	if(LoadingIssuesList.length == 0) {
		console.log("Done Loading " + filterID);
		StopLoading();
	}
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
		Kanban.Projects[i] = new KanbanProject(Mantis.UserProjects[i]);
	}
}

function BuildProjectsGUI() {
	var projectDivContainer = document.getElementById("projectlist");
	var preSelectedProjectID = document.getElementById("seletedproject").value == "" ? Kanban.Projects[0].ID : document.getElementById("seletedproject").value;
	try { while(projectDivContainer.childNodes.length > 0) { projectDivContainer.removeChild(projectDivContainer.firstChild); } } catch(e) { }
	for(var i = 0; i < Kanban.Projects.length; i++) {

		var projectLI = document.createElement("li");

		var projectDiv = document.createElement("a");
		projectDiv.setAttribute("id", "project" + Kanban.Projects[i].ID);
		projectDiv.setAttribute("href", "");
		projectDiv.setAttribute("onclick", "document.getElementById('seletedproject').value = '" + Kanban.Projects[i].ID + "'; SelectProject(); SwapSelectedProject(this.id); return false;");
		projectDiv.setAttribute("selected", Kanban.Projects[i].ID == preSelectedProjectID ? "true" : "false");
		projectDiv.innerHTML = Kanban.Projects[i].Name;
		projectLI.appendChild(projectDiv);


		projectDivContainer.appendChild(projectLI);
	}
	// if(Kanban.Projects.length > 4) {
	//}
	//var projectDiv = document.createElement("li");
	//projectDiv.setAttribute("class", "projectbutton");
	//projectDiv.setAttribute("id", "projectshowmore");
	//projectDiv.setAttribute("onclick", "OpenProjectSelector(event);");
	//projectDiv.setAttribute("selected", Kanban.Projects[i].id == preSelectedProjectID ? "true" : "false");
	//projectDiv.innerHTML = "Projects"
	//projectDivContainer.appendChild(projectDiv);

	if(document.getElementById("seletedproject").value == "") {
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