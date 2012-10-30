
window.onload = function() {

    $( "#story-form" ).dialog({
        autoOpen: false,
        height: 400,
        width: 450,
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
    
    Kanban.Lists = [];
    Kanban.Stories = [];
    Kanban.ClearListGUI();
    
    BuildKanbanListFromMantisStatuses();
    Mantis.ProjectsGetUserAccessible(SelectFirstMantisProjectUserAccessAccessTo);
    Mantis.ProjectGetIssues(Mantis.CurrentProjectID, 0, 0, CreateKanbanStoriesFromMantisIssues);
    //alert(JSON.stringify(Mantis.AccessLevels))
    //alert(JSON.stringify(Mantis.ProjectUsers));
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
    for(var si = 0; si < Mantis.Statuses.length; si++) {
        var status = Mantis.Statuses[si]
        Kanban.AddList(new KanbanList(status.name, status.id));
    }
    
}

function EnumServerities_callBack(r) {
    alert("EnumServerities:" + JSON.stringify(r));
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
