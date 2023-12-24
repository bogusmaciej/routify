const position_btn = document.querySelector(".get-position-btn")

function checkGeoPermission(){
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if(result.state == "granted"){
            position_btn.style.display = "block"
            position_btn.addEventListener("click", () => {
                setPosition()
            })
        }
    });
}

function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

async function setPosition(){
    await getPosition().then(async position => {
        const user_latitude = position.coords.latitude
        const user_longitude = position.coords.longitude
        document.querySelector("#origin").value = `${user_latitude}, ${user_longitude}`
    });
}