(function () {
  "use strict";

  const STORAGE_KEY = "balanceGameVotes";

  const categoryBar = document.getElementById("categoryBar");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const questionCard = document.getElementById("questionCard");
  const questionTag = document.getElementById("questionTag");
  const optionA = document.getElementById("optionA");
  const optionB = document.getElementById("optionB");
  const emojiA = document.getElementById("emojiA");
  const emojiB = document.getElementById("emojiB");
  const textA = document.getElementById("textA");
  const textB = document.getElementById("textB");
  const barA = document.getElementById("barA");
  const barB = document.getElementById("barB");
  const percentA = document.getElementById("percentA");
  const percentB = document.getElementById("percentB");
  const hint = document.getElementById("hint");
  const nextBtn = document.getElementById("nextBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const resultScreen = document.getElementById("resultScreen");
  const resultSummary = document.getElementById("resultSummary");
  const restartBtn = document.getElementById("restartBtn");
  const shareBtn = document.getElementById("shareBtn");
  const kakaoBtn = document.getElementById("kakaoBtn");
  const gameWrap = document.querySelector(".game-wrap");
  const psychEmoji = document.getElementById("psychEmoji");
  const psychTitle = document.getElementById("psychTitle");
  const psychDesc = document.getElementById("psychDesc");
  const traitBars = document.getElementById("traitBars");

  let currentCategory = "all";
  let deck = [];
  let index = 0;
  let answered = false;
  let history = []; // { question, choice: 'a' | 'b' }

  // 질문마다 고정된 "기본 참여자 수"를 만들어, 처음 열어도 0/0이 아닌
  // 그럴듯한 선택 비율을 보여주기 위한 시드 해시 함수.
  function seedFromId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  function baseCounts(id) {
    const seed = seedFromId(id);
    const total = 300 + (seed % 4200); // 300 ~ 4500명 참여한 것처럼
    const ratio = 0.15 + ((seed >>> 8) % 71) / 100; // A가 15% ~ 85%
    const a = Math.round(total * ratio);
    const b = total - a;
    return { a, b };
  }

  function loadVotes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveVotes(votes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch (e) {
      /* 저장 실패해도 게임 진행에는 문제 없음 */
    }
  }

  function getCounts(question) {
    const votes = loadVotes();
    const base = baseCounts(question.id);
    const mine = votes[question.id] || { a: 0, b: 0 };
    return { a: base.a + mine.a, b: base.b + mine.b };
  }

  function registerVote(question, choice) {
    const votes = loadVotes();
    const entry = votes[question.id] || { a: 0, b: 0 };
    entry[choice] += 1;
    votes[question.id] = entry;
    saveVotes(votes);
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildDeck(categoryId) {
    const pool =
      categoryId === "all"
        ? QUESTIONS
        : QUESTIONS.filter((q) => q.cat === categoryId);
    return shuffle(pool);
  }

  function categoryLabel(catId) {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? `${cat.emoji} ${cat.name}` : catId;
  }

  function renderCategoryBar() {
    categoryBar.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (cat.id === currentCategory ? " active" : "");
      btn.textContent = `${cat.emoji} ${cat.name}`;
      btn.addEventListener("click", () => selectCategory(cat.id));
      categoryBar.appendChild(btn);
    });
  }

  function selectCategory(categoryId) {
    currentCategory = categoryId;
    renderCategoryBar();
    startGame();
  }

  function startGame() {
    deck = buildDeck(currentCategory);
    index = 0;
    history = [];
    resultScreen.hidden = true;
    gameWrap.hidden = false;
    if (deck.length === 0) {
      questionTag.textContent = "질문 없음";
      hint.textContent = "이 카테고리에는 아직 질문이 없어요.";
      return;
    }
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    nextBtn.disabled = true;
    nextBtn.textContent = index === deck.length - 1 ? "결과 보기 →" : "다음 질문 →";
    optionA.classList.remove("selected", "revealed");
    optionB.classList.remove("selected", "revealed");
    barA.style.width = "0%";
    barB.style.width = "0%";
    percentA.textContent = "";
    percentB.textContent = "";
    hint.textContent = "둘 중 하나를 골라보세요!";

    const q = deck[index];
    questionTag.textContent = categoryLabel(q.cat);
    emojiA.textContent = q.ea;
    emojiB.textContent = q.eb;
    textA.textContent = q.a;
    textB.textContent = q.b;

    progressLabel.textContent = `${index + 1} / ${deck.length}`;
    progressFill.style.width = `${((index + 1) / deck.length) * 100}%`;
  }

  function reveal(choice) {
    if (answered) return;
    answered = true;

    const q = deck[index];
    registerVote(q, choice);
    const counts = getCounts(q);
    const total = counts.a + counts.b;
    const pctA = Math.round((counts.a / total) * 100);
    const pctB = 100 - pctA;

    barA.style.width = `${pctA}%`;
    barB.style.width = `${pctB}%`;
    percentA.textContent = `${pctA}%`;
    percentB.textContent = `${pctB}%`;

    optionA.classList.add("revealed");
    optionB.classList.add("revealed");
    if (choice === "a") optionA.classList.add("selected");
    if (choice === "b") optionB.classList.add("selected");
    hint.textContent = "다른 사람들의 선택 비율이에요 (이 브라우저 누적 기준)";

    history.push({ question: q, choice });
    nextBtn.disabled = false;
  }

  function goNext() {
    if (index < deck.length - 1) {
      index += 1;
      renderQuestion();
    } else {
      showResult();
    }
  }

  // 답한 선택지들의 성향 태그를 세어 가장 많이 나온 성향(들)을 찾는다.
  function computeTraitCounts() {
    const counts = {};
    history.forEach((h) => {
      const trait = h.choice === "a" ? h.question.ta : h.question.tb;
      if (!trait) return;
      counts[trait] = (counts[trait] || 0) + 1;
    });
    return counts;
  }

  function computeResultType(counts) {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const maxCount = Math.max(...entries.map(([, c]) => c));
    const topKeys = entries.filter(([, c]) => c === maxCount).map(([k]) => k);

    if (topKeys.length === 1) {
      return TYPES[topKeys[0]];
    }

    const [keyA, keyB] = topKeys;
    const a = TYPES[keyA];
    const b = TYPES[keyB];
    return {
      key: `${keyA}-${keyB}`,
      name: `${a.name} + ${b.name}`,
      emoji: `${a.emoji}${b.emoji}`,
      title: `반반! ${a.name}×${b.name} 밸런서`,
      desc: `${a.desc} 동시에, ${b.desc}`,
    };
  }

  function renderPsychResult() {
    const counts = computeTraitCounts();
    const resultType = computeResultType(counts);

    if (!resultType) {
      psychEmoji.textContent = "🤔";
      psychTitle.textContent = "아직 데이터가 부족해요";
      psychDesc.textContent = "질문에 몇 개 더 답하면 성향을 분석해드릴게요!";
      traitBars.innerHTML = "";
      return null;
    }

    psychEmoji.textContent = resultType.emoji;
    psychTitle.textContent = resultType.title;
    psychDesc.textContent = resultType.desc;

    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
    const rows = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => {
        const trait = TYPES[key];
        const pct = Math.round((count / total) * 100);
        return `
          <div class="trait-bar-row">
            <span class="trait-bar-label">${trait.emoji} ${trait.name}</span>
            <span class="trait-bar-track"><span class="trait-bar-fill" style="width:${pct}%"></span></span>
            <span class="trait-bar-pct">${pct}%</span>
          </div>
        `;
      })
      .join("");
    traitBars.innerHTML = rows;

    return resultType;
  }

  let lastResultType = null;

  function showResult() {
    gameWrap.hidden = true;
    resultScreen.hidden = false;
    const catLabel = categoryLabel(currentCategory);
    resultSummary.innerHTML = `
      <strong>${catLabel}</strong> 카테고리에서 총 <strong>${history.length}개</strong>의 밸런스 게임에 답했어요.
    `;
    lastResultType = renderPsychResult();
  }

  function buildShareText() {
    const catLabel = categoryLabel(currentCategory);
    const lines = history.map((h, i) => {
      const chosenText = h.choice === "a" ? h.question.a : h.question.b;
      const chosenEmoji = h.choice === "a" ? h.question.ea : h.question.eb;
      return `${i + 1}. ${chosenEmoji} ${chosenText}`;
    });
    const typeLine = lastResultType
      ? `${lastResultType.emoji} 나는 "${lastResultType.title}" 타입!\n\n`
      : "";
    return `🔥 밸런스 게임 (${catLabel})\n\n${typeLine}${lines.join("\n")}\n\n너라면 뭘 고를 거야?`;
  }

  async function shareResult() {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ title: "밸런스 게임 결과", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      shareBtn.textContent = "✅ 복사 완료!";
      setTimeout(() => (shareBtn.textContent = "📋 결과 복사하기"), 1600);
    } catch (e) {
      alert(text);
    }
  }

  // 카카오 JS SDK 초기화. kakao-config.js에 키가 없으면 그냥 건너뛴다.
  const kakaoReady =
    typeof Kakao !== "undefined" && typeof KAKAO_JS_KEY === "string" && KAKAO_JS_KEY.length > 0;
  if (kakaoReady) {
    try {
      Kakao.init(KAKAO_JS_KEY);
    } catch (e) {
      /* 초기화 실패 시 카카오 공유 버튼은 클립보드 복사로 대체됨 */
    }
  }

  function shareToKakao() {
    const isInitialized = typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized();
    if (!isInitialized) {
      shareResult();
      alert(
        "카카오톡 공유를 쓰려면 kakao-config.js에 카카오 JavaScript 키를 등록해야 해요.\n" +
          "지금은 대신 결과를 클립보드에 복사했어요."
      );
      return;
    }

    // 카카오 공유는 link에 실제 http(s) 주소가 필요하다. file://로 열어 테스트 중이면
    // 무조건 실패하므로 미리 걸러서 클립보드 복사로 대체한다.
    if (location.protocol === "file:") {
      shareResult();
      alert(
        "카카오톡 공유는 실제로 배포된 https:// 주소에서만 동작해요.\n" +
          "지금은 로컬 파일이라 결과를 클립보드에 복사했어요."
      );
      return;
    }

    const typeText = lastResultType ? `나는 "${lastResultType.title}" 타입!` : "밸런스 게임 결과";
    const pageUrl = window.location.href.split("#")[0];

    try {
      Kakao.Share.sendDefault({
        objectType: "text",
        text: `🔥 밸런스 게임 결과\n${typeText}\n\n너라면 뭘 고를 거야?`,
        link: {
          mobileWebUrl: pageUrl,
          webUrl: pageUrl,
        },
        buttonTitle: "나도 해보기",
      });
    } catch (e) {
      shareResult();
      alert(
        "카카오톡 공유 요청에 실패했어요. 이 사이트 도메인이 카카오 개발자 콘솔의\n" +
          "[앱 설정 > 플랫폼 > Web]에 등록되어 있는지 확인해주세요.\n" +
          "지금은 대신 결과를 클립보드에 복사했어요."
      );
    }
  }

  optionA.addEventListener("click", () => reveal("a"));
  optionB.addEventListener("click", () => reveal("b"));
  nextBtn.addEventListener("click", goNext);
  shuffleBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  shareBtn.addEventListener("click", shareResult);
  kakaoBtn.addEventListener("click", shareToKakao);

  renderCategoryBar();
  startGame();
})();
