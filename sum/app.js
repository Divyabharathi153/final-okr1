let currentUser = null;

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // For demo purposes: hardcoded user
  if (username === "admin" && password === "admin") {
    currentUser = { username: "admin", team: "Team A" };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showApp();
  } else {
    alert("Invalid credentials");
  }
}

function showApp() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-name').textContent = currentUser.username;
  renderOKRs();
}

function createOKR() {
  const title = document.getElementById('okr-title').value;
  const description = document.getElementById('okr-desc').value;

  if (!title || !description) {
    alert("Please enter title and description");
    return;
  }

  const okrs = JSON.parse(localStorage.getItem('okrs') || '[]');

  const newOKR = {
    id: Date.now(),
    title,
    description,
    assignedTo: currentUser.username,
    team: currentUser.team
  };

  okrs.push(newOKR);
  localStorage.setItem('okrs', JSON.stringify(okrs));

  renderOKRs();
}

function renderOKRs() {
  const okrs = JSON.parse(localStorage.getItem('okrs') || '[]');
  const list = document.getElementById('okr-list');
  list.innerHTML = '';

  okrs
    .filter(okr => okr.team === currentUser.team)
    .forEach(okr => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${okr.title}</strong> - ${okr.description}
        <br><small>Assigned to: ${okr.assignedTo}</small>
        <br>
        <button onclick="editOKR(${okr.id})">Edit</button>
        <button onclick="deleteOKR(${okr.id})">Delete</button>
      `;
      list.appendChild(li);
    });
}

function editOKR(id) {
  const okrs = JSON.parse(localStorage.getItem('okrs') || '[]');
  const okr = okrs.find(o => o.id === id);
  const title = prompt("Edit OKR Title", okr.title);
  const description = prompt("Edit OKR Description", okr.description);

  if (title && description) {
    okr.title = title;
    okr.description = description;
    localStorage.setItem('okrs', JSON.stringify(okrs));
    renderOKRs();
  }
}

function deleteOKR(id) {
  let okrs = JSON.parse(localStorage.getItem('okrs') || '[]');
  okrs = okrs.filter(o => o.id !== id);
  localStorage.setItem('okrs', JSON.stringify(okrs));
  renderOKRs();
}

// Auto-login if user in localStorage
if (localStorage.getItem("currentUser")) {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  showApp();
}
