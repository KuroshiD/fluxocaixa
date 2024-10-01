const form = document.querySelector(".form")
const usernameInput = document.querySelector("#username")
const passwordInput = document.querySelector("#password")

const formHandler = async (e) => {
    e.preventDefault();
    const username = usernameInput.value
    const password = passwordInput.value
    const passwordOrInputIsEmpty = !username || !password

    if (passwordOrInputIsEmpty) {
        showNotification("Por favor, preencha todos os campos", 2);
        return;
    }

    const emailIsValid = validateEmail(username)
    if (!emailIsValid) {
        showNotification("O formato do email é invalido", 2)
        return;
    }

    const data = {
        email: username,
        password: password
    }

    const json = await apiUtils.post("/user/login", data)
    //console.log(json.data.data.username);
    setLocalStorage("token", json.data.data.username)


    if (!json.success)
        return showNotification(json.data.message, 3)

    showNotification(json.data.message)

    setTimeout(() => {
        window.location.replace("/admin")
    }, 1500)
}

form.addEventListener("submit", formHandler)