
window.onload = function() {

    $( "#story-form" ).dialog({
        autoOpen: false,
        height: 550,
        width: 700,
        modal: true,
        buttons: {
            "Create a story": function() {
                var bValid = true;
                allFields.removeClass( "ui-state-error" );
             ///Code here to add a story to a list 
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            allFields.val( "" ).removeClass( "ui-state-error" );
        }
    });

    $("#edit-story-form").dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        height: 400,
        close: function() {
            allFields.val( "" ).removeClass( "ui-state-error" );
        }
    });
}

 
function Login() {
    
    StartLoading();
    
    Mantis.CurrentUser.UserName = document.getElementById("username").value;
    Mantis.CurrentUser.Password = document.getElementById("password").value;
    
    BuildProjectSelectBox();
    
    HideLoginArea();
    ShowProjectArea();

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

function SelectProject() {
    StartLoading();

    Kanban.Lists = [];
    Kanban.Stories = [];
    Kanban.ClearListGUI();

    Mantis.CurrentProjectID = document.getElementById("kanbanprojects").value;

    //alert(JSON.stringify(Mantis.ProjectCustomFields));

    BuildKanbanListFromMantisStatuses();
    Mantis.ProjectGetIssues(Mantis.CurrentProjectID, 0, 0, CreateKanbanStoriesFromMantisIssues);

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
    if(Mantis.ProjectCustomFields.length > 0) {
        for(var cf = 0; cf < Mantis.ProjectCustomFields.length; cf++) {
            var customfield = Mantis.ProjectCustomFields[cf]
            if(customfield.field.name == Kanban._listIDField) {
                hasCutomFieldForStatus = true;
                var possiblevalues = customfield.possible_values.split("|");
                for(var pv = 0; pv < possiblevalues.length; pv++ ) {
                    possiblevalue = possiblevalues[pv];
                    Kanban.AddList(new KanbanList(possiblevalue, possiblevalue));
                }
            }
        }
    } else {
        for(var si = 0; si < Mantis.Statuses.length; si++) {
            var status = Mantis.Statuses[si]
            Kanban.AddList(new KanbanList(status.name, status.id));
        }
    }
    
}

function EnumServerities_callBack(r) {
    alert("EnumServerities:" + JSON.stringify(r));
}

function BuildProjectSelectBox() {
    var projectSelectBox = document.getElementById("kanbanprojects");
    for(var i = 0; i < Mantis.UserProjects.length; i++) {
        projectSelectBox.options[projectSelectBox.options.length] = new Option(Mantis.UserProjects[i].name, Mantis.UserProjects[i].id);
    }
}

function SelectFirstMantisProjectUserAccessAccessTo(obj, doc) {
    Mantis.CurrentProjectID = obj[0].id;
}


function CreateKanbanStoriesFromMantisIssues(obj, doc) {
    
    //alert(JSON.stringify(obj[0]));
    
    var output = "";
    for(var is = 0; is < obj.length; is++) {
        output += obj[is].id + " " + obj[is].status.name.capitalize() + " " + obj[is].summary + "\r\n";
        Kanban.AddStory(new KanbanStory(obj[is].id, obj[is].status, obj[is].summary, obj[is].description, obj[is].notes, obj[is].handler, obj[is]));
        //output += obj[is];
    }
    Kanban.BuildListGUI();
    //alert("ProjectGetIssues:" +obj.length + " found\r\n\r\n" + output);
}
