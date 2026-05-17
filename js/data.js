const GROUP_COUNT = 8;

/** 두레 명칭 */
const GROUP_NAMES = {
  1: "(가) 두레",
  2: "(나) 두레",
  3: "(다) 두레",
  4: "(라) 두레",
  5: "(마) 두레",
  6: "(바) 두레",
  7: "(사) 두레",
  8: "(아) 두레",
};

/** 그룹별 교실 내 위치 (칠판 = 12시 방향) */
const GROUP_POSITIONS = {
  1: "상단 좌측",
  2: "상단 우측",
  3: "중상 좌측",
  4: "중상 우측",
  5: "중하 좌측",
  6: "중하 우측",
  7: "하단 좌측",
  8: "하단 우측",
};

/** 조 내 자리 설명 (칠판 쪽이 앞, 3-2 배치) */
const SEAT_LABELS = {
  1: "1행 왼쪽",
  2: "1행 가운데",
  3: "1행 오른쪽",
  4: "2행 왼쪽",
  5: "2행 오른쪽",
  6: "2행 가운데",
};

/** 목업 데이터: 8두레 · 총 38명 */
const STUDENTS = [
  { name: "이기옥", group: 1, seat: 1 },
  { name: "이은종", group: 1, seat: 2 },
  { name: "신미연", group: 1, seat: 3 },
  { name: "조이훈", group: 1, seat: 4 },
  { name: "정다솜", group: 1, seat: 5 },

  { name: "최서연", group: 2, seat: 1 },
  { name: "김수영", group: 2, seat: 2 },
  { name: "이윤주", group: 2, seat: 3 },
  { name: "김동미", group: 2, seat: 4 },
  { name: "이대훈", group: 2, seat: 5 },

  { name: "신기원", group: 3, seat: 1 },
  { name: "김종우", group: 3, seat: 2 },
  { name: "고현승", group: 3, seat: 3 },
  { name: "정진우", group: 3, seat: 4 },
  { name: "김소영", group: 3, seat: 5 },

  { name: "서광", group: 4, seat: 1 },
  { name: "김병철", group: 4, seat: 2 },
  { name: "백예람", group: 4, seat: 3 },
  { name: "구동회", group: 4, seat: 4 },
  { name: "(중등) 이현주", group: 4, seat: 5 },

  { name: "이명화", group: 5, seat: 1 },
  { name: "박정식", group: 5, seat: 2 },
  { name: "손승현", group: 5, seat: 3 },
  { name: "변영애", group: 5, seat: 4 },
  { name: "송은혜", group: 5, seat: 5 },

  { name: "김대철", group: 6, seat: 1 },
  { name: "정명화", group: 6, seat: 2 },
  { name: "진기정", group: 6, seat: 3 },
  { name: "김지은", group: 6, seat: 4 },

  { name: "우승희", group: 7, seat: 1 },
  { name: "임은비", group: 7, seat: 2 },
  { name: "(초등) 이현주", group: 7, seat: 3 },
  { name: "김백수", group: 7, seat: 4 },

  { name: "전소민", group: 8, seat: 1 },
  { name: "이승재", group: 8, seat: 2 },
  { name: "김요한", group: 8, seat: 3 },
  { name: "김영진", group: 8, seat: 4 },
  { name: "임미리", group: 8, seat: 5 },
];
