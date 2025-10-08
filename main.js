// Проверяем "сессию"
// if (localStorage.getItem("loggedIn") === "true") {
//   if (window.location.pathname.endsWith("index.html")) {
//     window.location.href = "dashboard.html";
//   }
// }

//  axios
const api = axios.create({
  baseURL: "https://localhost:7164/api", //URL ASP.NET API
  headers: {
    "Content-Type": "application/json"
  }
});

// token
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


// Проверка "сессии" (токена)
// if (localStorage.getItem("loggedIn") !== "true") {
//   if (!window.location.pathname.endsWith("index.html")) {
//     window.location.href = "index.html";
//   }
// }


//Проверка токена, для запрета перехода на другие страницы
if (!localStorage.getItem("token") && !window.location.pathname.endsWith("index.html")) {  // Закоментить для теста
  window.location.href = "index.html";
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
// const loginForm = document.getElementById("loginForm");
// if (loginForm) {
//   loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();
    
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value; // ЗАКОМЕНТИТЬ ЛОГИН ТЕСТ!!!

//     // простая проверка
//     if (username === "admin" && password === "1234") {
//       localStorage.setItem("loggedIn", "true");
//       window.location.href = "dashboard.html";
//     } else {
//       alert("Неверный логин или пароль");
//     }
//   });
// }

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("username").value;
    const password = document.getElementById("password").value;  // РАСКОМЕНТИТЬ ЛОГИН!!!!

    try {
      const response = await api.post("/user/log-in", {
        login,
        password
      });

      console.log(response.status);
      console.log(response.data);

      if (response.data.status == 1) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", response.data.data.jwtToken); // сохраним JWT токен
        localStorage.setItem("login", login);
        localStorage.setItem("walletId", response.data.data.walletId);
        window.location.href = "dashboard.html";
      } else {
        alert(response.data.message || "Неверный логин или пароль");
      }
    } catch (err) {
      alert("Ошибка сервера при входе");
      console.error(err);
    }
  });
}

const userWalletId = localStorage.getItem("walletId");

// Выход
// const logoutBtn = document.getElementById("logoutBtn");
// if (logoutBtn) {
//   logoutBtn.addEventListener("click", () => {   // ЗАКОМЕНТИТЬ ВЫХОД!!!!
//     localStorage.removeItem("loggedIn");
//     window.location.href = "index.html";
//   });
// }

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {      // РАСКОМЕНТИТЬ ВЫХОД!!!!
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

/* ///////////////////////////////////////HISTORY/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////HISTORY////////////////////////////////////////////////////////// */

// // Заглушка пока что
// const historyData = [
//   { date: '2025-09-22', type: 'Пополнение', coin: 'BTC', amount: '0.5', status: 'Успешно' },
//   { date: '2025-09-21', type: 'Вывод', coin: 'ETH', amount: '1.2', status: 'В процессе' },
//   { date: '2025-09-20', type: 'Обмен', coin: 'USDT→BTC', amount: '100', status: 'Успешно' },
//   { date: '2025-09-19', type: 'Пополнение', coin: 'ETH', amount: '0.3', status: 'Успешно' },
// ];

// const historyBody = document.getElementById("historyBody");
// if (historyBody) {
//   historyData.forEach(item => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//       <td>${item.date}</td>
//       <td>${item.type}</td>
//       <td>${item.coin}</td>
//       <td>${item.amount}</td>
//       <td>${item.status}</td>
//     `;
//     historyBody.appendChild(tr);
//   });
// }


document.addEventListener("DOMContentLoaded", async () => {
  const historyBody = document.getElementById("historyBody");
  if (!historyBody) return; // если нет таблицы, значит не на странице History

  try {
    // 1️ Получаем кошелёк пользователя
    // const walletRes = await api.get("/wallet");
    // const walletId = walletRes.data.id;

    // 2️ Получаем историю операций
    const historyRes = (await api.get(`/Crypto/wallet-transactions?walletId=${userWalletId}`)).data;
    const historyData = historyRes.data || [];

    // 3️ Если истории нет
    if (historyData.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="5">История операций пока отсутствует</td></tr>`;
      return;
    }

    // 4️ Отрисовка истории
    historyBody.innerHTML = "";
    historyData.forEach(item => {
      const transType = item.transactionType;
      if(transType == 0) item.transactionType = "Пополнение";
      else if (transType == 2) item.transactionType = "Вывод";
      else if (transType == 1) item.transactionType = "Обмен";
      const symb = item.fromAsset??"USDT";
      let changedTime = item.date;
      changedTime = changedTime.replace('T', ' ');
      let coin = item.fromAsset + " → " + item.toAsset;
      if(item.toAsset == null) {
        coin = item.fromAsset;
      }
      else if(item.fromAsset == null) {
        coin = item.toAsset;
      }
      item.fromAsset = coin;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${changedTime.slice(0, 16)}</td>
        <td>${item.transactionType}</td>
        <td>${coin}</td>
        <td>${item.amount} ${symb}</td>
        <td>Выполнено</td>
      `;
      historyBody.appendChild(tr);
    });

  } catch (err) {
    console.error("Ошибка загрузки истории:", err);
    historyBody.innerHTML = `<tr><td colspan="5">Не удалось загрузить данные</td></tr>`;
  }
});


