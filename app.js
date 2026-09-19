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
  const gameWrap = document.querySelector(".game-wrap");

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

  function showResult() {
    gameWrap.hidden = true;
    resultScreen.hidden = false;
    const catLabel = categoryLabel(currentCategory);
    resultSummary.innerHTML = `
      <strong>${catLabel}</strong> 카테고리에서 총 <strong>${history.length}개</strong>의 밸런스 게임에 답했어요.<br/>
      친구에게 공유해서 같이 골라보세요!
    `;
  }

  function buildShareText() {
    const catLabel = categoryLabel(currentCategory);
    const lines = history.map((h, i) => {
      const chosenText = h.choice === "a" ? h.question.a : h.question.b;
      const chosenEmoji = h.choice === "a" ? h.question.ea : h.question.eb;
      return `${i + 1}. ${chosenEmoji} ${chosenText}`;
    });
    return `🔥 밸런스 게임 (${catLabel})\n\n${lines.join("\n")}\n\n너라면 뭘 고를 거야?`;
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
      setTimeout(() => (shareBtn.textContent = "📋 결과 공유하기"), 1600);
    } catch (e) {
      alert(text);
    }
  }

  optionA.addEventListener("click", () => reveal("a"));
  optionB.addEventListener("click", () => reveal("b"));
  nextBtn.addEventListener("click", goNext);
  shuffleBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  shareBtn.addEventListener("click", shareResult);

  renderCategoryBar();
  startGame();
})();
