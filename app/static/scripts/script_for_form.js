var messageId = 1
const messageBox = document.querySelector(".messages")
document.getElementById("contact_button").addEventListener("click", () => {
    var email = document.getElementById("contact_email")
    var title = document.getElementById("contact_title")
    var message = document.getElementById("contact_message")
    var terms = document.getElementById("contact_terms")
    
    if(terms.checked){
        if(email.value != "" && title.value != "" && message.value != ""){
            element = `<div class = "message-line">
                <h2>${messageId}. ${title.value}<br></h2>
                ${message.value}
            </div>`
            document.querySelector(".messages_lines").innerHTML+=element;
            messageId++;
            email.value=""
            title.value=""
            message.value=""
            terms.checked = false;
        }
        else{
            alert("enter all values");
        }
    }
    else{
        alert("you have to accept terms");
    }
})

document.getElementById("close_messages_btn").addEventListener("click", ()=>{
    messageBox.style.display = "none";
})

document.getElementById("show_messages").addEventListener("click", ()=>{
    messageBox.style.display = "block";
})