/* ///////////////////////////////////////HISTORY/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////HISTORY////////////////////////////////////////////////////////// */

/* ///////////////////////////////////////ACCOUNT/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////ACCOUNT////////////////////////////////////////////////////////// */


// // Заглушки
// function changeUsername() {
//   const newUsername = prompt("Введите новый юзернейм:", "Admin");
//   if (newUsername) {
//     document.getElementById("usernameDisplay").textContent = newUsername;
//     alert("Юзернейм успешно изменён!");
//   }
// }

// function changePassword() {
//   const newPassword = prompt("Введите новый пароль:");
//   if (newPassword) {
//     alert("Пароль успешно изменён!");
//   }
// }

// // --- Модальное окно ---
// function openAvatarModal() {
//   document.getElementById("avatarModal").style.display = "flex";
// }

// function closeAvatarModal() {
//   document.getElementById("avatarModal").style.display = "none";
// }

// // --- Установка аватарки ---
// function setAvatar(src) {
//   document.getElementById("avatarImg").src = src;
//   localStorage.setItem("avatar", src);
//   closeAvatarModal();
// }

// // --- Загрузка сохранённых данных ---
// window.onload = function() {
//   const savedAvatar = localStorage.getItem("avatar");
//   if (savedAvatar) {
//     const avatarImg = document.getElementById("avatarImg");
//     if (avatarImg) avatarImg.src = savedAvatar;   // обновляем только если есть на странице

//     const headerAvatar = document.getElementById("headerAvatar");
//     if (headerAvatar) headerAvatar.src = savedAvatar; // обновляем хедер
//   }

//   const savedUsername = localStorage.getItem("username");
//   if (savedUsername) {
//     const usernameDisplay = document.getElementById("usernameDisplay");
//     if (usernameDisplay) usernameDisplay.textContent = savedUsername;

//     const usernameText = document.getElementById("usernameText");
//     if (usernameText) usernameText.textContent = savedUsername;
//   }
// };

// ================= ACCOUNT LOGIC ===================


// --- Смена аватарки (без API) ---
function openAvatarModal() {
  document.getElementById("avatarModal").style.display = "flex";
}
function closeAvatarModal() {
  document.getElementById("avatarModal").style.display = "none";
}
function setAvatar(src) {
  document.getElementById("avatarImg").src = src;
  const headerAvatar = document.getElementById("headerAvatar");
  if (headerAvatar) headerAvatar.src = src;
  localStorage.setItem("avatar", src);
  closeAvatarModal();
}

// --- Смена юзернейма с модалкой ---
function createChangeUsernameModal() {
  if (document.getElementById('changeUsernameModal')) return;

  const modal = document.createElement('div');
  modal.id = 'changeUsernameModal';
  modal.className = 'modal-avatars';
  modal.innerHTML = `
    <div class="modal-avatars-content">
      <span class="close-avatars" id="closeChangeUsername">&times;</span>
      <h3>Смена юзернейма</h3>
      <div class="change-username-form">
        <input type="text" id="newUsername" placeholder="Новый юзернейм">
        <button id="saveNewUsername">Сменить юзернейм</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = document.getElementById('closeChangeUsername');
  const saveBtn = document.getElementById('saveNewUsername');

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  saveBtn.addEventListener('click', async () => {
    const newUsername = document.getElementById('newUsername').value.trim();
    if (!newUsername) {
      alert('Введите юзернейм!');
      return;
    }


 

    const token = localStorage.getItem('token');
    try {
      const response = await api.put('/User/change-login', { newLogin: newUsername }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status === 1) {
        document.getElementById("usernameDisplay").textContent = newUsername;
        const usernameText = document.getElementById("usernameText");
        if (usernameText) usernameText.textContent = newUsername;
        localStorage.setItem("login", newUsername);
        alert('Юзернейм успешно изменён!');
        modal.style.display = 'none';
      } else {
        alert(response.data.message || 'Ошибка при смене юзернейма');
      }
    } catch (err) {
      console.error('Ошибка смены юзернейма:', err);
      alert('Ошибка сервера, попробуйте позже');
    }
  });
}

function changeUsername() {
  createChangeUsernameModal();
  document.getElementById('changeUsernameModal').style.display = 'flex';
}

// --- Смена пароля с модалкой ---
function createChangePasswordModal() {
  if (document.getElementById('changePasswordModal')) return;

  const modal = document.createElement('div');
  modal.id = 'changePasswordModal';
  modal.className = 'modal-avatars';
  modal.innerHTML = `
    <div class="modal-avatars-content">
      <span class="close-avatars" id="closeChangePassword">&times;</span>
      <h3>Смена пароля</h3>
      <div class="change-password-form">
        <input type="password" id="newPassword" placeholder="Новый пароль">
        <input type="password" id="confirmPassword" placeholder="Подтвердите пароль">
        <button id="saveNewPassword">Сменить пароль</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = document.getElementById('closeChangePassword');
  const saveBtn = document.getElementById('saveNewPassword');

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  saveBtn.addEventListener('click', async () => {
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
      alert('Заполните все поля!');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    try {
      const response = await api.put('/User/change-password', { newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.status === 1) {
        alert('Пароль успешно изменён!');
        modal.style.display = 'none';
      } else {
        alert(response.data.message || 'Ошибка при смене пароля');
      }
    } catch (err) {
      console.error('Ошибка при смене пароля:', err);
      alert('Ошибка сервера, попробуйте позже');
    }
  });
}

function changePassword() {
  createChangePasswordModal();
  document.getElementById('changePasswordModal').style.display = 'flex';
}

// --- Загрузка сохранённых данных при загрузке страницы ---
window.addEventListener('load', () => {
  const savedAvatar = localStorage.getItem("avatar");
  if (savedAvatar) {
    const avatarImg = document.getElementById("avatarImg");
    if (avatarImg) avatarImg.src = savedAvatar;
    const headerAvatar = document.getElementById("headerAvatar");
    if (headerAvatar) headerAvatar.src = savedAvatar;
  }

  const savedUsername = localStorage.getItem("login");
  if (savedUsername) {
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) usernameDisplay.textContent = savedUsername;

    const usernameText = document.getElementById("usernameText");
    if (usernameText) usernameText.textContent = savedUsername;
  }
});





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

    // window.addEventListener('click', (e) => {
    //   if (e.target === registerModal) {
    //     registerModal.style.display = 'none';
    //   }
    // });
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


