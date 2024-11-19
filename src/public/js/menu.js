(() => {

    const menu = document.querySelector('.menuLateral');
    const usernameH1 = document.querySelector('.iMain h1');

    usernameH1.textContent = `Olá, ${getLocalStorage("username") || "Nome"}`;

})();


