function onSuccess(googleUser) {
    document.getElementById("title-desc").textContent = "Signing in...";
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/.netlify/functions/authenticate');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        const data = JSON.parse(xhr.responseText);
        if(data.accountExists)
            alert("You've already taken the survey!")
        else
            showPage(Pages.INSTRUCTIONS);
    };
    xhr.send('idtoken=' + id_token);
    
    var profile = googleUser.getBasicProfile();
    results.email = profile.getEmail();
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    document.body.style.opacity = 1;
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}