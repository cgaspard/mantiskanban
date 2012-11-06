
window.onload = function() {

    document.getElementById("password").focus();
    /*
    window.setInterval(function() {
        if(!Dragging) {
            ClearAllDragHoverAreas();
        }
    }, 5000);
    */
    
    $( "#story-form" ).dialog({
        autoOpen: false,
        height: 550,
        width: 640,
        modal: true,
        buttons: {
            "Create a story": function() {
                Kanban.AddStoryFromFormData();
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            
        }
    });

    $("#edit-story-form").dialog({
        autoOpen: false,
        modal: true,
        height: 590,
        width: 780,
        close: function() {
            
        },
        buttons: {
            "Save": function() {
                UpdateStoryFromFormData();
             ///Code here to add a story to a list 
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

 
function Login() {
    
    StartLoading();
    
		document.getElementById("username").focus();
    Mantis.CurrentUser.UserName = document.getElementById("username").value;
    Mantis.CurrentUser.Password = document.getElementById("password").value;
    
    BuildProjectsGUI();
    
    HideLoginArea();
    ShowProjectArea();
    
    SelectProject();

    StopLoading();
}

function HideLoginArea() {
    $(".loginarea").hide();
}
function ShowLoginArea() {
    $(".loginarea").show();
}

function ShowProjectArea() {
    $(".projectarea").show();
}

function HideProjectArea() {
    $(".projectarea").hide();
}

function Logout() {
    Kanban.Lists = [];
    Kanban.Stories = [];
    Kanban.ClearListGUI();

    Mantis.ClearForLogout();
    
    HideProjectArea();
    ShowLoginArea();
}

function SelectProject() {
    StartLoading();

    Kanban.Lists = [];
    Kanban.Stories = [];
    Kanban.ClearListGUI();

    Mantis.CurrentProjectID = document.getElementById("seletedproject").value;

    //alert(JSON.stringify(Mantis.ProjectCustomFields));

    BuildKanbanListFromMantisStatuses();
    Mantis.FilterGetIssues(Mantis.CurrentProjectID, Mantis.DefaultFilterID, CreateKanbanStoriesFromMantisIssues);
    //Mantis.ProjectGetIssues(Mantis.CurrentProjectID, 0, 0, CreateKanbanStoriesFromMantisIssues);

    StopLoading();
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
    } else {
        for(var si = 0; si < Mantis.Statuses.length; si++) {
            var status = Mantis.Statuses[si]
            Kanban.AddListToArray(new KanbanList(status));
        }
    }
    
}

function EnumServerities_callBack(r) {
    alert("EnumServerities:" + JSON.stringify(r));
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

function BuildProjectsGUI() {
    var projectDivContainer = document.getElementById("projectlist");
    try { while(projectDivContainer.childNodes.length > 0) { projectDivContainer.removeChild(projectDivContainer.firstChild); } } catch(e) { }
    for(var i = 0; i < Mantis.UserProjects.length; i++) {
        var projectDiv = document.createElement("div");
        projectDiv.setAttribute("class", "projectbutton");
        projectDiv.setAttribute("id", "project" + Mantis.UserProjects[i].id );
        projectDiv.setAttribute("onclick", "document.getElementById('seletedproject').value = '" + Mantis.UserProjects[i].id + "'; SelectProject(); SwapSelectedProject(this.id);");
        projectDiv.setAttribute("selected", i == 0 ? "true" : "false");
        projectDiv.innerHTML = Mantis.UserProjects[i].name;
        projectDivContainer.appendChild(projectDiv);
    }
    document.getElementById("seletedproject").value = Mantis.UserProjects[0].id;
}

function SelectFirstMantisProjectUserAccessAccessTo(obj, doc) {
    Mantis.CurrentProjectID = obj[0].id;
}


function CreateKanbanStoriesFromMantisIssues(obj, doc) {
    Kanban.Stories = [];
    var output = "";
    for(var is = 0; is < obj.length; is++) {
        output += obj[is].id + " " + obj[is].status.name.capitalize() + " " + obj[is].summary + "\r\n";
        Kanban.AddStoryToArray(new KanbanStory(obj[is]));
        //output += obj[is];
    }
    Kanban.BuildListGUI();
    //alert("ProjectGetIssues:" +obj.length + " found\r\n\r\n" + output);
}
