// 최근 SNS(틱톡·인스타·커뮤니티)에서 자주 화제가 된 밸런스 게임 주제 모음
const CATEGORIES = [
  { id: "love", name: "연애·썸", emoji: "💘" },
  { id: "food", name: "음식", emoji: "🍗" },
  { id: "extreme", name: "마라맛 극한선택", emoji: "🌶️" },
  { id: "life", name: "갓생·일상", emoji: "🌱" },
  { id: "money", name: "돈·직장", emoji: "💸" },
  { id: "digital", name: "디지털·SNS", emoji: "📱" },
];

// 선택지마다 붙는 성향 태그. 게임이 끝나면 가장 많이 고른 성향으로
// "당신은 이런 타입!" 결과를 보여주는 데 쓰인다.
// adventure(모험형) / stability(안정형) / emotion(감성형)
// logic(이성형) / freedom(자유형) / hustle(노력형)
const TYPES = {
  adventure: {
    key: "adventure",
    name: "모험형",
    emoji: "🎢",
    title: "짜릿함 없인 못 사는 모험가",
    desc: "안정보다는 스릴! 새로운 자극과 변화를 즐기는 당신은 어디서든 이야깃거리를 몰고 다니는 타입이에요.",
  },
  stability: {
    key: "stability",
    name: "안정형",
    emoji: "🛋️",
    title: "평온한 하루가 최고의 하루",
    desc: "예측 가능한 편안함을 사랑하는 당신. 무리한 도전보다 꾸준하고 안정적인 루틴에서 행복을 찾아요.",
  },
  emotion: {
    key: "emotion",
    name: "감성형",
    emoji: "💗",
    title: "마음 가는 대로, 감성 충만 로맨티스트",
    desc: "논리보다 마음이 먼저 움직이는 당신. 분위기와 감정, 관계의 온도를 무엇보다 중요하게 여겨요.",
  },
  logic: {
    key: "logic",
    name: "이성형",
    emoji: "🧮",
    title: "손해는 절대 못 참지, 계산 빠른 현실주의자",
    desc: "효율과 실속을 최우선으로 따지는 당신. 감정에 휘둘리기보다 합리적인 선택을 하는 타입이에요.",
  },
  freedom: {
    key: "freedom",
    name: "자유형",
    emoji: "🕊️",
    title: "규칙 따위 NO, 자유로운 영혼",
    desc: "얽매이는 걸 세상에서 제일 싫어하는 당신. 내 페이스, 내 방식대로 사는 게 최고의 행복이에요.",
  },
  hustle: {
    key: "hustle",
    name: "노력형",
    emoji: "🔥",
    title: "갓생 그 자체, 노력형 인간",
    desc: "가만히 있는 걸 못 견디는 당신. 목표를 위해서라면 오늘의 편함쯤은 기꺼이 포기하는 타입이에요.",
  },
};

