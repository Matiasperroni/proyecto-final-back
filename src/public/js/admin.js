const email = document.querySelector(".email")
const submitBtn = document.querySelector(".submitBtn")

submitBtn.addEventListener("click", () => {
    window.location.replace(`/api/users/user/${email.value}`)
})

const emailDelete = document.querySelector(".emailDelete")
const deleteUser = document.querySelector(".deleteUser")

deleteUser.addEventListener("click", async ()=>{
    const response = await fetch(`/api/users/${emailDelete.value}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
})

const emailChangeUser = document.querySelector(".emailChangeUser")
const changeRole = document.querySelector(".changeRole")

changeRole.addEventListener("click", () => {
    window.location.replace(`/api/users/changerole/${emailChangeUser.value}`)
})