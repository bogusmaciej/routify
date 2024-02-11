document.getElementById("contact_button").addEventListener("click", () => {
    var email = document.getElementById("contact_email")
    var title = document.getElementById("contact_title")
    var message = document.getElementById("contact_message")
    var terms = document.getElementById("contact_terms")
    if(email.value != "" && title.value != "" && message.value != ""){
        document.getElementById("contact_email").disabled = true;
        document.getElementById("contact_title").disabled = true;
        document.getElementById("contact_message").disabled = true;
        document.getElementById("contact_terms").disabled = true;
    }
    else{
        alert("enter all values");
    }
})