// ................................Без двухфакторной аутентификации.............................................................

//   if (registerBtn && errorMsg) {
//   registerBtn.addEventListener("click", async () => {
//     const username = document.getElementById("reg-username").value.trim();
//     const email = document.getElementById("reg-email").value.trim();
//     const pass = document.getElementById("reg-password").value;
//     const pass2 = document.getElementById("reg-password2").value;

//     if (username.length < 3) {
//       errorMsg.textContent = "Логин должен быть минимум 3 символа";
//       return;
//     }
//     if (!email.includes("@") || !email.includes(".")) {
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

//     try {
//       const response = await api.post("/user/create-account", {
//         username,
//         //email,
//         password: pass
//       });

//       if (response.data.success) {
//         errorMsg.textContent = "";
//         alert("Регистрация успешна!");

//         document.getElementById("username").value = username;
//         registerModal.style.display = "none";
//       } else {
//         errorMsg.textContent = response.data.message || "Ошибка регистрации";
//       }
//     } catch (err) {
//       errorMsg.textContent = "Ошибка сервера, попробуйте позже";
//       console.error(err);
//     }
//   });
// }
// ................................Без двухфакторной аутентификации.............................................................


// .......................................Двухфакторная аутентификация.......................................................
if (registerBtn && errorMsg) {
  let verificationCode = null; // сохраняем код, чтобы не запрашивать повторно
  let isCodeSent = false; // флаг, чтобы знать, был ли уже отправлен код

  registerBtn.addEventListener("click", async () => {
    const login = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value;
    const pass2 = document.getElementById("reg-password2").value;

    // Валидация
    if (login.length < 3) return errorMsg.textContent = "Логин должен быть минимум 3 символа";
    if (!email.includes("@") || !email.includes(".")) return errorMsg.textContent = "Введите корректный email";
    if (pass.length < 6) return errorMsg.textContent = "Пароль должен быть минимум 6 символов";
    if (pass !== pass2) return errorMsg.textContent = "Пароли не совпадают";

    try {
      // Если код ещё не был отправлен, отправляем запрос
      if (!isCodeSent) {
        const sendRes = await api.post("/User/send-verification-code", { "requestEmail": email });
        const { message, status, data } = sendRes.data;

        if (status !== 1) {
          errorMsg.textContent = message || "Ошибка при отправке кода";
          return;
        }

        verificationCode = data;
        isCodeSent = true;
        console.log("Код отправлен:", verificationCode);  // ЗАКОМЕНТИТЬ!!!!
      }

      // Показываем модалку для ввода кода
      showCodeModal(async (enteredCode) => {
        if (String(enteredCode) !== String(verificationCode)) {
          alert("Неверный код подтверждения, попробуйте снова");
          return; // не сбрасываем код, просто даем шанс ввести заново
        }

        try {
          // Код верный — создаем аккаунт
          const regRes = await api.post("/User/create-account", {
            login,
            email,
            password: pass
          });

          const { message: regMsg, status: regStatus } = regRes.data;

          if (regStatus === 1) {
            alert("Регистрация успешна!");
            document.getElementById("username").value = login;
            registerModal.style.display = "none";
            // сбрасываем флаги, если нужно повторно использовать
            verificationCode = null;
            isCodeSent = false;
          } else {
            alert(regMsg || "Ошибка при регистрации");
          }

        } catch (err) {
          console.error(err);
          alert("Ошибка сервера при завершении регистрации");
        }
      });

    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Ошибка сервера, попробуйте позже";
    }
  });
}



// .......................................Двухфакторная аутентификация.......................................................

