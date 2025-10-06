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


// Закоментить для теста(Проверка токена, для запрета перехода на другие страницы)
// if (!localStorage.getItem("token") && !window.location.pathname.endsWith("index.html")) {
//   window.location.href = "index.html";
// }

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

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;  // РАСКОМЕНТИТЬ ЛОГИН!!!!

    try {
      const response = await api.post("/auth/login", {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", response.data.token); // сохраним JWT токен
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
    // --- Получаем данные по кошельку ---
    const walletRes = await api.get('/wallet');
    const wallet = walletRes.data;

    // --- Обновляем карточки ---
    balanceCard.textContent = `$${wallet.balance.toFixed(2)}`;
    topUpCard.textContent = `$${wallet.totalTopUp.toFixed(2)}`;
    growthCard.textContent = `${wallet.balanceGrowth.toFixed(2)}%`;

    // --- Получаем список монет ---
    const coinsRes = await api.get(`/wallet/${wallet.id}/coins`);
    allCoins = coinsRes.data || [];

    // --- Боковой список: максимум 5 монет ---
    coinList.innerHTML = '';
    allCoins.slice(0, 5).forEach(c => {
      const div = document.createElement('div');
      div.className = 'coin-item';
      div.innerHTML = `<img src="${c.iconUrl}" alt="${c.symbol}"><span>${c.symbol} - $${c.usdtValue.toFixed(2)}</span>`;
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
      div.innerHTML = `<img src="${c.iconUrl}" alt="${c.symbol}"><span>${c.symbol} - $${c.usdtValue.toFixed(2)}</span>`;
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

  if (!walletIdSpan || !walletCardsContainer) return; // значит, не на wallet.html

  try {
    // 1️ Получаем кошелёк пользователя
    const walletResponse = await api.get("/wallet");
    const wallet = walletResponse.data;

    walletIdSpan.textContent = wallet.id || "Не найден";

    // 2️ Получаем список монет пользователя
    const coinsResponse = await api.get(`/wallet/${wallet.id}/coins`);
    const coins = coinsResponse.data || [];

    // 3️ Если монет нет
    if (coins.length === 0) {
      walletCardsContainer.innerHTML = `<p class="no-coins">Монеты пока отсутствуют</p>`;
      return;
    }

    // 4️ Отрисовка карточек
    walletCardsContainer.innerHTML = "";
    coins.forEach((coin) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${coin.symbol}</h3>
        <p>${coin.amount} ${coin.symbol}</p>
        <span>$${coin.usdtValue.toFixed(2)}</span>
        <div class="wallet-buttons">
          <button class="wallet-btn">Пополнить</button>
          <button class="wallet-btn">Вывести</button>
        </div>
      `;
      walletCardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка при загрузке кошелька:", error);
    walletIdSpan.textContent = "Ошибка загрузки";
    walletCardsContainer.innerHTML = `<p class="no-coins">Не удалось загрузить данные</p>`;
  }
});



// ---------- Exchange logic ----------
document.addEventListener('DOMContentLoaded', () => {
  const fromSelect = document.getElementById('fromCoin');
  const toSelect = document.getElementById('toCoin');
  const amountInput = document.getElementById('amount');
  const exchangeBtn = document.getElementById('exchangeBtn');
  const resultEl = document.getElementById('exchangeResult');

  if (!fromSelect || !toSelect || !exchangeBtn) return; // не на странице exchange

  let walletId = null;
  let userCoins = [];
  let marketCoins = [];

  async function initExchange() {
    try {
      const walletRes = await api.get('/wallet');
      walletId = walletRes.data.id;

      // монеты пользователя
      const coinsRes = await api.get(`/wallet/${walletId}/coins`);
      userCoins = coinsRes.data || [];

      // все монеты (в которые можно обменять)
      const marketRes = await api.get('/coins');
      marketCoins = marketRes.data || [];

      populateSelects();
    } catch (err) {
      console.error('Ошибка загрузки данных для обмена', err);
      resultEl.textContent = 'Ошибка загрузки данных обмена.';
    }
  }

  function populateSelects() {
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    // заполняем монеты пользователя
    userCoins.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.symbol;
      opt.textContent = `${c.symbol} — ${c.amount.toFixed(6)}`;
      fromSelect.appendChild(opt);
    });

    // заполняем все доступные монеты для обмена
    marketCoins.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.symbol;
      opt.textContent = c.symbol;
      toSelect.appendChild(opt);
    });
  }

  // при изменении монеты — обновляем placeholder
  fromSelect.addEventListener('change', () => {
    const coin = userCoins.find(c => c.symbol === fromSelect.value);
    if (coin) {
      amountInput.placeholder = `Макс: ${coin.amount.toFixed(6)}`;
    }
  });

  // обработка нажатия на кнопку "Обменять"
  exchangeBtn.addEventListener('click', async () => {
    const from = fromSelect.value;
    const to = toSelect.value;
    const amount = parseFloat(amountInput.value);

    if (!from || !to || isNaN(amount) || amount <= 0) {
      resultEl.textContent = 'Введите корректное количество.';
      return;
    }

    if (from === to) {
      resultEl.textContent = 'Выберите разные монеты.';
      return;
    }

    const fromCoin = userCoins.find(c => c.symbol === from);
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

      // запрос к API
      const response = await api.post('/exchange', {
        walletId,
        from,
        to,
        amount
      });

      if (response.data && response.data.success) {
        resultEl.style.color = '#b3ffb3';
        resultEl.textContent = response.data.message || 'Обмен успешно выполнен.';

        // перезагружаем данные кошелька
        const coinsRes = await api.get(`/wallet/${walletId}/coins`);
        userCoins = coinsRes.data || [];
        populateSelects();
        amountInput.value = '';
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
    const coinsRes = await api.get('/coins');
    allCoins = coinsRes.data || [];
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

  async function showCoinInfo(symbol) {
    try {
      const walletRes = await api.get('/wallet');
      const walletId = walletRes.data.id;

      const coinsRes = await api.get(`/wallet/${walletId}/coins`);
      const userCoins = coinsRes.data || [];

      const marketCoin = allCoins.find(c => c.symbol === symbol);
      const userCoin = userCoins.find(c => c.symbol === symbol);

      coinInfoContent.innerHTML = `
        <img src="${marketCoin.iconUrl}" alt="${marketCoin.symbol}" style="width:50px;height:50px;">
        <h3>${marketCoin.name} (${marketCoin.symbol})</h3>
        <p>Цена: $${marketCoin.price.toFixed(2)}</p>
        <p>На балансе: ${userCoin ? userCoin.amount : 0} ${symbol}</p>
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
