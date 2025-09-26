// Проверяем "сессию"
// if (localStorage.getItem("loggedIn") === "true") {
//   if (window.location.pathname.endsWith("index.html")) {
//     window.location.href = "dashboard.html";
//   }
// }

//  axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", //URL ASP.NET API
  headers: {
    "Content-Type": "application/json"
  }
});


if (localStorage.getItem("loggedIn") !== "true") {
  if (!window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
}

// Buttons Sound
// Функция для воспроизведения звука
function playSound(src, volume = 0.5) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.currentTime = 0;
  audio.play();
}

// Находим все кнопки
const buttons = document.querySelectorAll('button, .sidebar nav ul li');

// Назначаем события
buttons.forEach(btn => {
  btn.addEventListener('mouseover', () => playSound('assets/sounds/hover.mp3', 0.1));
  btn.addEventListener('click', () => playSound('assets/sounds/click.mp3', 0.1));
});


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


/* ///////////////////////////////////////REGISTRATION/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////REGISTRATION////////////////////////////////////////////////////////// */

    // --- Модалка регистрации ---
    const registerModal = document.getElementById('register-modal');
    const openRegister = document.getElementById('open-register');
    const closeRegister = document.getElementById('close-register');
    const registerBtn = document.getElementById('register-btn');
    const errorMsg = document.getElementById('register-error');

    if (openRegister && closeRegister && registerBtn && errorMsg) {
    openRegister.addEventListener('click', () => {
      registerModal.style.display = 'flex';
    });

    closeRegister.addEventListener('click', () => {
      registerModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        registerModal.style.display = 'none';
      }
    });
    }

    // --- Валидация регистрации ---
  //   if (registerBtn && errorMsg) {
  //   registerBtn.addEventListener('click', () => {
  //     const username = document.getElementById('reg-username').value.trim();
  //     const email = document.getElementById('reg-email').value.trim();
  //     const pass = document.getElementById('reg-password').value;
  //     const pass2 = document.getElementById('reg-password2').value;

  //     if (username.length < 3) {
  //       errorMsg.textContent = "Логин должен быть минимум 3 символа";
  //       return;
  //     }
  //     if (!email.includes('@') || !email.includes('.')) {
  //       errorMsg.textContent = "Введите корректный email";
  //       return;
  //     }
  //     if (pass.length < 6) {
  //       errorMsg.textContent = "Пароль должен быть минимум 6 символов";
  //       return;
  //     }
  //     if (pass !== pass2) {
  //       errorMsg.textContent = "Пароли не совпадают";
  //       return;
  //     }

  //     errorMsg.textContent = "";

  //     // После регистрации подставляем логин в форму входа
  //     document.getElementById('username').value = username;

  //     registerModal.style.display = 'none';
  //   });
  // }

  if (registerBtn && errorMsg) {
  registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value;
    const pass2 = document.getElementById("reg-password2").value;

    if (username.length < 3) {
      errorMsg.textContent = "Логин должен быть минимум 3 символа";
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      errorMsg.textContent = "Введите корректный email";
      return;
    }
    if (pass.length < 6) {
      errorMsg.textContent = "Пароль должен быть минимум 6 символов";
      return;
    }
    if (pass !== pass2) {
      errorMsg.textContent = "Пароли не совпадают";
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password: pass
      });

      if (response.data.success) {
        errorMsg.textContent = "";
        alert("Регистрация успешна!");

        document.getElementById("username").value = username;
        registerModal.style.display = "none";
      } else {
        errorMsg.textContent = response.data.message || "Ошибка регистрации";
      }
    } catch (err) {
      errorMsg.textContent = "Ошибка сервера, попробуйте позже";
      console.error(err);
    }
  });
}


    /* ///////////////////////////////////////REGISTRATION/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////REGISTRATION////////////////////////////////////////////////////////// */

// /////////////////////////////////////////// Все монеты Модалка ///////////////////////////////////////////

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const allCoinsModal = document.getElementById('allCoinsModal');
  const showAllBtn = document.querySelector('.show-all-btn');
  const closeAllCoins = document.getElementById('closeAllCoins');
  const allCoinsList = document.getElementById('allCoinsList');

  // Заглушка: 30 монет
  const coinsData = [];
  for (let i = 1; i <= 30; i++) {
    coinsData.push({
      name: `COIN${i}`,
      price: `$${(Math.random() * 1000).toFixed(2)}`,
      icon: 'assets/images/coin-icon.png' // пока одинаковая иконка
    });
  }

  // Открытие модалки при клике на кнопку
  showAllBtn.addEventListener('click', () => {
    // Очистка списка перед добавлением
    allCoinsList.innerHTML = '';

    // Добавляем все монеты
    coinsData.forEach(coin => {
      const div = document.createElement('div');
      div.className = 'coin-item';
      div.innerHTML = `<img src="${coin.icon}" alt="${coin.name}"><span>${coin.name} - ${coin.price}</span>`;
      allCoinsList.appendChild(div);
    });

    // Показываем модалку
    allCoinsModal.style.display = 'flex';
  });

  // Закрытие при клике на крестик
  closeAllCoins.addEventListener('click', () => {
    allCoinsModal.style.display = 'none';
  });

  // Закрытие при клике вне модалки
  window.addEventListener('click', (e) => {
    if (e.target === allCoinsModal) {
      allCoinsModal.style.display = 'none';
    }
  });
});



// /////////////////////////////////////////// Все монеты Модалка ///////////////////////////////////////////