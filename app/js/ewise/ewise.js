function initialise() {
    try {
        //TODO start download progres graphic

        $.ewise.initialise(function (status) {
            if (status == "not registered") {
                $.ewise.register(function (response) {
                    var status = response.status;

                    if (status != "success")
                    {
                        //TODO send user back to login
                        alert('not registered');
                    }
                    
                });                
            }
            else if (status == "not supported") {
                //TODO should have done this check on the landing page. redirect the user to the invalid browser page
                alert('not supported');
            }
            else if (status == "no component") {
                //download the installer from the server
                $.ewise.downloadComponent();

                //fireup a timer to check on the download progress
                checkDownloadProgress();
            }
            else if (status == "no safe") {
                //create the users safe
                $.ewise.createSafe(function (response) {
                    if (response.status == "success")
                        $.ewise.setSafe("", initialise);
                });
            }
            else if (status == "success") {
                //TODO terminate download progress graphic

                //redirect to the dashboard page. add cache buster
                window.location.assign('myaccounts?rand=' + Math.random());
            }
            else if ("init error") {
                //TODO this needs an error handler
                alert("error connecting to ewise server");
            }
            else {
                //TODO add suitable response
                alert(status);
            }
        });
    } catch (e) {
        //TODO what to do here?
    }
}

function checkDownloadProgress() {
    //check on the download progress

    //create a variable to holder the timer
    var timeOut = null;

    //check if download has completed successfully yet
    if ($.ewise.checkComponent() == "success") {

        //download complete, re-run initialise to get reset of login completed
        initialise();

        //destroy the timer
        clearTimeout(timeOut);
    } else {
        //continue checking install progress
        timeOut = setTimeout("checkDownloadProgress()", 1000);
    }
}