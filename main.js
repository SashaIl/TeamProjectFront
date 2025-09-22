// Проверяем "сессию"
// if (localStorage.getItem("loggedIn") === "true") {
//   if (window.location.pathname.endsWith("index.html")) {
//     window.location.href = "dashboard.html";
//   }
// }

if (localStorage.getItem("loggedIn") !== "true") {
  if (!window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
}

// Переход на другую страницу
function goToPage(page) {
  window.location.href = page;
}



// Логин
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // простая проверка
    if (username === "admin" && password === "1234") {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      alert("Неверный логин или пароль");
    }
  });
}

// Выход
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });
}

/* ///////////////////////////////////////HISTORY/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////HISTORY////////////////////////////////////////////////////////// */

// Заглушка пока что
const historyData = [
  { date: '2025-09-22', type: 'Пополнение', coin: 'BTC', amount: '0.5', status: 'Успешно' },
  { date: '2025-09-21', type: 'Вывод', coin: 'ETH', amount: '1.2', status: 'В процессе' },
  { date: '2025-09-20', type: 'Обмен', coin: 'USDT→BTC', amount: '100', status: 'Успешно' },
  { date: '2025-09-19', type: 'Пополнение', coin: 'ETH', amount: '0.3', status: 'Успешно' },
];

const historyBody = document.getElementById("historyBody");
if (historyBody) {
  historyData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.type}</td>
      <td>${item.coin}</td>
      <td>${item.amount}</td>
      <td>${item.status}</td>
    `;
    historyBody.appendChild(tr);
  });
}


/* ///////////////////////////////////////HISTORY/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////HISTORY////////////////////////////////////////////////////////// */

