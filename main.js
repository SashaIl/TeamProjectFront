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

/* ///////////////////////////////////////ACCOUNT/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////ACCOUNT////////////////////////////////////////////////////////// */


// Заглушки
function changeUsername() {
  const newUsername = prompt("Введите новый юзернейм:", "Admin");
  if (newUsername) {
    document.getElementById("usernameDisplay").textContent = newUsername;
    alert("Юзернейм успешно изменён!");
  }
}

function changePassword() {
  const newPassword = prompt("Введите новый пароль:");
  if (newPassword) {
    alert("Пароль успешно изменён!");
  }
}

// --- Модальное окно ---
function openAvatarModal() {
  document.getElementById("avatarModal").style.display = "flex";
}

function closeAvatarModal() {
  document.getElementById("avatarModal").style.display = "none";
}

// --- Установка аватарки ---
function setAvatar(src) {
  document.getElementById("avatarImg").src = src;
  localStorage.setItem("avatar", src);
  closeAvatarModal();
}

// --- Загрузка сохранённых данных ---
window.onload = function() {
  const savedAvatar = localStorage.getItem("avatar");
  if (savedAvatar) {
    const avatarImg = document.getElementById("avatarImg");
    if (avatarImg) avatarImg.src = savedAvatar;   // обновляем только если есть на странице

    const headerAvatar = document.getElementById("headerAvatar");
    if (headerAvatar) headerAvatar.src = savedAvatar; // обновляем хедер
  }

  const savedUsername = localStorage.getItem("username");
  if (savedUsername) {
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) usernameDisplay.textContent = savedUsername;

    const usernameText = document.getElementById("usernameText");
    if (usernameText) usernameText.textContent = savedUsername;
  }
};




/* ///////////////////////////////////////ACCOUNT/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////ACCOUNT////////////////////////////////////////////////////////// */