// --- Модалка ввода кода ---
function showCodeModal(onSubmit) {
  let modal = document.getElementById("codeModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "codeModal";
    modal.className = "modal-code";
    modal.innerHTML = `
      <div class="modal-code-content">
        <span class="close-code" id="closeCodeModal">&times;</span>
        <h3 style="color: #000000ff;" >Введите код отправленный на почту</h3>
        <input type="text" id="codeInput" maxlength="4" placeholder="0000">
        <button id="submitCodeBtn">Подтвердить</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("closeCodeModal").onclick = () => modal.style.display = "none";
    // window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
  }

  modal.style.display = "flex";

  const submitBtn = document.getElementById("submitCodeBtn");
  const codeInput = document.getElementById("codeInput");

  submitBtn.onclick = () => {
    const code = codeInput.value.trim();
    if (code.length !== 4) {
      alert("Введите 4-значный код");
      return;
    }
    onSubmit(code);
    modal.style.display = "none";
  };
}


    /* ///////////////////////////////////////REGISTRATION/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////REGISTRATION////////////////////////////////////////////////////////// */

// /////////////////////////////////////////// Все монеты Модалка ///////////////////////////////////////////

// Ждём полной загрузки DOM
// document.addEventListener('DOMContentLoaded', () => {
//   const allCoinsModal = document.getElementById('allCoinsModal');
//   const showAllBtn = document.querySelector('.show-all-btn');
//   const closeAllCoins = document.getElementById('closeAllCoins');
//   const allCoinsList = document.getElementById('allCoinsList');

//   // Заглушка: 30 монет
//   const coinsData = [];
//   for (let i = 1; i <= 30; i++) {
//     coinsData.push({
//       name: `COIN${i}`,
//       price: `$${(Math.random() * 1000).toFixed(2)}`,
//       icon: 'assets/images/coin-icon.png' // пока одинаковая иконка
//     });
//   }

//   // Открытие модалки при клике на кнопку
//   showAllBtn.addEventListener('click', () => {
//     // Очистка списка перед добавлением
//     allCoinsList.innerHTML = '';

//     // Добавляем все монеты
//     coinsData.forEach(coin => {
//       const div = document.createElement('div');
//       div.className = 'coin-item';
//       div.innerHTML = `<img src="${coin.icon}" alt="${coin.name}"><span>${coin.name} - ${coin.price}</span>`;
//       allCoinsList.appendChild(div);
//     });

//     // Показываем модалку
//     allCoinsModal.style.display = 'flex';
//   });

//   // Закрытие при клике на крестик
//   closeAllCoins.addEventListener('click', () => {
//     allCoinsModal.style.display = 'none';
//   });

//   // Закрытие при клике вне модалки
//   window.addEventListener('click', (e) => {
//     if (e.target === allCoinsModal) {
//       allCoinsModal.style.display = 'none';
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', async () => {
  // --- Элементы карточек ---
  const balanceCard = document.querySelector('.cards .card:nth-child(1) p');
  const topUpCard = document.querySelector('.cards .card:nth-child(2) p');
  const growthCard = document.querySelector('.cards .card:nth-child(3) p');

  // --- Элементы бокового списка и модалки ---
  const coinList = document.querySelector('.dashboard-right .coin-list');
  const allCoinsModal = document.getElementById('allCoinsModal');
  const showAllBtn = document.querySelector('.show-all-btn');
  const closeAllCoins = document.getElementById('closeAllCoins');
  const allCoinsList = document.getElementById('allCoinsList');

  if (!balanceCard || !topUpCard || !growthCard || !coinList || !allCoinsModal || !showAllBtn || !closeAllCoins || !allCoinsList) return;

  let allCoins = [];

  try {
    
    console.log(userWalletId);
    
    //--- Получаем данные по кошельку ---
    const walletRes = (await api.get(`/Crypto/wallets/${userWalletId}`)).data;
    const wallet = walletRes.data;

    //--- Обновляем карточки ---
    balanceCard.textContent = `$${wallet.statistic.totalAssets.toFixed(2)}`;
    topUpCard.textContent = `$${wallet.statistic.totalDeposit.toFixed(2)}`;
    growthCard.textContent = `${wallet.statistic.apy.toFixed(2)}%`;

    // --- Получаем список монет ---
    const coinsRes = await api.get('/Crypto/assets');
    //console.log(data);
    
    
    allCoins = coinsRes.data.data || [];

    console.log(allCoins);
    



    // --- Боковой список: максимум 5 монет ---
    coinList.innerHTML = '';
    allCoins.slice(0, 7).forEach(c => {
      const div = document.createElement('div');
      div.className = 'coin-item';
      div.innerHTML = `<img src="${c.logo}" alt="${c.symbol}"><span>${c.symbol} - $${c.marketData.currPrice.toFixed(2)}</span>`;
      coinList.appendChild(div);
    });

  } catch (err) {
    console.error('Ошибка загрузки Dashboard:', err);
    coinList.innerHTML = `<p>Не удалось загрузить данные</p>`;
  }

  // --- Открытие модалки со всеми монетами ---
  showAllBtn.addEventListener('click', () => {
    allCoinsList.innerHTML = '';
    allCoins.forEach(c => {
      const div = document.createElement('div');
      div.className = 'coin-item';
      div.innerHTML = `<img src="${c.logo}" alt="${c.symbol}"><span>${c.symbol} - $${c.marketData.currPrice}</span>`;
      allCoinsList.appendChild(div);
    });
    allCoinsModal.style.display = 'flex';
  });

  // --- Закрытие модалки ---
  closeAllCoins.addEventListener('click', () => {
    allCoinsModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === allCoinsModal) {
      allCoinsModal.style.display = 'none';
    }
  });
});





// /////////////////////////////////////////// Все монеты Модалка ///////////////////////////////////////////


/* ///////////////////////////////////////WALLET/////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////WALLET////////////////////////////////////////////////////////// */


document.addEventListener("DOMContentLoaded", async () => {
  const walletIdSpan = document.getElementById("walletId");
  const walletCardsContainer = document.getElementById("walletCards");
  const rechargeWalletBtn = document.getElementById("rechargeWallet");

  if (!walletIdSpan || !walletCardsContainer || !rechargeWalletBtn) return;

  let walletId = null;
  //const userWalletId = localStorage.getItem("walletId");

  

  async function loadWallet() {
    try {
      const walletResponse = (await api.get(`/Crypto/wallets/${userWalletId}`)).data;
      //const wallet = walletResponse.data;
      //walletId = wallet.id;

      walletIdSpan.textContent = walletResponse.data.walletId || "Не найден";

      const coinsResponse = (await api.get(`/Crypto/wallet-balances?walletId=${userWalletId}`)).data;
      const coins = coinsResponse.data || [];
      console.log(coins);
      

      walletCardsContainer.innerHTML = "";

      if (coins.length === 0) {
        walletCardsContainer.innerHTML = `<p class="no-coins">Монеты пока отсутствуют</p>`;
        return;
      }

      // Отрисовка карточек
      //Карточка без позиции кнопки
      // coins.forEach((coin) => {
      //   const card = document.createElement("div");
      //   card.classList.add("card");
      //   card.innerHTML = `
      //     <img src = "${coin.asset.logo}"></img>
      //     <p>${coin.amount} ${coin.asset.symbol}</p>
      //     <span>$${coin.asset.marketData.currPrice.toFixed(2)}</span>
      //     <button class="wallet-btn main" onclick="showCoinInfo('${coin.asset.symbol}')">Подробнее</button>
      //   `;
      //   walletCardsContainer.appendChild(card);
      // });

    //со позицией кнопки
    coins.forEach((coin) => {
  const card = document.createElement("div");
  card.classList.add("userCard");
  //card.style.position = "relative"; // чтобы позиционирование работало, если понадобится
  card.innerHTML = `
    <img src="${coin.asset.logo}" alt="${coin.asset.symbol}" style="display:block;margin:0 auto 10px auto;width:50px;height:50px;">
    <p style="text-align:center;">${coin.amount} ${coin.asset.symbol}</p>
    <span style="display:block;text-align:center;">$${coin.asset.marketData.currPrice.toFixed(2)}</span>

    <button 
      class="wallet-btn main" 
      onclick="showCoinInfo('${coin.asset.symbol}')"
      style="
        display: block;
        margin: 15px auto 0 auto;
        width: 80%;
        padding: 10px;
        background: linear-gradient(135deg, #6a11cb, #b91372);
        border: none;
        color: #fff;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        transition: 0.3s;
      "
    >
      Подробнее
    </button>
  `;
  walletCardsContainer.appendChild(card);
});

    } catch (error) {
      console.error("Ошибка при загрузке кошелька:", error);
      walletIdSpan.textContent = "Ошибка загрузки";
      walletCardsContainer.innerHTML = `<p class="no-coins">Не удалось загрузить данные</p>`;
    }
  }

  // --- Модалка пополнения ---
  const rechargeModal = document.createElement("div");
  rechargeModal.className = "modal-avatars";
  rechargeModal.innerHTML = `
    <div class="modal-avatars-content">
      <span class="close-avatars" id="closeRechargeModal">&times;</span>
      <h3>Пополнить кошелёк</h3>
      <p>Монета: USDT</p>
      <input type="number" id="rechargeAmount" placeholder="Сумма в USDT">
      <button id="confirmRecharge">Пополнить</button>
    </div>
  `;
  document.body.appendChild(rechargeModal);

  const closeRechargeModal = document.getElementById("closeRechargeModal");
  const rechargeAmount = document.getElementById("rechargeAmount");
  const confirmRecharge = document.getElementById("confirmRecharge");

  function openRechargeModal() {
    rechargeAmount.value = "";
    rechargeModal.style.display = "flex";
  }

  closeRechargeModal.addEventListener("click", () => {
    rechargeModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === rechargeModal) rechargeModal.style.display = "none";
  });

  confirmRecharge.addEventListener("click", async () => {
  const amount = parseFloat(rechargeAmount.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Введите корректную сумму");
    return;
  }

  // 🔒 Блокируем кнопку, чтобы нельзя было нажать повторно
  confirmRecharge.disabled = true;
  confirmRecharge.textContent = "Обработка...";

  try {
    const response = (await api.put(`/Crypto/deposit?walletId=${userWalletId}&amount=${amount}`)).data;

    if (response.status === 1) {
      alert("Пополнение успешно выполнено!");
      rechargeModal.style.display = "none";
      await loadWallet(); // обновляем кошелёк
    } else {
      alert(response.data?.message || "Ошибка при пополнении");
    }
  } catch (err) {
    console.error("Ошибка пополнения", err);
    alert("Ошибка сервера при пополнении");
  } finally {
    // 🔓 Возвращаем кнопку в исходное состояние
    confirmRecharge.disabled = false;
    confirmRecharge.textContent = "Пополнить";
  }
});

  rechargeWalletBtn.addEventListener("click", openRechargeModal);

  // Загружаем кошелёк при старте
  loadWallet();
});




