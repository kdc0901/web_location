const groupsGrid = document.getElementById("groups-grid");
const legendList = document.getElementById("legend-list");
const nameInput = document.getElementById("name-input");
const searchBtn = document.getElementById("search-btn");
const resultCard = document.getElementById("result-card");
const resultHint = document.querySelector(".result-card__hint");
const resultBody = document.querySelector(".result-card__body");
const resultMiniMap = document.getElementById("result-mini-map");
const resultStudentName = document.getElementById("result-student-name");
const resultGroupName = document.getElementById("result-group-name");
const resultGroupPosition = document.getElementById("result-group-position");
const resultGroupDesks = document.getElementById("result-group-desks");
const nameSuggestions = document.getElementById("name-suggestions");

/** 전체 배치도 미니맵: 칠판 아래 3×3 (8두레) */
const MINI_MAP_ROWS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, null],
];

const byGroup = STUDENTS.reduce((acc, student) => {
  if (!acc[student.group]) acc[student.group] = [];
  acc[student.group].push(student);
  return acc;
}, {});

for (let g = 1; g <= GROUP_COUNT; g += 1) {
  if (!byGroup[g]) byGroup[g] = [];
  byGroup[g].sort((a, b) => a.seat - b.seat);
}

function findStudent(query) {
  const q = query.trim();
  if (!q) return null;

  const exact = STUDENTS.find((s) => s.name === q);
  if (exact) return exact;

  const matches = STUDENTS.filter(
    (s) => s.name.includes(q) || s.name.replace(/[()]/g, "").includes(q)
  );
  if (matches.length === 1) return matches[0];
  return null;
}

function getSeatLabel(student) {
  const count = byGroup[student.group].length;
  if (count > 5 && student.seat === 5) return "2행 가운데";
  if (count > 5 && student.seat === 6) return "2행 오른쪽";
  return SEAT_LABELS[student.seat];
}

function formatLocation(student) {
  const groupName = GROUP_NAMES[student.group];
  const pos = GROUP_POSITIONS[student.group];
  return `${groupName} (${pos}) · ${student.seat}번 자리 (${getSeatLabel(student)})`;
}

function clearHighlights() {
  document.querySelectorAll(".highlighted").forEach((el) => {
    el.classList.remove("highlighted");
  });
}

