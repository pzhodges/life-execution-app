// Life Execution V1
// Local-first personal operating system built with vanilla JavaScript.

(function () {
  const STORAGE_KEY = "lifeExecution.v1";
  const STATE_TO_MODE = {
    "Locked In": "attack",
    Good: "progress",
    Neutral: "stability",
    Stressed: "protect",
    "Burned Out": "recovery"
  };

  const STATE_RESPONSES = {
    "Locked In": "Push. This is where separation happens.",
    Good: "Stay steady. Stack another solid day.",
    Neutral: "Just show up. That's enough today.",
    Stressed: "Handle what matters. Ignore what doesn't.",
    "Burned Out": "Today is not about domination. It's about staying in the game."
  };

  const STATE_DESCRIPTIONS = {
    "Locked In": "High readiness and strong drive",
    Good: "Steady energy and usable focus",
    Neutral: "Stable but not explosive",
    Stressed: "Protected effort and fewer demands",
    "Burned Out": "Recovery mode and minimum viable progress"
  };

  const EMOTIONS = [
    "Unmotivated",
    "Overwhelmed",
    "Lonely",
    "Burned out",
    "Distracted",
    "Focused",
    "High momentum"
  ];

  const QUOTES = [
    "Peace is not the opposite of ambition. It is the condition that keeps ambition clean.",
    "Your future is usually built in the quiet hour nobody claps for.",
    "Small disciplined actions calm the mind because they end the argument with yourself.",
    "A steady day can change a life if repeated without drama.",
    "You do not need to feel powerful to move with power.",
    "Calm is a competitive advantage when chaos is trying to recruit you.",
    "Do not chase intensity when clarity will do the job.",
    "The next right step is often more sacred than the perfect plan.",
    "Momentum is usually a stack of ordinary promises kept.",
    "Discipline becomes gentler when your identity becomes stronger.",
    "Protect your energy like it is mission-critical, because it is.",
    "A focused day is a form of self-respect.",
    "The mountain does not move for emotion. It moves for repetition.",
    "There is strength in restraint when the mind wants noise.",
    "Breathe, narrow the field, and execute what matters.",
    "Winning the day often looks humble before it looks impressive.",
    "Let urgency shrink. Let priorities sharpen.",
    "You can be intense without being frantic.",
    "A grounded person makes cleaner decisions under pressure.",
    "Progress gets louder when excuses get quieter.",
    "Recovery is not retreat. It is maintenance for the long war.",
    "Quiet consistency is harder to imitate than loud motivation.",
    "When the mind scatters, return to the body and the breath.",
    "A strong life is usually built by people who stop bargaining with basics.",
    "The mission grows when you stop waiting to feel ideal.",
    "Use this day. Do not ask it to become another one first.",
    "A peaceful mind can still carry a sharp edge.",
    "The disciplined person is not always intense. They are available to the work.",
    "Simplicity is often the bravest response to overwhelm.",
    "You are allowed to build slowly as long as you keep building.",
    "The day obeys the few things you refuse to neglect.",
    "Depth returns when distraction stops getting fed.",
    "Not every season is for sprinting. Every season is for honesty.",
    "Presence is a force multiplier for imperfect effort.",
    "The life you want may begin with fewer heroic moments and more clean routines."
  ];

  const FUEL_MESSAGES = [
    "Your edge returns the second you stop overexplaining the work and start touching it.",
    "One brave hour can repair the emotional story of an entire day.",
    "Get simple. Hit the next target. Let confidence be earned again.",
    "Today does not need fireworks. It needs follow-through.",
    "A calm attack is still an attack.",
    "Your standards matter most on the days your feelings make weak arguments.",
    "The mission is not to feel perfect. The mission is to keep contact with what matters.",
    "Stack proof, not promises.",
    "There is still power available in this day. Collect it one action at a time.",
    "Stop trying to rescue the whole week. Win the next block.",
    "Pressure gets cleaner when you choose one target and hit it honestly.",
    "The path gets lighter when you stop carrying imaginary tasks.",
    "You are not behind inside a day you still have the power to use well.",
    "Focus is a mercy. Give it to yourself.",
    "If the body is tired, lower the drama and keep the signal.",
    "A single kept promise restores trust faster than ten new plans.",
    "Use discipline as shelter, not punishment.",
    "Protect the mission from your moods and it will start protecting you back.",
    "This is a good day to become dependable again.",
    "Move with dignity. That alone changes the temperature of the day.",
    "The work does not need a performance. It needs your hands on it.",
    "Your comeback can be quiet, immediate, and completely real."
  ];

  const appState = loadState();
  const todayKey = getTodayKey();

  const elements = {
    dailyOpeningScreen: document.getElementById("daily-opening-screen"),
    onboardingScreen: document.getElementById("onboarding-screen"),
    dashboardScreen: document.getElementById("dashboard-screen"),
    dailyQuote: document.getElementById("daily-quote"),
    stateOptions: document.getElementById("state-options"),
    openingFeedback: document.getElementById("opening-feedback"),
    startDayBtn: document.getElementById("start-day-btn"),
    profileForm: document.getElementById("profile-form"),
    profileModalForm: document.getElementById("profile-modal-form"),
    profileFieldsTemplate: document.getElementById("profile-fields-template"),
    editProfileBtn: document.getElementById("edit-profile-btn"),
    openUpdateBtn: document.getElementById("open-update-btn"),
    lifeUpdateForm: document.getElementById("life-update-form"),
    emotionOptions: document.getElementById("emotion-options"),
    regenerateMissionBtn: document.getElementById("regenerate-mission-btn"),
    fuelBtn: document.getElementById("fuel-btn"),
    fuelMessage: document.getElementById("fuel-message"),
    missionList: document.getElementById("mission-list"),
    missionTitle: document.getElementById("mission-title"),
    missionSubtitle: document.getElementById("mission-subtitle"),
    roadmapList: document.getElementById("roadmap-list"),
    reflectionText: document.getElementById("reflection-text"),
    saveReflectionBtn: document.getElementById("save-reflection-btn"),
    winYesBtn: document.getElementById("win-yes-btn"),
    winNoBtn: document.getElementById("win-no-btn"),
    winStatus: document.getElementById("win-status"),
    todayDate: document.getElementById("today-date"),
    streakCount: document.getElementById("streak-count"),
    todayState: document.getElementById("today-state"),
    todayMode: document.getElementById("today-mode"),
    todaySummary: document.getElementById("today-summary"),
    goalCardTitle: document.getElementById("goal-card-title"),
    goalWhyText: document.getElementById("goal-why-text"),
    goalBaselineText: document.getElementById("goal-baseline-text"),
    goalTargetText: document.getElementById("goal-target-text"),
    goalTimelineChip: document.getElementById("goal-timeline-chip"),
    progressLabel: document.getElementById("progress-label"),
    progressFill: document.getElementById("progress-fill"),
    phaseCardTitle: document.getElementById("phase-card-title"),
    phaseFocusText: document.getElementById("phase-focus-text"),
    phaseMilestoneText: document.getElementById("phase-milestone-text"),
    phaseWhyText: document.getElementById("phase-why-text"),
    totalWins: document.getElementById("total-wins"),
    historyPhase: document.getElementById("history-phase"),
    historyMode: document.getElementById("history-mode"),
    winHistory: document.getElementById("win-history")
  };

  init();

  function init() {
    ensureStateShape();
    seedDailyQuote();
    renderStateButtons();
    renderEmotionOptions();
    buildProfileModalForm();
    bindEvents();
    routeApp();
  }

  function ensureStateShape() {
    appState.profile = appState.profile || createEmptyProfile();
    appState.daily = appState.daily || {};
    appState.missions = appState.missions || {};
    appState.roadmap = appState.roadmap || [];
    appState.wins = appState.wins || {};
    appState.reflections = appState.reflections || {};
    appState.lifeUpdates = appState.lifeUpdates || [];
    appState.meta = appState.meta || {};
    appState.streak = Number.isFinite(appState.streak) ? appState.streak : 0;
    appState.totalWins = Number.isFinite(appState.totalWins) ? appState.totalWins : 0;
    appState.lastWinDate = appState.lastWinDate || null;
    saveState();
  }

  function createEmptyProfile() {
    return {
      goalTitle: "",
      why: "",
      baseline: "",
      target: "",
      timeline: "",
      phaseName: "",
      phaseFocus: "",
      phaseMilestone: "",
      phaseWhy: "",
      financialNotes: "",
      physicalNotes: "",
      familyNotes: "",
      spiritualNotes: "",
      strengths: "",
      obstacles: ""
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }

  function routeApp() {
    const hasProfile = Boolean(appState.profile.goalTitle && appState.profile.goalTitle.trim());
    const completedOpening = Boolean(appState.daily[todayKey]?.state);

    showScreen(completedOpening ? (hasProfile ? "dashboard" : "onboarding") : "opening");

    if (completedOpening && hasProfile) {
      ensureMissionForToday();
      renderDashboard();
    } else if (!completedOpening) {
      renderOpeningState();
    } else {
      fillProfileForms();
    }
  }

  function showScreen(name) {
    elements.dailyOpeningScreen.classList.toggle("hidden", name !== "opening");
    elements.onboardingScreen.classList.toggle("hidden", name !== "onboarding");
    elements.dashboardScreen.classList.toggle("hidden", name !== "dashboard");
  }

  function seedDailyQuote() {
    const quoteIndex = deterministicIndex(todayKey, QUOTES.length);
    appState.meta.dailyQuoteDate = todayKey;
    appState.meta.dailyQuote = QUOTES[quoteIndex];
    elements.dailyQuote.textContent = appState.meta.dailyQuote;
  }

  function renderStateButtons() {
    elements.stateOptions.innerHTML = "";
    Object.keys(STATE_TO_MODE).forEach((stateLabel) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "state-btn";
      button.dataset.state = stateLabel;
      button.innerHTML = `<strong>${stateLabel}</strong><span>${STATE_DESCRIPTIONS[stateLabel]}</span>`;
      button.addEventListener("click", () => selectDailyState(stateLabel));
      elements.stateOptions.appendChild(button);
    });
  }

  function renderOpeningState() {
    const today = appState.daily[todayKey];
    if (!today?.state) {
      elements.openingFeedback.classList.add("hidden");
      elements.startDayBtn.classList.add("hidden");
      return;
    }

    selectButton(elements.stateOptions, today.state);
    elements.openingFeedback.textContent = STATE_RESPONSES[today.state];
    elements.openingFeedback.classList.remove("hidden");
    elements.startDayBtn.classList.remove("hidden");
  }

  function selectDailyState(stateLabel) {
    const mode = STATE_TO_MODE[stateLabel];
    appState.daily[todayKey] = {
      date: todayKey,
      state: stateLabel,
      mode,
      coachResponse: STATE_RESPONSES[stateLabel],
      updatedAt: new Date().toISOString()
    };
    saveState();

    selectButton(elements.stateOptions, stateLabel);
    elements.openingFeedback.textContent = STATE_RESPONSES[stateLabel];
    elements.openingFeedback.classList.remove("hidden");
    elements.startDayBtn.classList.remove("hidden");
  }

  function selectButton(container, selectedState) {
    Array.from(container.querySelectorAll("[data-state]")).forEach((button) => {
      button.classList.toggle("active", button.dataset.state === selectedState);
    });
  }

  function buildProfileModalForm() {
    elements.profileModalForm.innerHTML = "";
    const content = elements.profileFieldsTemplate.content.cloneNode(true);
    elements.profileModalForm.appendChild(content);
  }

  function bindEvents() {
    elements.startDayBtn.addEventListener("click", () => {
      const hasProfile = Boolean(appState.profile.goalTitle && appState.profile.goalTitle.trim());
      if (hasProfile) {
        ensureMissionForToday();
        renderDashboard();
        showScreen("dashboard");
      } else {
        fillProfileForms();
        showScreen("onboarding");
      }
    });

    elements.profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveProfileFromForm(event.currentTarget);
      ensureMissionForToday(true);
      renderDashboard();
      showScreen("dashboard");
    });

    elements.profileModalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveProfileFromForm(event.currentTarget);
      ensureMissionForToday(true);
      renderDashboard();
      closeModal("profile-modal");
    });

    elements.editProfileBtn.addEventListener("click", () => {
      fillProfileForms();
      openModal("profile-modal");
    });

    elements.openUpdateBtn.addEventListener("click", () => openModal("life-update-modal"));

    elements.lifeUpdateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveLifeUpdate();
      ensureMissionForToday(true);
      renderDashboard();
      elements.lifeUpdateForm.reset();
      renderEmotionOptions();
      closeModal("life-update-modal");
    });

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => closeModal(button.dataset.closeModal));
    });

    elements.regenerateMissionBtn.addEventListener("click", () => {
      ensureMissionForToday(true);
      renderDashboard();
    });

    elements.fuelBtn.addEventListener("click", () => {
      const index = Math.floor(Math.random() * FUEL_MESSAGES.length);
      elements.fuelMessage.textContent = FUEL_MESSAGES[index];
    });

    elements.saveReflectionBtn.addEventListener("click", saveReflection);
    elements.winYesBtn.addEventListener("click", () => recordWin(true));
    elements.winNoBtn.addEventListener("click", () => recordWin(false));
  }

  function fillProfileForms() {
    populateForm(elements.profileForm, appState.profile);
    populateForm(elements.profileModalForm, appState.profile);
  }

  function populateForm(form, values) {
    if (!form) {
      return;
    }

    Object.keys(createEmptyProfile()).forEach((key) => {
      const field = form.elements.namedItem(key);
      if (field) {
        field.value = values[key] || "";
      }
    });
  }

  function saveProfileFromForm(form) {
    const data = new FormData(form);
    const nextProfile = createEmptyProfile();
    Object.keys(nextProfile).forEach((key) => {
      nextProfile[key] = (data.get(key) || "").toString().trim();
    });

    appState.profile = nextProfile;
    syncRoadmap();
    saveState();
  }

  function syncRoadmap() {
    appState.roadmap = generateRoadmap(appState.profile);
  }

  function renderEmotionOptions() {
    elements.emotionOptions.innerHTML = "";
    EMOTIONS.forEach((emotion) => {
      const label = document.createElement("label");
      label.className = "emotion-pill";
      label.innerHTML = `<input type="checkbox" name="emotions" value="${emotion}"><span>${emotion}</span>`;
      label.addEventListener("click", () => {
        requestAnimationFrame(() => {
          label.classList.toggle("active", label.querySelector("input").checked);
        });
      });
      elements.emotionOptions.appendChild(label);
    });
  }

  function saveLifeUpdate() {
    const formData = new FormData(elements.lifeUpdateForm);
    const emotions = Array.from(elements.lifeUpdateForm.querySelectorAll('input[name="emotions"]:checked')).map((input) => input.value);
    const eventType = (formData.get("eventType") || "").toString();
    const notes = (formData.get("notes") || "").toString().trim();

    appState.lifeUpdates.unshift({
      eventType,
      emotions,
      notes,
      timestamp: new Date().toISOString()
    });

    appState.lifeUpdates = appState.lifeUpdates.slice(0, 20);
    saveState();
  }

  function getTodayContext() {
    const profile = appState.profile;
    const daily = appState.daily[todayKey] || { state: "Neutral", mode: "stability", coachResponse: STATE_RESPONSES.Neutral };
    const latestUpdate = appState.lifeUpdates[0] || null;
    const infoScore = Object.values(profile).filter(Boolean).length;
    const lowInfo = infoScore <= 2;
    return { profile, daily, latestUpdate, infoScore, lowInfo };
  }

  function ensureMissionForToday(forceRegenerate) {
    if (!appState.daily[todayKey]) {
      return;
    }

    if (!forceRegenerate && appState.missions[todayKey]?.items?.length) {
      return;
    }

    const context = getTodayContext();
    const items = generateMissionItems(context);
    appState.missions[todayKey] = {
      title: getMissionTitle(context.daily.mode, context.latestUpdate),
      subtitle: getMissionSubtitle(context),
      items,
      generatedAt: new Date().toISOString()
    };
    saveState();
  }

  function generateMissionItems(context) {
    const { profile, daily, latestUpdate, lowInfo } = context;
    const items = [];
    const workload = getModeWorkload(daily.mode, latestUpdate);

    const goalStep = buildGoalSpecificAction(profile, daily.mode, latestUpdate, lowInfo);
    const physical = buildPhysicalAction(profile, daily.mode, latestUpdate);
    const workFinancial = buildWorkAction(profile, daily.mode, latestUpdate);
    const family = buildFamilyAction(profile, daily.mode, latestUpdate);
    const spiritual = buildSpiritualAction(profile, daily.mode, latestUpdate);
    const reflection = buildReflectionAction(daily.mode);

    const ranked = [goalStep, physical, workFinancial, family, spiritual, reflection].filter(Boolean);
    const prioritized = applyLifeUpdatePriority(ranked, latestUpdate);

    prioritized.slice(0, workload).forEach((item, index) => {
      items.push({
        id: `${todayKey}-${index + 1}`,
        text: item.text,
        category: item.category,
        completed: false
      });
    });

    return items;
  }

  function getModeWorkload(mode, latestUpdate) {
    let count = 4;
    if (mode === "attack") {
      count = 5;
    } else if (mode === "protect" || mode === "recovery") {
      count = 3;
    }

    if (latestUpdate?.emotions?.includes("Burned out")) {
      count = Math.max(3, count - 1);
    }
    if (latestUpdate?.emotions?.includes("High momentum")) {
      count = Math.min(5, count + 1);
    }
    return count;
  }

  function buildGoalSpecificAction(profile, mode, latestUpdate, lowInfo) {
    if (lowInfo) {
      const actionByMode = {
        attack: "Do one hard thing for your goal before the day gets noisy.",
        progress: "Give your main goal a focused 45-minute block.",
        stability: "Spend 30 minutes on the next obvious step for your goal.",
        protect: "Touch your goal for 15 minutes so the line stays alive.",
        recovery: "Do the smallest version of your goal work for 10 minutes."
      };
      return { category: "goal", text: actionByMode[mode] };
    }

    const goal = profile.goalTitle;
    const phaseFocus = profile.phaseFocus || "the current phase";
    let text = `Move ${goal} forward with a focused block on ${phaseFocus}.`;

    if (mode === "attack") {
      text = `Take one stretch step on ${goal} and make visible progress on ${phaseFocus}.`;
    } else if (mode === "protect") {
      text = `Protect continuity by handling the single most important step for ${goal}.`;
    } else if (mode === "recovery") {
      text = `Keep ${goal} alive with a low-friction step tied to ${phaseFocus}.`;
    }

    if (latestUpdate?.eventType === "New opportunity") {
      text = `Capitalize on the new opportunity by taking the clearest next step for ${goal}.`;
    }
    if (latestUpdate?.eventType === "Financial change") {
      text = `Re-align ${goal} with your new financial reality and act on the most practical next step.`;
    }

    return { category: "goal", text };
  }

  function buildPhysicalAction(profile, mode, latestUpdate) {
    const note = profile.physicalNotes;
    if (latestUpdate?.eventType === "Health issue") {
      return { category: "physical", text: "Choose recovery: hydrate, move gently, and avoid any unnecessary physical intensity today." };
    }

    if (note) {
      if (mode === "attack") {
        return { category: "physical", text: "Use your body as leverage today: honor your physical priority and push one level deeper with control." };
      }
      if (mode === "recovery") {
        return { category: "physical", text: "Respect your physical state. Keep movement light and do the recovery actions your body needs." };
      }
      return { category: "physical", text: "Support your physical situation today with intentional movement, water, and a cleaner energy baseline." };
    }

    const defaults = {
      attack: "Train or move your body hard enough to feel switched on.",
      progress: "Move your body for at least 30 minutes and drink water early.",
      stability: "Get some movement in and keep your basics clean.",
      protect: "Take a walk, breathe deeper, and keep your body from absorbing extra stress.",
      recovery: "Hydrate, stretch, and choose gentle movement over intensity."
    };
    return { category: "physical", text: defaults[mode] };
  }

  function buildWorkAction(profile, mode, latestUpdate) {
    const financial = profile.financialNotes;
    const obstacle = profile.obstacles;

    if (latestUpdate?.eventType === "Work stress") {
      return { category: "financial/work", text: "Reduce pressure. Finish the most essential work item and skip any non-critical extra load." };
    }

    if (latestUpdate?.eventType === "Financial change") {
      return { category: "financial/work", text: "Review your money or work reality and make one grounded decision that improves stability." };
    }

    if (financial) {
      return {
        category: "financial/work",
        text: mode === "attack"
          ? "Take a direct action that improves income, savings, or work leverage today."
          : "Do one practical move that strengthens your financial or work position."
      };
    }

    if (obstacle) {
      return { category: "financial/work", text: "Do one focused block on the work that usually gets delayed by your biggest obstacle." };
    }

    const defaults = {
      attack: "Do one hard focused block of work without checking distractions.",
      progress: "Focus for 45 minutes on meaningful work.",
      stability: "Protect one clean block for useful work.",
      protect: "Handle only the essential work that keeps life stable.",
      recovery: "Answer the one work task that matters most and leave the rest alone."
    };
    return { category: "financial/work", text: defaults[mode] };
  }

  function buildFamilyAction(profile, mode, latestUpdate) {
    if (latestUpdate?.eventType === "Family crisis") {
      return { category: "family", text: "Be fully present where your people need you. Reduce ambition today and stabilize the home front." };
    }

    if (profile.familyNotes) {
      return { category: "family", text: "Make one intentional move that supports your family reality instead of hoping it works itself out." };
    }

    if (mode === "attack") {
      return { category: "family", text: "Send one clear message or have one grounded conversation that keeps your relationships clean." };
    }
    return { category: "family", text: "Connect with someone important so progress does not cost you connection." };
  }

  function buildSpiritualAction(profile, mode, latestUpdate) {
    if (latestUpdate?.eventType === "Travel / vacation") {
      return { category: "spiritual/community", text: "Stay in maintenance mode. Keep one grounding ritual so travel does not scatter your center." };
    }

    if (profile.spiritualNotes) {
      return { category: "spiritual/community", text: "Take a few minutes for prayer, stillness, gratitude, or community contact that restores perspective." };
    }

    if (mode === "recovery" || mode === "protect") {
      return { category: "spiritual/community", text: "Take five quiet minutes to breathe, reset, and remember what matters." };
    }

    return { category: "spiritual/community", text: "Create a moment of stillness so your effort stays rooted instead of frantic." };
  }

  function buildReflectionAction(mode) {
    const prompts = {
      attack: "Reflect tonight on what created momentum and what needs to be hit even harder tomorrow.",
      progress: "Reflect tonight so a solid day becomes a repeatable pattern.",
      stability: "Reflect tonight on what kept the day steady.",
      protect: "Reflect tonight on what drained you and what helped you stay intact.",
      recovery: "Reflect tonight with honesty and zero judgment. Survival counts."
    };
    return { category: "reflection", text: prompts[mode] };
  }

  function applyLifeUpdatePriority(items, latestUpdate) {
    if (!latestUpdate) {
      return items;
    }

    const bonuses = {
      "Family crisis": { family: 4, goal: -1, "financial/work": -1 },
      "Work stress": { "financial/work": 2, goal: -1 },
      "New opportunity": { "financial/work": 3, goal: 3 },
      "Financial change": { "financial/work": 4, goal: 2 },
      "Health issue": { physical: 4, goal: -1 },
      "Travel / vacation": { "spiritual/community": 2, physical: 1 },
      "Major life change": { family: 2, "spiritual/community": 2, goal: 1 }
    };

    const emotionBonuses = {
      Overwhelmed: { reflection: 2, "spiritual/community": 1, goal: -1 },
      "Burned out": { physical: 2, reflection: 2, goal: -2 },
      Distracted: { goal: 2 },
      Focused: { goal: 1, "financial/work": 1 },
      "High momentum": { goal: 2, "financial/work": 1 },
      Unmotivated: { reflection: 1, physical: 1 },
      Lonely: { family: 2, "spiritual/community": 1 }
    };

    return items
      .map((item, index) => {
        let score = 10 - index;
        score += bonuses[latestUpdate.eventType]?.[item.category] || 0;
        latestUpdate.emotions.forEach((emotion) => {
          score += emotionBonuses[emotion]?.[item.category] || 0;
        });
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);
  }

  function getMissionTitle(mode, latestUpdate) {
    const baseTitles = {
      attack: "Press forward with precision.",
      progress: "Build another honest day.",
      stability: "Hold the line and keep momentum alive.",
      protect: "Reduce noise. Protect what matters.",
      recovery: "Stay in the game with low-friction wins."
    };

    if (!latestUpdate) {
      return baseTitles[mode];
    }
    if (latestUpdate.eventType === "Family crisis") {
      return "Lead with presence and stability.";
    }
    if (latestUpdate.eventType === "New opportunity") {
      return "Convert momentum into traction.";
    }
    if (latestUpdate.eventType === "Health issue") {
      return "Protect the body and preserve the mission.";
    }
    return baseTitles[mode];
  }

  function getMissionSubtitle(context) {
    const { daily, latestUpdate, lowInfo } = context;
    if (latestUpdate) {
      const emotionText = latestUpdate.emotions.length ? ` and ${latestUpdate.emotions.join(", ").toLowerCase()}` : "";
      return `Recommendations adjusted for ${latestUpdate.eventType.toLowerCase()}${emotionText}.`;
    }
    if (lowInfo) {
      return `Built from your ${daily.state.toLowerCase()} state with a low-info profile. Add more detail later for sharper personalization.`;
    }
    return `Adapted for a ${daily.mode} day using your goal, phase, and life context.`;
  }

  function renderDashboard() {
    const { profile, daily } = getTodayContext();
    const mission = appState.missions[todayKey] || { title: "", subtitle: "", items: [] };

    elements.todayDate.textContent = formatDisplayDate(new Date());
    elements.streakCount.textContent = String(appState.streak || 0);
    elements.todayState.textContent = daily.state;
    elements.todayMode.textContent = daily.mode;
    elements.todaySummary.textContent = daily.coachResponse;

    elements.goalCardTitle.textContent = profile.goalTitle || "Your main mission";
    elements.goalWhyText.textContent = profile.why || "A clear goal, repeated daily, becomes a new life architecture.";
    elements.goalBaselineText.textContent = profile.baseline || "Current state not set";
    elements.goalTargetText.textContent = profile.target || "Target not set";

    if (profile.timeline) {
      elements.goalTimelineChip.textContent = profile.timeline;
      elements.goalTimelineChip.classList.remove("hidden");
    } else {
      elements.goalTimelineChip.classList.add("hidden");
    }

    const progressPercent = calculateProgressSignal(profile);
    elements.progressLabel.textContent = progressPercent.label;
    elements.progressFill.style.width = `${progressPercent.value}%`;

    syncRoadmap();
    saveState();
    const roadmap = appState.roadmap;
    elements.phaseCardTitle.textContent = profile.phaseName || roadmap[0].title;
    elements.phaseFocusText.textContent = profile.phaseFocus || "Consistency and useful action";
    elements.phaseMilestoneText.textContent = profile.phaseMilestone || "One clear visible step forward";
    elements.phaseWhyText.textContent = profile.phaseWhy || "This phase matters because stable execution creates the right future from where you actually are.";

    renderRoadmap(profile);
    elements.missionTitle.textContent = mission.title;
    elements.missionSubtitle.textContent = mission.subtitle;
    renderMissionItems(mission.items);

    elements.totalWins.textContent = String(appState.totalWins || 0);
    elements.historyPhase.textContent = profile.phaseName || roadmap[0].title;
    elements.historyMode.textContent = daily.mode;
    renderWinHistory();

    elements.reflectionText.value = appState.reflections[todayKey] || "";
    updateWinStatus();
    showScreen("dashboard");
  }

  function renderRoadmap(profile) {
    if (!appState.roadmap.length) {
      appState.roadmap = generateRoadmap(profile);
      saveState();
    }

    const phases = appState.roadmap;
    elements.roadmapList.innerHTML = "";
    phases.forEach((phase, index) => {
      const item = document.createElement("div");
      item.className = "roadmap-item";
      item.innerHTML = `<strong>Phase ${index + 1}: ${phase.title}</strong><span class="muted">${phase.description}</span>`;
      elements.roadmapList.appendChild(item);
    });
  }

  function generateRoadmap(profile) {
    const goal = profile.goalTitle || "your goal";
    const personalized = Boolean(profile.goalTitle && (profile.why || profile.phaseFocus || profile.target));

    if (!personalized) {
      return [
        { title: "Foundation", description: `Stabilize routines and build clarity around ${goal}.` },
        { title: "Build", description: "Increase repetition, output, and trust in your process." },
        { title: "Breakthrough", description: "Convert disciplined consistency into visible results." }
      ];
    }

    const goalWords = goal.split(" ").slice(0, 4).join(" ");
    return [
      {
        title: profile.phaseName || "Foundation",
        description: profile.phaseFocus || `Create traction and structure around ${goalWords}.`
      },
      {
        title: profile.target ? "Expansion" : "Build",
        description: profile.target ? `Bridge the gap between ${profile.baseline || "today"} and ${profile.target}.` : `Increase capacity and execution quality for ${goalWords}.`
      },
      {
        title: "Breakthrough",
        description: profile.timeline ? `Push toward the result you want by ${profile.timeline}.` : "Turn consistency into a lasting identity shift."
      }
    ];
  }

  function renderMissionItems(items) {
    elements.missionList.innerHTML = "";
    items.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mission-item";
      wrapper.innerHTML = `
        <input class="mission-check" type="checkbox" ${item.completed ? "checked" : ""} aria-label="Mark mission item complete">
        <div class="mission-meta">
          <span class="mission-tag">${item.category}</span>
          <textarea rows="3">${item.text}</textarea>
        </div>
      `;

      const checkbox = wrapper.querySelector(".mission-check");
      const textarea = wrapper.querySelector("textarea");

      checkbox.addEventListener("change", () => {
        appState.missions[todayKey].items[index].completed = checkbox.checked;
        saveState();
      });

      textarea.addEventListener("input", () => {
        appState.missions[todayKey].items[index].text = textarea.value;
        saveState();
      });

      elements.missionList.appendChild(wrapper);
    });
  }

  function calculateProgressSignal(profile) {
    let score = 12;
    if (profile.goalTitle) score += 10;
    if (profile.why) score += 12;
    if (profile.baseline) score += 7;
    if (profile.target) score += 10;
    if (profile.timeline) score += 6;
    if (profile.phaseName) score += 8;
    if (profile.phaseFocus) score += 8;
    if (profile.phaseMilestone) score += 7;
    if (profile.strengths) score += 5;
    if (profile.obstacles) score += 5;

    const value = Math.min(96, score);
    let label = "In motion";
    if (value > 70) {
      label = "Highly defined";
    } else if (value > 45) {
      label = "Structured";
    }
    return { value, label };
  }

  function saveReflection() {
    appState.reflections[todayKey] = elements.reflectionText.value.trim();
    saveState();
    elements.saveReflectionBtn.textContent = "Saved";
    window.setTimeout(() => {
      elements.saveReflectionBtn.textContent = "Save Reflection";
    }, 1200);
  }

  function recordWin(won) {
    const existing = appState.wins[todayKey];

    if (won) {
      if (existing?.won) {
        updateWinStatus("Today's win is already recorded.");
        return;
      }

      const yesterdayKey = offsetDateKey(todayKey, -1);
      appState.wins[todayKey] = {
        date: todayKey,
        won: true,
        updatedAt: new Date().toISOString()
      };

      if (appState.lastWinDate === yesterdayKey) {
        appState.streak += 1;
      } else {
        appState.streak = 1;
      }

      appState.lastWinDate = todayKey;
      appState.totalWins += 1;
      saveState();
      renderDashboard();
      updateWinStatus("Win locked. Protect the streak.");
      return;
    }

    if (existing?.won) {
      updateWinStatus("Today's win is already locked in.");
      return;
    }

    appState.wins[todayKey] = {
      date: todayKey,
      won: false,
      updatedAt: new Date().toISOString()
    };
    saveState();
    updateWinStatus("Day still open. You can come back and claim it later.");
    renderWinHistory();
  }

  function updateWinStatus(message) {
    const todayWin = appState.wins[todayKey];
    if (message) {
      elements.winStatus.textContent = message;
      return;
    }

    if (todayWin?.won) {
      elements.winStatus.textContent = "Today's win is recorded.";
    } else {
      elements.winStatus.textContent = "A win is one honest day in alignment.";
    }
  }

  function renderWinHistory() {
    elements.winHistory.innerHTML = "";
    for (let offset = 6; offset >= 0; offset -= 1) {
      const dateKey = offsetDateKey(todayKey, -offset);
      const win = appState.wins[dateKey];
      const date = new Date(`${dateKey}T12:00:00`);
      const item = document.createElement("div");
      const won = Boolean(win?.won);
      item.className = `history-dot ${won ? "win" : "loss"}`;
      item.innerHTML = `<span>${date.toLocaleDateString(undefined, { weekday: "short" })}</span><strong>${won ? "Win" : "Open"}</strong>`;
      elements.winHistory.appendChild(item);
    }
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (id === "profile-modal") {
      fillProfileForms();
    }
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function getTodayKey() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function offsetDateKey(dateKey, offset) {
    const date = new Date(`${dateKey}T12:00:00`);
    date.setDate(date.getDate() + offset);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function deterministicIndex(seed, length) {
    let total = 0;
    for (let i = 0; i < seed.length; i += 1) {
      total += seed.charCodeAt(i) * (i + 1);
    }
    return total % length;
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
})();