// ---------- Exchange logic ----------
document.addEventListener('DOMContentLoaded', async () => {
  const fromSelect = document.getElementById('fromCoin');
  const toSearchInput = document.getElementById('toSearch');
  const dropdown = document.querySelector('.custom-select-dropdown');
  const amountInput = document.getElementById('amount');
  const exchangeBtn = document.getElementById('exchangeBtn');
  const resultEl = document.getElementById('exchangeResult');
  const usdtPriceSpan = document.getElementById('priceInUsdt');

  let userCoins = [];
  let marketCoins = [];
  let selectedToCoin = null;

  // --- инициализация ---
  async function initExchange() {
    try {
      const coinsRes = (await api.get(`/Crypto/wallet-balances?walletId=${userWalletId}`)).data;
      userCoins = coinsRes.data || [];

      const marketRes = (await api.get('/Crypto/assets')).data;
      marketCoins = marketRes.data || [];

      populateFromSelect();
    } catch (err) {
      console.error('Ошибка загрузки данных для обмена', err);
      resultEl.textContent = 'Ошибка загрузки данных обмена.';
    }
  }

  function populateFromSelect() {
    fromSelect.innerHTML = '';
    userCoins.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.asset.symbol;
      opt.textContent = `${c.asset.symbol} — ${c.amount.toFixed(6)}`;
      fromSelect.appendChild(opt);
    });
  }

  fromSelect.addEventListener('change', () => {
    const coin = userCoins.find(c => c.asset.symbol === fromSelect.value);
    usdtPriceSpan.textContent = coin ? coin.usdt.toFixed(6) + " USDT" : '';
    console.log(coin);
    
    if (coin) amountInput.placeholder = `Макс: ${coin.amount.toFixed(6)}`;
  });

  // --- поиск монеты ---
  toSearchInput.addEventListener('input', () => {
    const query = toSearchInput.value.trim().toLowerCase();
    dropdown.innerHTML = '';
    if (!query) {
      dropdown.style.display = 'none';
      return;
    }

    const filtered = marketCoins.filter(c =>
      c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)
    );

    filtered.forEach(c => {
      const div = document.createElement('div');
      div.className = 'option';
      div.innerHTML = `<span>${c.symbol} — ${c.name}</span>`;
      div.addEventListener('click', () => {
        selectedToCoin = c.symbol;
        toSearchInput.value = `${c.symbol} — ${c.name}`;
        dropdown.style.display = 'none';
      });
      dropdown.appendChild(div);
    });

    dropdown.style.display = filtered.length ? 'block' : 'none';
  });

  // клик вне input — закрывает dropdown
  window.addEventListener('click', (e) => {
    if (!toSearchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  // --- обмен ---
  exchangeBtn.addEventListener('click', async () => {
    const from = fromSelect.value;
    const to = selectedToCoin;
    const amount = parseFloat(amountInput.value);

    if (!from || !to || isNaN(amount) || amount <= 0) {
      resultEl.textContent = 'Введите корректное количество и выберите монету.';
      return;
    }

    if (from === to) {
      resultEl.textContent = 'Выберите разные монеты.';
      return;
    }

    const fromCoin = userCoins.find(c => c.asset.symbol === from);
    if (!fromCoin) {
      resultEl.textContent = 'У вас нет такой монеты.';
      return;
    }

    if (amount > fromCoin.amount) {
      resultEl.textContent = 'Недостаточно средств.';
      return;
    }

    try {
      exchangeBtn.disabled = true;
      resultEl.textContent = 'Обмен выполняется...';

      const response = (await api.post(`/Crypto/exchange?walletId=${userWalletId}&fromAssetSymbol=${from}&toAssetSymbol=${to}&amount=${amount}`)).data;

      if (response.data && response.status === 1) {
        resultEl.style.color = '#b3ffb3';
        resultEl.textContent = response.data.message || 'Обмен успешно выполнен.';

        const coinsRes = (await api.get(`/Crypto/wallet-balances?walletId=${userWalletId}`)).data;
        userCoins = coinsRes.data || [];
        populateFromSelect();
        amountInput.value = '';
        amountInput.placeholder = '';
        toSearchInput.value = '';
        selectedToCoin = null;
      } else {
        resultEl.style.color = '#ffb3b3';
        resultEl.textContent = response.data.message || 'Ошибка при обмене.';
      }
    } catch (err) {
      console.error('Ошибка обмена', err);
      resultEl.style.color = '#ffb3b3';
      resultEl.textContent = err.response?.data?.message || 'Ошибка запроса.';
    } finally {
      exchangeBtn.disabled = false;
    }
  });

  initExchange();
});



// Поиск

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.querySelector('.header .search input');

  // Создаём контейнер для результатов под полем поиска
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  searchInput.parentElement.appendChild(searchResults);

  // Модалка для инфы о монете
  const coinInfoModal = document.createElement('div');
  coinInfoModal.className = 'modal-coin-info';
  coinInfoModal.id = 'coinInfoModal';
  coinInfoModal.innerHTML = `
    <div class="modal-coin-info-content">
      <span class="close-coin-info" id="closeCoinInfo">&times;</span>
      <div id="coinInfoContent"></div>
    </div>
  `;
  document.body.appendChild(coinInfoModal);

  const coinInfoContent = document.getElementById('coinInfoContent');
  const closeCoinInfo = document.getElementById('closeCoinInfo');

  let allCoins = [];

  try {
    // Получаем все монеты
    const coinsRes = await api.get('/Crypto/assets');
    allCoins = coinsRes.data.data || [];
  } catch (err) {
    console.error('Ошибка загрузки монет для поиска:', err);
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!query) return;

    const filtered = allCoins.filter(c =>
      c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)
    );

    filtered.forEach(c => {
      const div = document.createElement('div');
      div.textContent = `${c.symbol} - ${c.name}`;
      div.addEventListener('click', () => showCoinInfo(c.symbol));
      searchResults.appendChild(div);
    });
  });

 window.showCoinInfo = async function(symbol) {
    try {
      // const walletRes = await api.get('/wallet');
      // const walletId = walletRes.data.id;

      // const coinsRes = await api.get(`/wallet/${walletId}/coins`);
      // const userCoins = coinsRes.data || [];

      const marketCoin = allCoins.find(c => c.symbol === symbol);
      console.log(marketCoin);
      console.log(marketCoin.price);
      console.log(marketCoin.iconUrl);
      
      
      
      //const userCoin = userCoins.find(c => c.symbol === symbol);

      console.log(marketCoin.currPrice);
      

coinInfoContent.innerHTML = `
  <img src="${marketCoin.logo}" alt="${marketCoin.symbol}" style="width:50px;height:50px;">
  <h3>${marketCoin.name} (${marketCoin.symbol})</h3>
  <p><strong>Цена:</strong> $${marketCoin.marketData?.currPrice ?? '—'}</p>
  <hr style="margin: 10px 0;">
  <div style="display: flex; flex-direction: column; gap: 4px;">
    <p>Изменение за 1 час: <span style="color:${marketCoin.marketData?.percentChange1h >= 0 ? 'limegreen' : 'red'};">
      ${marketCoin.marketData?.percentChange1h ?? '—'}%
    </span></p>
    <p>Изменение за 24 часа: <span style="color:${marketCoin.marketData?.percentChange24h >= 0 ? 'limegreen' : 'red'};">
      ${marketCoin.marketData?.percentChange24h ?? '—'}%
    </span></p>
    <p>Изменение за 7 дней: <span style="color:${marketCoin.marketData?.percentChange7d >= 0 ? 'limegreen' : 'red'};">
      ${marketCoin.marketData?.percentChange7d ?? '—'}%
    </span></p>
    <p>Изменение за 30 дней: <span style="color:${marketCoin.marketData?.percentChange30d >= 0 ? 'limegreen' : 'red'};">
      ${marketCoin.marketData?.percentChange30d ?? '—'}%
    </span></p>
    <p>Изменение за 60 дней: <span style="color:${marketCoin.marketData?.percentChange60d >= 0 ? 'limegreen' : 'red'};">
      ${marketCoin.marketData?.percentChange60d ?? '—'}%
    </span></p>
  </div>
`;


      coinInfoModal.style.display = 'flex';
      searchResults.innerHTML = '';
      searchInput.value = '';
    } catch (err) {
      console.error('Ошибка загрузки инфы о монете:', err);
      alert('Не удалось загрузить данные о монете.');
    }
  }

  // Закрытие модалки
  closeCoinInfo.addEventListener('click', () => {
    coinInfoModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === coinInfoModal) coinInfoModal.style.display = 'none';
  });
});