function highlightSeat(student) {
  clearHighlights();
  document
    .querySelector(`.group[data-group="${student.group}"]`)
    ?.classList.add("highlighted");
  const deskEl = document.querySelector(
    `.desk[data-group="${student.group}"][data-seat="${student.seat}"]`
  );
  deskEl?.classList.add("highlighted");
  setTimeout(() => {
    deskEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}

function buildMiniMap() {
  if (!resultMiniMap || resultMiniMap.childElementCount > 0) return;

  const board = document.createElement("div");
  board.className = "mini-map__board";
  board.setAttribute("aria-hidden", "true");
  resultMiniMap.appendChild(board);

  const grid = document.createElement("div");
  grid.className = "mini-map__grid";
  MINI_MAP_ROWS.forEach((row) => {
    row.forEach((groupNum) => {
      const cell = document.createElement("div");
      if (groupNum === null) {
        cell.className = "mini-map__cell mini-map__cell--empty";
      } else {
        cell.className = "mini-map__cell";
        cell.dataset.group = String(groupNum);
      }
      grid.appendChild(cell);
    });
  });
  resultMiniMap.appendChild(grid);
}

function setMiniMapActive(groupNum) {
  if (!resultMiniMap) return;
  resultMiniMap.querySelectorAll(".mini-map__cell[data-group]").forEach((cell) => {
    cell.classList.toggle(
      "mini-map__cell--active",
      cell.dataset.group === String(groupNum)
    );
  });
}

function renderGroupDesks(groupNum, highlightSeatNum) {
  const students = byGroup[groupNum];
  const wrap = document.createElement("div");
  wrap.className = "desks";

  wrap.appendChild(createDeskRow(students.slice(0, 3), "desk-row desk-row--top"));

  const bottom = students.slice(3);
  let bottomClass = "desk-row desk-row--bottom";
  if (bottom.length === 1) bottomClass += " desk-row--single";
  else if (bottom.length === 2) bottomClass += " desk-row--pair";
  wrap.appendChild(createDeskRow(bottom, bottomClass));

  if (highlightSeatNum != null) {
    wrap
      .querySelector(`.desk[data-seat="${highlightSeatNum}"]`)
      ?.classList.add("highlighted");
  }

  return wrap;
}

function renderResultDetail(student) {
  buildMiniMap();
  setMiniMapActive(student.group);

  if (resultStudentName) {
    resultStudentName.textContent = student.name;
  }
  if (resultGroupName) {
    resultGroupName.textContent = GROUP_NAMES[student.group];
  }
  if (resultGroupPosition) {
    resultGroupPosition.textContent = GROUP_POSITIONS[student.group];
  }
  if (resultGroupDesks) {
    resultGroupDesks.replaceChildren();
    resultGroupDesks.dataset.group = String(student.group);
    resultGroupDesks.appendChild(
      renderGroupDesks(student.group, student.seat)
    );
  }
}

function setResultCard(state, { student = null, error = "" } = {}) {
  resultCard.className = `result-card result-card--${state}`;
  if (state === "success" && student) {
    resultCard.hidden = false;
    resultHint.hidden = true;
    resultBody.hidden = false;
    renderResultDetail(student);
  } else if (state === "error") {
    resultCard.hidden = false;
    resultHint.hidden = false;
    resultHint.textContent = error;
    resultBody.hidden = true;
  } else {
    resultCard.hidden = true;
    resultHint.textContent = "";
    resultBody.hidden = true;
  }
}

function showResult(student) {
  if (!student) {
    const q = nameInput.value.trim();
    if (!q) {
      setResultCard("idle");
      clearHighlights();
      return;
    }
    const partial = STUDENTS.filter((s) => s.name.includes(q));
    if (partial.length > 1) {
      setResultCard("error", {
        error: `여러 명이 검색되었습니다. 전체 이름을 입력해 주세요. (예: ${partial.map((s) => s.name).join(", ")})`,
      });
    } else {
      setResultCard("error", {
        error:
          "해당 이름을 찾을 수 없습니다. 전체 이름을 입력하거나 일부만 입력해 보세요.",
      });
    }
    clearHighlights();
    return;
  }

  setResultCard("success", { student });
  highlightSeat(student);
}

function renderDesk(student) {
  const desk = document.createElement("div");
  desk.className = "desk";
  desk.dataset.group = String(student.group);
  desk.dataset.seat = String(student.seat);
  desk.innerHTML = `
    <span class="seat-num">${student.seat}</span>
    <span class="student-name">${student.name}</span>
  `.trim();
  desk.title = `${student.name} · ${formatLocation(student)}`;
  return desk;
}

function createDeskRow(studentList, rowClass) {
  const row = document.createElement("div");
  row.className = rowClass;
  studentList.forEach((s) => row.appendChild(renderDesk(s)));
  return row;
}

function renderGroup(groupNum) {
  const students = byGroup[groupNum];

  const section = document.createElement("section");
  section.className =
    students.length > 5 ? "group group--wide" : "group";
  section.dataset.group = String(groupNum);

  const header = document.createElement("div");
  header.className = "group-header";
  header.innerHTML = `
    <strong>${GROUP_NAMES[groupNum]}</strong>
    <span>${GROUP_POSITIONS[groupNum]}</span>
  `;
  section.appendChild(header);

  const desksWrap = document.createElement("div");
  desksWrap.className = "desks";

  desksWrap.appendChild(createDeskRow(students.slice(0, 3), "desk-row desk-row--top"));

  const bottom = students.slice(3);
  let bottomClass = "desk-row desk-row--bottom";
  if (bottom.length === 1) bottomClass += " desk-row--single";
  else if (bottom.length === 2) bottomClass += " desk-row--pair";
  desksWrap.appendChild(createDeskRow(bottom, bottomClass));

  section.appendChild(desksWrap);
  return section;
}

function renderClassroom() {
  if (!groupsGrid) {
    console.error("groups-grid 요소를 찾을 수 없습니다.");
    return;
  }
  groupsGrid.replaceChildren();
  for (let g = 1; g <= GROUP_COUNT; g += 1) {
    groupsGrid.appendChild(renderGroup(g));
  }
}

function renderLegend() {
  for (let g = 1; g <= GROUP_COUNT; g += 1) {
    const li = document.createElement("li");
    const count = byGroup[g].length;
    li.innerHTML = `<strong>${GROUP_NAMES[g]}</strong> ${GROUP_POSITIONS[g]} <span class="count">(${count}명)</span>`;
    legendList.appendChild(li);
  }
}

function setupSuggestions() {
  STUDENTS.forEach(({ name }) => {
    const opt = document.createElement("option");
    opt.value = name;
    nameSuggestions.appendChild(opt);
  });
}

function search() {
  showResult(findStudent(nameInput.value));
}

function initApp() {
  renderClassroom();
  renderLegend();
  setupSuggestions();
  buildMiniMap();
  setResultCard("idle");

  searchBtn?.addEventListener("click", search);
  nameInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
