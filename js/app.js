const groupsGrid = document.getElementById("groups-grid");
const legendList = document.getElementById("legend-list");
const nameInput = document.getElementById("name-input");
const searchBtn = document.getElementById("search-btn");
const resultMessage = document.getElementById("result-message");
const nameSuggestions = document.getElementById("name-suggestions");

const byGroup = STUDENTS.reduce((acc, student) => {
  if (!acc[student.group]) acc[student.group] = [];
  acc[student.group].push(student);
  return acc;
}, {});

for (let g = 1; g <= GROUP_COUNT; g += 1) {
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
  deskEl?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showResult(student) {
  if (!student) {
    const q = nameInput.value.trim();
    const partial = STUDENTS.filter((s) => s.name.includes(q));
    if (partial.length > 1) {
      resultMessage.textContent = `여러 명이 검색되었습니다. 전체 이름을 입력해 주세요. (예: ${partial.map((s) => s.name).join(", ")})`;
    } else {
      resultMessage.textContent =
        "해당 이름을 찾을 수 없습니다. 전체 이름을 입력하거나 일부만 입력해 보세요.";
    }
    resultMessage.className = "result-message error";
    clearHighlights();
    return;
  }
  resultMessage.textContent = `${student.name}님 → ${formatLocation(student)}`;
  resultMessage.className = "result-message success";
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

renderClassroom();
renderLegend();
setupSuggestions();

searchBtn.addEventListener("click", search);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});