///////////////////////////// ГРАФИК  ///////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
  const graphSelect = document.getElementById('graphSelect');
  const graphPlaceholder = document.querySelector('.graph-placeholder');

  let grapSelectCoin = [];

  // ----------------------------------------------------------------------
  // 1. ЗАГРУЖАЕМ МОНЕТЫ И ЗАПОЛНЯЕМ СЕЛЕКТ
  // ----------------------------------------------------------------------
  try {
    const coinsRes = await api.get('/Crypto/assets');
    grapSelectCoin = coinsRes.data.data || [];

    grapSelectCoin.forEach(coin => {
      const option = document.createElement('option');
      // используем id, если он есть (CoinGecko принимает ID)
      option.value = (coin.id || coin.name).toLowerCase().replace(/\s+/g, '-');
      option.textContent = coin.name;
      graphSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Ошибка загрузки монет для поиска:', err);
    graphPlaceholder.textContent = 'Ошибка загрузки списка монет.';
    return;
  }

  // ----------------------------------------------------------------------
  // 2. ОБРАБОТКА ДАННЫХ С API COINGECKO
  // ----------------------------------------------------------------------
  function processAPIData(data) {
    const dates = [];
    const prices = [];

    if (data && data.prices) {
      data.prices.forEach(item => {
        dates.push(new Date(item[0]));
        prices.push(item[1]);
      });
    } else {
      console.error("Массив 'prices' не найден в данных API.");
    }

    return { dates, prices };
  }

  // ----------------------------------------------------------------------
  // 3. ЗАГРУЗКА И ОТОБРАЖЕНИЕ ГРАФИКА
  // ----------------------------------------------------------------------
  async function loadGraph(cryptoId) {
    // graphPlaceholder.textContent = `Загрузка графика для ${cryptoId}...`;

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: 7
          }
        }
      );

      const { dates, prices } = processAPIData(response.data);

      console.log(dates, prices);
      

      if (dates.length === 0) {
        graphPlaceholder.textContent = `Нет данных для ${cryptoId}`;
        return;
      }

      const minPrice = Math.min(...prices) * 0.99;
      const maxPrice = Math.max(...prices) * 1.01;
      const lastDate = dates[dates.length - 1];

      const traceLine = {
        x: dates,
        y: prices,
        mode: 'lines',
        type: 'scatter',
        name: cryptoId,
        line: { color: '#ff0099', width: 1.5 },
        fill: 'tozeroy',
        fillcolor: 'rgba(255, 0, 153, 0.15)',
        hoverinfo: 'skip',
      };

      const hoverTrace = {
        x: dates,
        y: prices,
        mode: 'markers',
        showlegend: false,
        name: '',
        marker: { size: 0, color: 'transparent' },
        hoverinfo: 'all',
        hovertemplate: '<b>Цена:</b> $%{y:,.2f}<extra></extra>',
      };

      const data = [traceLine, hoverTrace];

      const layout = {
        title: false,
        autosize: true,
        height: 600,
        width: 820,
        margin: { t: 20, r: 55, b: 40, l: 20 },
        showlegend: false,
        plot_bgcolor:  'rgba(26,26,26,0.85)',
        paper_bgcolor: 'rgba(26,26,26,0.85)',
        font: { color: '#d8b4fe' },
        hovermode: 'x unified',
        hoverlabel: {
          bgcolor: 'white',
          bordercolor: '#1A122A',
          font: { color: '#1A122A' },
          namelength: 0
        },
        xaxis: {
          rangeslider: { visible: false },
          tickformat: '%d %b\n%H:%M',
          title: false,
          gridcolor: 'rgba(150,0,255,0.2)',
          linecolor: 'rgba(150,0,255,0.4)',
          zerolinecolor: 'rgba(150,0,255,0.4)',
          fixedrange: true,
          range: [dates[0], new Date(lastDate.getTime() + 24*60*60*1000)],
          showspikes: true,
          spikedash: 'dot',
          spikecolor: 'white',
          spikethickness: 1,
          spikesnap: 'cursor',
        },
        yaxis: {
          dtick: (maxPrice - minPrice) / 6,
          range: [minPrice, maxPrice],
          side: 'right',
          tickformat: ',.0f',
          fixedrange: true,
          gridcolor: 'rgba(150,0,255,0.2)',
          linecolor: 'rgba(150,0,255,0.4)',
          zerolinecolor: 'rgba(150,0,255,0.4)',
          showspikes: true,
          spikedash: 'dot',
          spikecolor: 'white',
          spikethickness: 1,
          spikesnap: 'cursor',
          showspike1D: true,
          spikemode: 'across'
        },
      };

      // Рисуем график
      Plotly.newPlot('chart-container', data, layout, {
        responsive: true,
        displayModeBar: false
      });

      graphPlaceholder.textContent = `График для ${cryptoId} загружен`;

    } catch (err) {
      console.error('Ошибка загрузки графика:', err);
      //graphPlaceholder.textContent = `Не удалось загрузить график для ${cryptoId}`;
    }
  }

  // ----------------------------------------------------------------------
  // 4. ОБНОВЛЕНИЕ ГРАФИКА ПРИ ВЫБОРЕ ИЗ СЕЛЕКТА
  // ----------------------------------------------------------------------
  graphSelect.addEventListener('change', e => {
    const selectedCoin = e.target.value;
    if (selectedCoin) loadGraph(selectedCoin);
  });

  // ----------------------------------------------------------------------
  // 5. ЗАГРУЖАЕМ ГРАФИК ПЕРВОЙ МОНЕТЫ ПО УМОЛЧАНИЮ
  // ----------------------------------------------------------------------
  if (grapSelectCoin.length > 0) {
    loadGraph(graphSelect.options[0].value);
  }
});