const QUESTIONS = [
  // 연애·썸
  { id: "love-1", cat: "love", a: "매일 연락하지만 만남은 한 달에 1번", b: "연락은 뜸하지만 매주 만나는 썸", ea: "💬", eb: "📅", ta: "emotion", tb: "freedom" },
  { id: "love-2", cat: "love", a: "내 메시지 안 읽고 3시간째 잠수 탄 썸", b: "읽씹인데 5초마다 눈에 밟히는 썸", ea: "😴", eb: "👀", ta: "freedom", tb: "emotion" },
  { id: "love-3", cat: "love", a: "완전 내 이상형인데 대화가 안 통함", b: "이상형은 아닌데 대화가 미친듯 잘 통함", ea: "😍", eb: "🗣️", ta: "emotion", tb: "logic" },
  { id: "love-4", cat: "love", a: "기념일 못 챙기지만 매일 다정한 애인", b: "평소엔 무뚝뚝해도 기념일 완벽 챙기는 애인", ea: "🌷", eb: "🎁", ta: "emotion", tb: "logic" },
  { id: "love-5", cat: "love", a: "친구들 앞에서 애정표현 많은 애인", b: "둘이 있을 때만 다정한 애인", ea: "🫶", eb: "🤫", ta: "emotion", tb: "stability" },
  { id: "love-6", cat: "love", a: "SNS에 내 사진 도배하는 애인", b: "SNS엔 흔적 하나 없는 애인", ea: "📸", eb: "🕵️", ta: "emotion", tb: "stability" },
  { id: "love-7", cat: "love", a: "권태기 없이 밋밋하게 오래가는 연애", b: "롤러코스터처럼 뜨겁고 짧은 연애", ea: "🛋️", eb: "🎢", ta: "stability", tb: "adventure" },
  { id: "love-8", cat: "love", a: "전 애인이 재력가", b: "전 애인이 아직도 연락 옴", ea: "💰", eb: "☎️", ta: "logic", tb: "emotion" },
  { id: "love-9", cat: "love", a: "자만추(자연스러운 만남 추구)", b: "소개팅·데이팅앱으로 적극 만남", ea: "🍀", eb: "📲", ta: "freedom", tb: "hustle" },
  { id: "love-10", cat: "love", a: "다시 만날 수 없는 완벽한 첫사랑", b: "언제든 연락되는 그럭저럭인 지금 썸", ea: "🌌", eb: "🙂", ta: "emotion", tb: "logic" },

  // 음식
  { id: "food-1", cat: "food", a: "탕수육 부먹", b: "탕수육 찍먹", ea: "🥣", eb: "🥢", ta: "freedom", tb: "logic" },
  { id: "food-2", cat: "food", a: "평생 치킨만 먹기", b: "평생 피자만 먹기", ea: "🍗", eb: "🍕", ta: "stability", tb: "freedom" },
  { id: "food-3", cat: "food", a: "국물 없는 라면", b: "건더기 없는 라면", ea: "🍜", eb: "🥤", ta: "emotion", tb: "logic" },
  { id: "food-4", cat: "food", a: "마라탕 순한맛만 평생", b: "마라탕 마라맛 5단계 이상만 평생", ea: "🍲", eb: "🔥", ta: "stability", tb: "adventure" },
  { id: "food-5", cat: "food", a: "편의점 도시락으로만 삼시세끼", b: "집밥이지만 매일 똑같은 반찬", ea: "🍱", eb: "🍚", ta: "freedom", tb: "stability" },
  { id: "food-6", cat: "food", a: "디저트 없는 삶", b: "매운 음식 없는 삶", ea: "🍰", eb: "🌶️", ta: "adventure", tb: "emotion" },
  { id: "food-7", cat: "food", a: "배달비 무료지만 최소주문 3만원", b: "배달비 3천원인데 최소주문 없음", ea: "🛵", eb: "💳", ta: "logic", tb: "freedom" },
  { id: "food-8", cat: "food", a: "미지근한 아이스아메리카노", b: "너무 뜨거운 뜨아", ea: "🧊", eb: "☕", ta: "stability", tb: "adventure" },
  { id: "food-9", cat: "food", a: "회식은 무조건 고기+소맥", b: "회식은 무조건 조용한 파인다이닝", ea: "🍖", eb: "🍽️", ta: "hustle", tb: "emotion" },
  { id: "food-10", cat: "food", a: "치즈 무한리필", b: "고기 무한리필", ea: "🧀", eb: "🥩", ta: "emotion", tb: "logic" },

  // 마라맛 극한선택
  { id: "extreme-1", cat: "extreme", a: "평생 에어컨 없이 여름나기", b: "평생 난방 없이 겨울나기", ea: "🥵", eb: "🥶", ta: "adventure", tb: "stability" },
  { id: "extreme-2", cat: "extreme", a: "내 흑역사 전 국민 공개", b: "가장 친한 친구의 흑역사 평생 알고만 있기", ea: "📢", eb: "🤐", ta: "freedom", tb: "logic" },
  { id: "extreme-3", cat: "extreme", a: "월급 반토막, 대신 주 4일 근무", b: "월급 두 배, 대신 주 6일 근무", ea: "💤", eb: "💵", ta: "freedom", tb: "hustle" },
  { id: "extreme-4", cat: "extreme", a: "평생 인터넷 없이 살기", b: "평생 사람 안 만나고 온라인으로만 살기", ea: "📵", eb: "🖥️", ta: "stability", tb: "freedom" },
  { id: "extreme-5", cat: "extreme", a: "10년 후 미래를 알지만 못 바꿈", b: "아무것도 모르지만 마음대로 바꿀 수 있음", ea: "🔮", eb: "🎲", ta: "logic", tb: "adventure" },
  { id: "extreme-6", cat: "extreme", a: "매일 똑같은 하루가 반복", b: "매일 예측 불가능한 사건이 터짐", ea: "🔁", eb: "🌪️", ta: "stability", tb: "adventure" },
  { id: "extreme-7", cat: "extreme", a: "전 재산 걸고 로또 1등 도전", b: "안정적으로 매달 200만원 평생 보장", ea: "🎰", eb: "🏦", ta: "adventure", tb: "stability" },
  { id: "extreme-8", cat: "extreme", a: "거짓말을 하면 온몸에 두드러기", b: "진심을 말하면 목소리가 사라짐", ea: "🤥", eb: "🤐", ta: "logic", tb: "emotion" },
  { id: "extreme-9", cat: "extreme", a: "유명해지지만 사생활 전부 공개", b: "평범하게 살지만 아무도 나를 모름", ea: "🌟", eb: "🫥", ta: "adventure", tb: "stability" },
  { id: "extreme-10", cat: "extreme", a: "24시간 중 12시간을 무조건 잠자야 함", b: "평생 4시간만 자도 안 피곤함", ea: "😴", eb: "⚡", ta: "stability", tb: "hustle" },

  // 갓생·일상
  { id: "life-1", cat: "life", a: "새벽 5시 기상 갓생 챌린지", b: "느지막이 일어나는 여유로운 하루", ea: "🌅", eb: "🛌", ta: "hustle", tb: "freedom" },
  { id: "life-2", cat: "life", a: "무지출 챌린지 한 달", b: "플렉스(과소비) 하루 몰아서 하기", ea: "🧾", eb: "🛍️", ta: "logic", tb: "adventure" },
  { id: "life-3", cat: "life", a: "헬스장 PT 6개월 끊기", b: "홈트 유튜브 영상만 보고 따라하기", ea: "🏋️", eb: "📺", ta: "hustle", tb: "freedom" },
  { id: "life-4", cat: "life", a: "미라클모닝 루틴 유지", b: "야행성 올빼미 루틴 유지", ea: "🌄", eb: "🌙", ta: "hustle", tb: "freedom" },
  { id: "life-5", cat: "life", a: "정리정돈 완벽한 미니멀 라이프", b: "물건 쌓아두는 편안한 맥시멀 라이프", ea: "🧺", eb: "📦", ta: "logic", tb: "emotion" },
  { id: "life-6", cat: "life", a: "일 년에 한 번 해외여행", b: "매달 국내 근교 여행", ea: "✈️", eb: "🚗", ta: "hustle", tb: "freedom" },
  { id: "life-7", cat: "life", a: "카공족(카페에서 공부)", b: "스터디카페 죽순이", ea: "☕", eb: "📚", ta: "freedom", tb: "hustle" },
  { id: "life-8", cat: "life", a: "반려동물과 함께 사는 삶", b: "반려식물만 키우는 삶", ea: "🐶", eb: "🪴", ta: "emotion", tb: "stability" },
  { id: "life-9", cat: "life", a: "다이어리로 아날로그 갓생 기록", b: "앱으로 디지털 루틴 관리", ea: "📔", eb: "📱", ta: "emotion", tb: "logic" },
  { id: "life-10", cat: "life", a: "주말엔 무조건 집콕", b: "주말엔 무조건 약속 잡기", ea: "🏠", eb: "🚪", ta: "stability", tb: "adventure" },

  // 돈·직장
  { id: "money-1", cat: "money", a: "재택근무, 대신 연봉 동결", b: "출근 필수, 대신 연봉 인상", ea: "🏡", eb: "🏢", ta: "freedom", tb: "hustle" },
  { id: "money-2", cat: "money", a: "적성에 안 맞지만 연봉 높은 회사", b: "적성에 딱 맞지만 연봉 낮은 회사", ea: "💼", eb: "🎯", ta: "logic", tb: "emotion" },
  { id: "money-3", cat: "money", a: "코인 투자로 벼락부자 도전", b: "적금·예금으로 안전하게 모으기", ea: "🪙", eb: "🏦", ta: "adventure", tb: "stability" },
  { id: "money-4", cat: "money", a: "부동산 영끌 내 집 마련", b: "평생 전세·월세로 자유롭게 이사", ea: "🏠", eb: "🔑", ta: "hustle", tb: "freedom" },
  { id: "money-5", cat: "money", a: "정시 칼퇴, 대신 회식 잦음", b: "야근 가끔, 대신 회식 전혀 없음", ea: "⏰", eb: "🍻", ta: "stability", tb: "freedom" },
  { id: "money-6", cat: "money", a: "월급 루팡(일 적게, 돈 그대로)", b: "일 많이 하는 대신 매년 확실한 인센티브", ea: "🥷", eb: "📈", ta: "freedom", tb: "hustle" },
  { id: "money-7", cat: "money", a: "짠테크로 티끌 모아 태산", b: "한 번에 몰빵 투자로 승부", ea: "🐜", eb: "🎯", ta: "stability", tb: "adventure" },
  { id: "money-8", cat: "money", a: "조용한 사직(딱 할 일만 하기)", b: "적극적으로 티내며 열심히 일하기", ea: "🤫", eb: "🙋", ta: "freedom", tb: "hustle" },
  { id: "money-9", cat: "money", a: "프리랜서로 자유롭지만 불안정한 수입", b: "직장인으로 안정적이지만 정해진 월급", ea: "🧑‍💻", eb: "🧑‍💼", ta: "freedom", tb: "stability" },
  { id: "money-10", cat: "money", a: "퇴사 후 세계여행", b: "퇴사 없이 착실히 이직 준비", ea: "🌍", eb: "📄", ta: "adventure", tb: "logic" },

  // 디지털·SNS
  { id: "digital-1", cat: "digital", a: "SNS 완전히 끊기(디지털 디톡스)", b: "하루 5시간 이상 SNS 보기", ea: "🌿", eb: "📵", ta: "stability", tb: "emotion" },
  { id: "digital-2", cat: "digital", a: "숏폼(쇼츠·릴스)만 보기", b: "긴 영상(브이로그·영화)만 보기", ea: "🎞️", eb: "🎬", ta: "freedom", tb: "stability" },
  { id: "digital-3", cat: "digital", a: "인스타 스토리에 일상 다 올리기", b: "게시물 하나 없는 비공개 계정", ea: "📖", eb: "🔒", ta: "emotion", tb: "stability" },
  { id: "digital-4", cat: "digital", a: "챗GPT 없이 평생 살기", b: "챗GPT 없으면 아무것도 못 하는 삶", ea: "✍️", eb: "🤖", ta: "hustle", tb: "freedom" },
  { id: "digital-5", cat: "digital", a: "메시지 답장 3초컷 즉각 반응", b: "읽씹 후 하루 지나 답장", ea: "⚡", eb: "🐢", ta: "emotion", tb: "freedom" },
  { id: "digital-6", cat: "digital", a: "OTT 정주행 몰아보기", b: "매주 본방 사수 기다리기", ea: "📺", eb: "🗓️", ta: "adventure", tb: "stability" },
  { id: "digital-7", cat: "digital", a: "알고리즘이 완벽히 취향 저격", b: "알고리즘 초기화하고 랜덤 탐색", ea: "🎯", eb: "🎰", ta: "stability", tb: "adventure" },
  { id: "digital-8", cat: "digital", a: "인친(인스타 친구) 많고 얕은 관계", b: "친구 적지만 깊은 관계", ea: "🌐", eb: "🤝", ta: "freedom", tb: "emotion" },
  { id: "digital-9", cat: "digital", a: "무제한 요금제, 대신 폰 배터리 반나절", b: "데이터 제한, 대신 배터리 3일", ea: "📶", eb: "🔋", ta: "freedom", tb: "logic" },
  { id: "digital-10", cat: "digital", a: "SNS 팔로워 10만, 사생활 없음", b: "팔로워 100명, 완전한 자유", ea: "📈", eb: "🕊️", ta: "adventure", tb: "freedom" },
];
