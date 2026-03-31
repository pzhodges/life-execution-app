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

  const PRIORITY_OPTIONS = [
    "Money / Work",
    "Family",
    "Health",
    "Peace / Reset",
    "Growth"
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

  const TASK_FEEDBACK_MESSAGES = [
    "Good. Keep going.",
    "Stack it.",
    "That counts.",
    "Keep moving."
  ];

  const WIN_REWARD_MESSAGES = [
    "Another day stacked.",
    "This is how momentum builds.",
    "You showed up. That matters.",
    "One more day in alignment."
  ];

  const CLARITY_STEPS = [
    {
      key: "goalTitle",
      question: "What are you working toward?",
      hint: "Name the main thing you want to move forward.",
      placeholder: "Build my business, get financially stable, get back in shape",
      type: "textarea"
    },
    {
      key: "target",
      question: "What does success look like?",
      hint: "Describe the result in plain language.",
      placeholder: "Consistent income, stronger health, a finished launch",
      type: "textarea"
    },
    {
      key: "timeline",
      question: "When do you want this done by?",
      hint: "Use simple timing, not exact dates unless you want to.",
      placeholder: "End of this year, in 6 months, by July",
      type: "textarea"
    },
    {
      key: "baseline",
      question: "Where are you right now?",
      hint: "Start with the truth, not the ideal.",
      placeholder: "Behind on savings, early in the business, rebuilding energy",
      type: "textarea"
    },
    {
      key: "gap",
      question: "What's the biggest thing missing right now?",
      hint: "This becomes what matters most right now inside the app.",
      placeholder: "Consistency, leads, structure, confidence, rest",
      type: "textarea"
    },
    {
      key: "phaseName",
      question: "What phase are you in right now?",
      hint: "Pick the season that feels most true.",
      type: "choice",
      options: [
        "Figuring it out",
        "Building the foundation",
        "Growing",
        "Scaling"
      ]
    },
    {
      key: "phaseMilestone",
      question: "What is the next milestone?",
      hint: "Name the next meaningful checkpoint, not the final outcome.",
      placeholder: "Launch the first offer, complete 4 workouts a week, save the first $1,000",
      type: "textarea"
    },
    {
      key: "phaseWhy",
      question: "Why does this milestone matter?",
      hint: "Optional, but useful when you want more context on the dashboard.",
      placeholder: "Because it proves progress is real and gives me the next clear target",
      type: "textarea"
    },
    {
      key: "why",
      question: "Why does this matter right now?",
      hint: "Keep it human. Short is fine.",
      placeholder: "I need stability, I want to show up for my family, I’m tired of drifting",
      type: "textarea"
    }
  ];

  const appState = loadState();
  const todayKey = getTodayKey();
  const flowState = {
    onboardingStep: 0,
    modalStep: 0
  };

  const elements = {
    dailyOpeningScreen: document.getElementById("daily-opening-screen"),
    onboardingScreen: document.getElementById("onboarding-screen"),
    dashboardScreen: document.getElementById("dashboard-screen"),
    dailyQuote: document.getElementById("daily-quote"),
    stateOptions: document.getElementById("state-options"),
    openingFeedback: document.getElementById("opening-feedback"),
    prioritySection: document.getElementById("priority-section"),
    priorityOptions: document.getElementById("priority-options"),
    skipPriorityBtn: document.getElementById("skip-priority-btn"),
    startDayBtn: document.getElementById("start-day-btn"),
    resetAppBtn: document.getElementById("reset-app-btn"),
    profileForm: document.getElementById("profile-form"),
    profileModalForm: document.getElementById("profile-modal-form"),
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
    missionFeedback: document.getElementById("mission-feedback"),
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
    momentumStatus: document.getElementById("momentum-status"),
    streakPill: document.getElementById("streak-pill"),
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
    winHistory: document.getElementById("win-history"),
    missionCard: document.getElementById("mission-card"),
    winCard: document.getElementById("win-card")
  };

  init();

  function init() {
    ensureStateShape();
    seedDailyQuote();
    renderStateButtons();
    renderPriorityOptions();
    renderEmotionOptions();
    bindEvents();
    routeApp();
  }

  function ensureStateShape() {
    appState.profile = {
      ...createEmptyProfile(),
      ...(appState.profile || {})
    };
    appState.daily = appState.daily || {};
    appState.missions = appState.missions || {};
    appState.roadmap = appState.roadmap || [];
    appState.wins = appState.wins || {};
    appState.reflections = appState.reflections || {};
    appState.lifeUpdates = appState.lifeUpdates || [];
    appState.performance = appState.performance || {};
    appState.meta = appState.meta || {};
    appState.streak = Number.isFinite(appState.streak) ? appState.streak : 0;
    appState.totalWins = Number.isFinite(appState.totalWins) ? appState.totalWins : 0;
    appState.lastWinDate = appState.lastWinDate || null;
    appState.meta.onboardingCompleted = Boolean(
      appState.meta.onboardingCompleted || hasMeaningfulProfileData(appState.profile)
    );
    appState.meta.onboardingStep = clampStepIndex(appState.meta.onboardingStep || 0);
    saveState();
  }

  function createEmptyProfile() {
    return {
      goalTitle: "",
      why: "",
      baseline: "",
      target: "",
      gap: "",
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
    const hasProfile = hasCompletedProfile();
    const completedOpening = Boolean(appState.daily[todayKey]?.state);

    showScreen(completedOpening ? (hasProfile ? "dashboard" : "onboarding") : "opening");

    if (completedOpening && hasProfile) {
      ensureMissionForToday();
      renderDashboard();
    } else if (!completedOpening) {
      renderOpeningState();
    } else {
      fillProfileForms();
      flowState.onboardingStep = clampStepIndex(appState.meta.onboardingStep || 0);
      renderClarityFlow("onboarding");
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
      elements.prioritySection.classList.add("hidden");
      elements.startDayBtn.classList.add("hidden");
      return;
    }

    selectButton(elements.stateOptions, today.state);
    selectButton(elements.priorityOptions, today.priority || "");
    elements.openingFeedback.textContent = STATE_RESPONSES[today.state];
    elements.openingFeedback.classList.remove("hidden");
    elements.prioritySection.classList.remove("hidden");
    elements.startDayBtn.classList.remove("hidden");
  }

  function selectDailyState(stateLabel) {
    const mode = STATE_TO_MODE[stateLabel];
    const priority = appState.daily[todayKey]?.priority || "";
    appState.daily[todayKey] = {
      date: todayKey,
      state: stateLabel,
      mode,
      priority,
      coachResponse: STATE_RESPONSES[stateLabel],
      updatedAt: new Date().toISOString()
    };
    saveState();

    selectButton(elements.stateOptions, stateLabel);
    renderOpeningState();
  }

  function selectButton(container, selectedState) {
    Array.from(container.querySelectorAll("[data-state]")).forEach((button) => {
      button.classList.toggle("active", button.dataset.state === selectedState);
    });
  }

  function renderPriorityOptions() {
    elements.priorityOptions.innerHTML = "";
    PRIORITY_OPTIONS.forEach((priority) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "state-btn priority-btn";
      button.dataset.state = priority;
      button.innerHTML = `<strong>${priority}</strong><span>${getPriorityDescription(priority)}</span>`;
      button.addEventListener("click", () => selectDailyPriority(priority));
      elements.priorityOptions.appendChild(button);
    });
  }

  function selectDailyPriority(priority) {
    if (!appState.daily[todayKey]) {
      return;
    }

    appState.daily[todayKey].priority = priority;
    appState.daily[todayKey].updatedAt = new Date().toISOString();
    saveState();
    selectButton(elements.priorityOptions, priority);
  }

  function clearDailyPriority() {
    if (!appState.daily[todayKey]) {
      return;
    }

    appState.daily[todayKey].priority = "";
    appState.daily[todayKey].updatedAt = new Date().toISOString();
    saveState();
    selectButton(elements.priorityOptions, "");
  }

  function getPriorityDescription(priority) {
    const descriptions = {
      "Money / Work": "Create traction where output and income matter most.",
      Family: "Protect connection, presence, and your people.",
      Health: "Support your body, energy, and recovery.",
      "Peace / Reset": "Lower the noise and reset your nervous system.",
      Growth: "Learn, practice, and become more capable."
    };
    return descriptions[priority];
  }

  function hasMeaningfulProfileData(profile) {
    return Boolean(profile.goalTitle || profile.target || profile.baseline || profile.gap || profile.phaseName || profile.why);
  }

  function hasCompletedProfile() {
    return Boolean(appState.meta.onboardingCompleted || hasMeaningfulProfileData(appState.profile));
  }

  function clampStepIndex(index) {
    return Math.min(Math.max(index, 0), CLARITY_STEPS.length - 1);
  }

  function bindEvents() {
    elements.startDayBtn.addEventListener("click", () => {
      if (hasCompletedProfile()) {
        ensureMissionForToday();
        renderDashboard();
        showScreen("dashboard");
        return;
      }

      fillProfileForms();
      showScreen("onboarding");
      renderClarityFlow("onboarding");
    });

    elements.skipPriorityBtn.addEventListener("click", clearDailyPriority);
    elements.resetAppBtn.addEventListener("click", resetAppState);

    elements.editProfileBtn.addEventListener("click", () => {
      fillProfileForms();
      flowState.modalStep = 0;
      renderClarityFlow("modal");
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
    flowState.onboardingStep = clampStepIndex(appState.meta.onboardingStep || 0);
    renderClarityFlow("onboarding");
    renderClarityFlow("modal");
  }

  function renderClarityFlow(surface) {
    const container = surface === "modal" ? elements.profileModalForm : elements.profileForm;
    const stepIndex = surface === "modal" ? flowState.modalStep : flowState.onboardingStep;
    const step = CLARITY_STEPS[stepIndex];
    const value = getFlowValue(step.key);
    const isLast = stepIndex === CLARITY_STEPS.length - 1;

    container.innerHTML = `
      <article class="clarity-step" data-surface="${surface}">
        <div class="clarity-progress">
          <span class="eyebrow">Step ${stepIndex + 1} of ${CLARITY_STEPS.length}</span>
          <div class="clarity-progress-bar"><span style="width: ${((stepIndex + 1) / CLARITY_STEPS.length) * 100}%"></span></div>
        </div>
        <div class="clarity-copy">
          <h2>${step.question}</h2>
          <p class="muted">${step.hint}</p>
        </div>
        ${renderClarityField(step, value, surface)}
        <div class="clarity-actions">
          <button class="btn btn-ghost" type="button" data-flow-skip="${surface}">Skip</button>
          <div class="clarity-action-main">
            ${stepIndex > 0 ? `<button class="btn btn-secondary" type="button" data-flow-back="${surface}">Back</button>` : ""}
            <button class="btn btn-primary btn-large" type="button" data-flow-next="${surface}">${isLast ? (surface === "modal" ? "Save Changes" : "Open Dashboard") : "Next"}</button>
          </div>
        </div>
      </article>
    `;

    const field = container.querySelector("[data-flow-field]");
    if (field) {
      field.addEventListener("input", () => persistClarityAnswer(step, readStepValue(step, container)));
      field.addEventListener("change", () => persistClarityAnswer(step, readStepValue(step, container)));
      const surfaceVisible = surface === "modal"
        ? !document.getElementById("profile-modal")?.classList.contains("hidden")
        : !elements.onboardingScreen.classList.contains("hidden");
      if (surfaceVisible) {
        window.requestAnimationFrame(() => field.focus());
      }
    }

    container.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        persistClarityAnswer(step, button.dataset.choice);
        renderClarityFlow(surface);
      });
    });

    container.querySelector(`[data-flow-skip="${surface}"]`).addEventListener("click", () => {
      persistClarityAnswer(step, "");
      moveClarityFlow(surface, 1);
    });
    container.querySelector(`[data-flow-next="${surface}"]`).addEventListener("click", () => {
      persistClarityAnswer(step, readStepValue(step, container));
      moveClarityFlow(surface, 1);
    });
    const backButton = container.querySelector(`[data-flow-back="${surface}"]`);
    if (backButton) {
      backButton.addEventListener("click", () => moveClarityFlow(surface, -1));
    }
  }

  function renderClarityField(step, value, surface) {
    if (step.type === "choice") {
      return `
        <div class="clarity-choice-grid">
          ${step.options
            .map((option) => `
              <button class="state-btn clarity-choice ${value === option ? "active" : ""}" data-choice="${option}" data-state="${option}" type="button">
                <strong>${option}</strong>
              </button>
            `)
            .join("")}
        </div>
      `;
    }

    const fieldId = `${surface}-${step.key}`;
    return `
      <div class="field-group">
        <label for="${fieldId}" class="sr-only">${step.question}</label>
        <textarea id="${fieldId}" data-flow-field="true" rows="5" maxlength="220" placeholder="${step.placeholder || ""}">${escapeHtml(value)}</textarea>
      </div>
    `;
  }

  function readStepValue(step, container) {
    if (step.type === "choice") {
      return getFlowValue(step.key);
    }
    return (container.querySelector("[data-flow-field]")?.value || "").trim();
  }

  function getFlowValue(key) {
    if (key === "gap") {
      return appState.profile.gap || appState.profile.phaseFocus || "";
    }
    return appState.profile[key] || "";
  }

  function persistClarityAnswer(step, value) {
    const cleaned = (value || "").toString().trim();
    if (step.key === "gap") {
      appState.profile.gap = cleaned;
      appState.profile.phaseFocus = cleaned;
    } else if (step.key === "why") {
      appState.profile.why = cleaned;
      if (!appState.profile.phaseWhy) {
        appState.profile.phaseWhy = cleaned;
      }
    } else {
      appState.profile[step.key] = cleaned;
    }

    syncDerivedProfileFields();
    saveState();
  }

  function syncDerivedProfileFields() {
    if (!appState.profile.phaseFocus && appState.profile.gap) {
      appState.profile.phaseFocus = appState.profile.gap;
    }
    if (!appState.profile.gap && appState.profile.phaseFocus) {
      appState.profile.gap = appState.profile.phaseFocus;
    }
    if (!appState.profile.phaseWhy && appState.profile.why) {
      appState.profile.phaseWhy = appState.profile.why;
    }
  }

  function moveClarityFlow(surface, direction) {
    const key = surface === "modal" ? "modalStep" : "onboardingStep";
    const current = flowState[key];
    const nextStep = current + direction;

    if (nextStep < 0) {
      flowState[key] = 0;
      renderClarityFlow(surface);
      return;
    }

    if (nextStep >= CLARITY_STEPS.length) {
      appState.meta.onboardingCompleted = true;
      appState.meta.onboardingStep = CLARITY_STEPS.length - 1;
      syncRoadmap();
      saveState();
      ensureMissionForToday(true);
      renderDashboard();
      if (surface === "modal") {
        closeModal("profile-modal");
      } else {
        showScreen("dashboard");
      }
      return;
    }

    flowState[key] = nextStep;
    if (surface === "onboarding") {
      appState.meta.onboardingStep = nextStep;
      saveState();
    }
    renderClarityFlow(surface);
  }

  function resetAppState() {
    const confirmed = window.confirm("Reset the app and clear all saved progress?");
    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
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
    const plan = generateMissionPlan(context);
    appState.missions[todayKey] = {
      title: plan.title,
      subtitle: plan.subtitle,
      loadLevel: plan.loadLevel,
      items: plan.items,
      generatedAt: new Date().toISOString()
    };
    syncDailyPerformanceFromMission();
    saveState();
  }

  function generateMissionPlan(context) {
    const { daily } = context;
    const focus = buildFocusLine(context);
    const loadProfile = getAdaptiveLoadProfile(context);
    const tasks = buildMissionTasks(context, loadProfile);

    return {
      title: getMissionTitle(context),
      subtitle: `Today's focus: ${focus}`,
      loadLevel: loadProfile.level,
      items: tasks.map((item, index) => ({
        id: `${todayKey}-${index + 1}`,
        text: item.text,
        category: item.category,
        completed: false,
        role: item.role
      }))
    };
  }

  function getAdaptiveLoadProfile(context) {
    // Use recent completion and win history to gently raise or lower mission volume.
    const history = getRecentPerformanceSnapshot();
    const mode = context.daily.mode;
    let level = "Standard";

    if (mode === "protect" || mode === "recovery") {
      level = "Light";
    } else if (mode === "attack" && history.winRate >= 0.66 && history.completionRate >= 0.8) {
      level = history.strongDays >= 3 ? "Peak" : "Heavy";
    } else if ((mode === "progress" || mode === "stability") && history.completionRate >= 0.7) {
      level = "Heavy";
    }

    if (history.completionRate <= 0.45 || history.winRate <= 0.34) {
      level = level === "Peak" ? "Heavy" : "Light";
    }
    if (mode === "attack" && history.strongDays >= 4 && history.completionRate >= 0.85) {
      level = "Peak";
    }

    const profileByLevel = {
      Light: { level: "Light", count: 3, includeReset: true },
      Standard: { level: "Standard", count: 4, includeReset: mode === "protect" || mode === "recovery" },
      Heavy: { level: "Heavy", count: 5, includeReset: true },
      Peak: { level: "Peak", count: 6, includeReset: true }
    };

    return profileByLevel[level];
  }

  function buildFocusLine(context) {
    const { daily, latestUpdate } = context;
    const priority = daily.priority || getFallbackPriority(context);

    const focusByPriority = {
      "Money / Work": "Push the right work forward",
      Family: "Be present at home and handle what matters",
      Health: "Take care of your body and keep moving",
      "Peace / Reset": "Protect your peace and keep moving",
      Growth: "Build momentum without chaos"
    };

    let focus = focusByPriority[priority] || "Keep the day clear and useful";
    if (latestUpdate?.eventType === "Family crisis") {
      focus = "Be steady at home and handle what matters";
    } else if (latestUpdate?.eventType === "Health issue") {
      focus = "Protect your body and keep the day simple";
    } else if (latestUpdate?.eventType === "New opportunity") {
      focus = "Turn momentum into action";
    }

    return `${focus}.`;
  }

  function buildMissionTasks(context, loadProfile) {
    const { daily, latestUpdate } = context;
    const priority = daily.priority || getFallbackPriority(context);
    const milestoneContext = getMilestoneContext(context);
    // Keep mission construction balanced, but let the current milestone dominate the day.
    const mainMove = buildGoalTask(context, milestoneContext);
    const milestoneMoves = buildMilestoneSupportTasks(context, milestoneContext);
    const categoryMoves = buildPriorityTasks(priority, context, milestoneContext);
    const recoveryMove = shouldIncludeResetMove(daily.mode, loadProfile) ? buildResetTask(context) : null;
    const closingMove = buildClosingTask(context);
    const optionalConnection = buildConnectionTask(context);
    const outsideSupport = getOutsideSupportTask({
      milestoneContext,
      recoveryMove,
      optionalConnection,
      closingMove
    });

    const tasks = [
      { ...mainMove, role: "main" },
      ...milestoneMoves.map((task) => ({ ...task, role: "support" })),
      ...categoryMoves.map((task) => ({ ...task, role: "support" })),
      outsideSupport ? { ...outsideSupport, role: outsideSupport.category === "reset" ? "reset" : "support" } : null
    ].filter(Boolean);

    return dedupeMissionTasks(applyMissionBonuses(tasks, latestUpdate)).slice(0, loadProfile.count);
  }

  function buildGoalTask(context, milestoneContext) {
    const { daily } = context;
    const milestoneTask = buildMilestoneMainTask(milestoneContext, daily.mode);
    if (milestoneTask) {
      return { category: milestoneContext.category, text: milestoneTask };
    }

    const byMode = {
      attack: "Spend 60 focused minutes on your top task before lunch.",
      progress: "Finish one clear task in a 45-minute work block.",
      stability: "Complete one useful task in a 30-minute block.",
      protect: "Spend 20 minutes on the one task that cannot slip.",
      recovery: "Do one 10-minute task to keep the day moving."
    };

    return { category: "goal", text: byMode[daily.mode] };
  }

  function buildPriorityTasks(priority, context, milestoneContext) {
    const { daily, profile, latestUpdate } = context;
    const mode = daily.mode;

    const taskMap = {
      "Money / Work": [
        mode === "attack" ? "Make 3 outreach attempts before lunch." : "Send 1 message that moves work forward.",
        mode === "recovery" ? "Handle the one task that makes tomorrow easier." : "Review your budget or pipeline for 15 minutes tonight.",
        profile.obstacles ? "Remove one blocker before your next work block." : "Work phone-free for 30 minutes."
      ],
      Family: [
        "Spend 20 phone-free minutes with family tonight.",
        "Send one clear check-in message before dinner.",
        mode === "attack" ? "Take a 10-minute walk before going home." : "Clean one small area that makes home lighter."
      ],
      Health: [
        latestUpdate?.eventType === "Health issue" ? "Take your main recovery step before noon." : healthPrimaryTaskByMode(mode),
        "Drink water steadily until you hit your goal today.",
        mode === "recovery" ? "Stretch or breathe for 10 quiet minutes." : "Prep one healthy meal or snack tonight."
      ],
      "Peace / Reset": [
        "Take 10 quiet minutes without your phone.",
        "Clean one area that lowers stress at home.",
        mode === "attack" ? "Take a 10-minute reset between work blocks." : "Skip one task that adds unnecessary stress."
      ],
      Growth: [
        "Write tomorrow's top 3 priorities before bed.",
        profile.gap ? "Write down one thing that made today harder than it should have." : "Write down one thing that slowed you down today.",
        mode === "attack" ? "Set tomorrow's first task before you stop working." : "Prep one thing tonight that makes tomorrow easier."
      ]
    };

    const tasks = taskMap[priority].map((text) => ({ category: priority.toLowerCase(), text }));
    if (!milestoneContext.text || milestoneContext.theme === "general") {
      return tasks.slice(0, 1);
    }

    return tasks.filter((task) => task.category === milestoneContext.category).slice(0, 1);
  }

  function buildResetTask(context) {
    const { daily } = context;
    const byMode = {
      attack: "Take a 10-minute reset between work blocks.",
      progress: "Pause for 5 minutes before your next block.",
      stability: "Write your next task before switching focus.",
      protect: "Cut one non-essential task before noon.",
      recovery: "Pick one promise and finish it today."
    };
    return { category: "reset", text: byMode[daily.mode] };
  }

  function shouldIncludeResetMove(mode, loadProfile) {
    return loadProfile.includeReset || mode === "protect" || mode === "recovery";
  }

  function buildConnectionTask(context) {
    const { daily, latestUpdate } = context;
    if (latestUpdate?.eventType === "Family crisis") {
      return { category: "family", text: "Stay close and give clear updates." };
    }
    if (daily.priority === "Family") {
      return null;
    }
    return { category: "connection", text: "Check in with one person who matters." };
  }

  function buildClosingTask(context) {
    const { daily } = context;
    const byMode = {
      attack: "Write tomorrow's top 3 priorities before bed.",
      progress: "Write down the one task to repeat tomorrow.",
      stability: "Write down what kept the day steady.",
      protect: "Write down what drained your energy today.",
      recovery: "Write down one thing you finished today."
    };
    return { category: "reflection", text: byMode[daily.mode] };
  }

  function healthPrimaryTaskByMode(mode) {
    const tasks = {
      attack: "Complete a 45-minute workout before dinner.",
      progress: "Walk for 20 minutes after your main work block.",
      stability: "Walk for 15 minutes after work.",
      protect: "Take a 10-minute walk before going home.",
      recovery: "Take a 10-minute walk and keep the pace easy."
    };
    return tasks[mode];
  }

  function getMilestoneContext(context) {
    const profile = context.profile;
    const text = (profile.phaseMilestone || getFallbackMilestone(profile) || "").toLowerCase();

    if (/(pushup|push-up|sit-up|situp|pull-up|pullup|squat|plank|rep|reps|sets)/.test(text)) {
      return { text, category: "health", theme: "training" };
    }
    if (/(walk|walking|steps|stamina|endurance|cardio|run|running|stand|standing|movement)/.test(text)) {
      return { text, category: "health", theme: "movement" };
    }
    if (/(workout|gym|lift|lifting|train|training|strength|exercise|fitness)/.test(text)) {
      return { text, category: "health", theme: "workout" };
    }
    if (/(business|client|sale|sales|deal|offer|lead|outreach|call|revenue|pipeline|project|launch)/.test(text)) {
      return { text, category: "money / work", theme: "business" };
    }
    if (/(budget|save|saving|debt|income|money|cash)/.test(text)) {
      return { text, category: "money / work", theme: "money" };
    }
    if (/(family|home|relationship|marriage|kids|children|connection)/.test(text)) {
      return { text, category: "family", theme: "family" };
    }
    if (/(skill|habit|practice|discipline|routine|consisten|weekly)/.test(text)) {
      return { text, category: "personal", theme: "personal" };
    }
    if (/(habit|routine|weekly|consisten)/.test(text) && (context.daily.priority === "Health" || /(health|fit|workout|walk)/.test(`${profile.goalTitle} ${profile.target}`.toLowerCase()))) {
      return { text, category: "health", theme: "movement" };
    }

    return { text, category: "goal", theme: "general" };
  }

  function buildMilestoneMainTask(milestoneContext, mode) {
    const taskMap = {
      training: {
        attack: "Do 3 sets today and track your reps.",
        progress: "Do 3 sets today and write down your best set.",
        stability: "Do 2 sets today and track your reps.",
        protect: "Do 1 light set today and track your reps.",
        recovery: "Attempt 1 easy set today and track your reps."
      },
      movement: {
        attack: "Walk 20 minutes without stopping before dinner.",
        progress: "Walk 15 minutes without stopping today.",
        stability: "Walk 10 minutes after work.",
        protect: "Take a 10-minute walk at an easy pace.",
        recovery: "Walk 5 quiet minutes and keep the pace easy."
      },
      workout: {
        attack: "Complete a 45-minute workout before dinner.",
        progress: "Complete a 30-minute workout today.",
        stability: "Do a 20-minute workout after work.",
        protect: "Do 10 minutes of light movement before dinner.",
        recovery: "Stretch or move gently for 10 minutes."
      },
      business: {
        attack: "Make 3 outreach calls before lunch.",
        progress: "Send 2 follow-up messages before noon.",
        stability: "Spend 30 minutes on the next revenue task.",
        protect: "Handle the one work task that cannot slip today.",
        recovery: "Spend 10 minutes on the next business step."
      },
      money: {
        attack: "Review your numbers for 20 minutes before lunch.",
        progress: "Review your budget for 15 minutes tonight.",
        stability: "Check your spending for 10 minutes today.",
        protect: "Pay or schedule the one bill that matters most.",
        recovery: "Look at your account and list the next money step."
      },
      family: {
        attack: "Spend 20 phone-free minutes with family tonight.",
        progress: "Plan 20 calm minutes with family tonight.",
        stability: "Sit with family for 15 phone-free minutes tonight.",
        protect: "Spend 10 calm minutes with family tonight.",
        recovery: "Send one caring message before dinner."
      },
      personal: {
        attack: "Practice your core habit for 20 minutes today.",
        progress: "Practice your habit for 15 minutes today.",
        stability: "Do your habit once before dinner.",
        protect: "Do the smallest version of your habit today.",
        recovery: "Practice your habit for 5 quiet minutes."
      },
      general: {
        attack: "Spend 45 focused minutes on your next milestone step.",
        progress: "Spend 30 focused minutes on your next milestone step.",
        stability: "Spend 20 minutes on your next milestone step.",
        protect: "Spend 15 minutes on the next step that matters.",
        recovery: "Spend 10 minutes on one simple next step."
      }
    };

    return taskMap[milestoneContext.theme]?.[mode] || taskMap.general[mode];
  }

  function buildMilestoneSupportTasks(context, milestoneContext) {
    const mode = context.daily.mode;
    const supportMap = {
      training: [
        "Do 2 more light sets later today.",
        "Write down your rep count after each set.",
        "Attempt one harder variation once today."
      ],
      movement: [
        mode === "attack" ? "Walk another 10 minutes later today." : "Walk 5 more minutes later today.",
        "Track your longest nonstop walk today.",
        "Stand and stretch for 5 minutes before bed."
      ],
      workout: [
        "Do 2 extra sets for your main movement today.",
        "Track the number of rounds you complete.",
        mode === "recovery" ? "Drink water after your movement block." : "Prep your workout clothes before bed."
      ],
      business: [
        mode === "attack" ? "Review your next offer for 15 minutes tonight." : "Write your next 3 outreach targets tonight.",
        "Make 2 follow-up calls before noon.",
        "Clear one blocker before your next work block."
      ],
      money: [
        "Write down the next money decision before bed.",
        "Set aside 10 minutes tonight to review spending.",
        "Check one bill or payment today."
      ],
      family: [
        "Send one clear check-in message before dinner.",
        "Spend 10 more phone-free minutes together later.",
        "Clean one small area that makes home lighter."
      ],
      personal: [
        "Repeat the same habit once more later today.",
        "Track whether you completed the habit today.",
        "Set out what you need for tomorrow's habit."
      ],
      general: [
        "Write down the next step before bed.",
        "Clear one blocker before your next work block."
      ]
    };

    return (supportMap[milestoneContext.theme] || supportMap.general).slice(0, 4).map((text) => ({
      category: milestoneContext.category,
      text
    }));
  }

  function getOutsideSupportTask(options) {
    const { milestoneContext, recoveryMove, optionalConnection, closingMove } = options;

    if (milestoneContext.category === "family") {
      return recoveryMove || closingMove || null;
    }
    if (recoveryMove) {
      return recoveryMove;
    }
    if (milestoneContext.category !== "family" && optionalConnection) {
      return optionalConnection;
    }
    return closingMove || null;
  }

  function applyMissionBonuses(tasks, latestUpdate) {
    if (!latestUpdate) {
      return tasks;
    }

    const priorityByEvent = {
      "Family crisis": ["family", "connection", "reset"],
      "Work stress": ["money / work", "goal", "reset"],
      "New opportunity": ["goal", "money / work", "growth"],
      "Financial change": ["money / work", "goal", "reset"],
      "Health issue": ["health", "reset", "reflection"],
      "Travel / vacation": ["reset", "health", "connection"],
      "Major life change": ["reset", "reflection", "family"]
    };

    const preferred = priorityByEvent[latestUpdate.eventType] || [];
    return tasks
      .map((task, index) => ({
        ...task,
        score: 20 - index + (preferred.includes(task.category) ? 4 : 0)
      }))
      .sort((a, b) => b.score - a.score);
  }

  function dedupeMissionTasks(tasks) {
    const seen = new Set();
    return tasks.filter((task) => {
      const key = task.text.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function getFallbackPriority(context) {
    const { latestUpdate, profile } = context;
    if (latestUpdate?.eventType === "Family crisis") return "Family";
    if (latestUpdate?.eventType === "Health issue") return "Health";
    if (latestUpdate?.eventType === "Work stress" || latestUpdate?.eventType === "Financial change" || latestUpdate?.eventType === "New opportunity") return "Money / Work";
    if (profile.goalTitle) return "Growth";
    return "Peace / Reset";
  }

  function getRecentPerformanceSnapshot() {
    const recentKeys = [];
    for (let offset = 1; offset <= 5; offset += 1) {
      recentKeys.push(offsetDateKey(todayKey, -offset));
    }

    const stats = recentKeys
      .map((dateKey) => appState.performance[dateKey])
      .filter(Boolean);

    if (!stats.length) {
      return { completionRate: 0.65, winRate: 0.5, strongDays: 0 };
    }

    const completionRate = stats.reduce((sum, day) => sum + (day.completionPercentage || 0), 0) / stats.length;
    const winRate = stats.reduce((sum, day) => sum + (day.won ? 1 : 0), 0) / stats.length;
    const strongDays = stats.filter((day) => (day.completionPercentage || 0) >= 0.8 || day.won).length;

    return { completionRate, winRate, strongDays };
  }

  function getMissionTitle(context) {
    const { daily, latestUpdate } = context;
    const titles = {
      attack: "Push the right things forward.",
      progress: "Build a solid day you can trust.",
      stability: "Keep the day clear and useful.",
      protect: "Protect energy and handle what matters.",
      recovery: "Make the day gentler, not empty."
    };

    if (latestUpdate?.eventType === "Family crisis") {
      return "Lead the day with presence.";
    }
    if (latestUpdate?.eventType === "Health issue") {
      return "Protect your body and keep the day simple.";
    }
    if (latestUpdate?.eventType === "New opportunity") {
      return "Use today to turn momentum into traction.";
    }
    return titles[daily.mode];
  }

  function renderDashboard() {
    const { profile, daily } = getTodayContext();
    const mission = appState.missions[todayKey] || { title: "", subtitle: "", items: [] };

    elements.todayDate.textContent = formatDisplayDate(new Date());
    elements.streakCount.textContent = String(appState.streak || 0);
    elements.todayState.textContent = daily.state;
    elements.todayMode.textContent = daily.mode;
    elements.todaySummary.textContent = daily.coachResponse;
    elements.momentumStatus.textContent = getMomentumStatus(getTodayContext());

    elements.goalCardTitle.textContent = profile.goalTitle || "Your main mission";
    elements.goalWhyText.textContent = profile.why || "Clarity gets stronger when you keep returning to what matters.";
    elements.goalBaselineText.textContent = profile.baseline || "Not clear yet";
    elements.goalTargetText.textContent = profile.target || "Still taking shape";

    if (profile.timeline) {
      elements.goalTimelineChip.textContent = profile.timeline;
      elements.goalTimelineChip.classList.remove("hidden");
    } else {
      elements.goalTimelineChip.classList.add("hidden");
    }

    const progressPercent = calculateProgressSignal(profile);
    elements.progressLabel.textContent = progressPercent.label;
    elements.progressFill.style.width = `${progressPercent.value}%`;

    syncDailyPerformanceFromMission();
    syncRoadmap();
    saveState();
    const roadmap = appState.roadmap;
    const nextMilestone = profile.phaseMilestone || getFallbackMilestone(profile);
    elements.phaseCardTitle.textContent = profile.phaseName || roadmap[0].title;
    elements.phaseFocusText.textContent = profile.phaseFocus || profile.gap || "Choose the next useful thing and do it well";
    elements.phaseMilestoneText.textContent = nextMilestone;
    elements.phaseWhyText.textContent = profile.phaseWhy || getFallbackMilestoneReason(profile, nextMilestone);

    renderRoadmap(profile);
    elements.missionTitle.textContent = mission.title;
    elements.missionSubtitle.textContent = mission.subtitle;
    renderMissionItems(mission.items);
    renderMissionCompletionState(mission);

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

  function getFallbackMilestone(profile) {
    const goalText = `${profile.goalTitle} ${profile.target} ${profile.baseline}`.toLowerCase();

    // Keep fallback milestones tied to real-life areas without changing the stored shape.
    if (/(health|fit|fitness|workout|gym|weight|run|training|sleep)/.test(goalText)) {
      return "Build a consistent weekly workout routine";
    }
    if (/(money|work|income|career|job|business|client|sales|revenue|debt)/.test(goalText)) {
      return "Complete the next concrete move that creates opportunity";
    }
    if (/(family|marriage|kids|children|home|relationship)/.test(goalText)) {
      return "Create one repeatable habit that improves connection at home";
    }
    if (/(growth|learn|study|skill|discipline|habit)/.test(goalText)) {
      return "Build a repeatable action that moves you forward each week";
    }

    return "Complete the next concrete move that creates momentum";
  }

  function getFallbackMilestoneReason(profile, milestone) {
    if (profile.timeline) {
      return `Why this matters: it gives you a real checkpoint before ${profile.timeline}.`;
    }
    return `Why this matters: ${milestone.toLowerCase()} gives you a clear next target.`;
  }

  function renderMissionItems(items) {
    elements.missionList.innerHTML = "";
    items.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = `mission-item ${item.completed ? "is-complete" : ""}`;
      wrapper.innerHTML = `
        <input class="mission-check" type="checkbox" ${item.completed ? "checked" : ""} aria-label="Mark mission item complete">
        <div class="mission-meta">
          <span class="mission-tag">${item.category}</span>
          <textarea rows="3">${item.text}</textarea>
        </div>
        <span class="mission-encouragement hidden"></span>
      `;

      const checkbox = wrapper.querySelector(".mission-check");
      const textarea = wrapper.querySelector("textarea");
      const encouragement = wrapper.querySelector(".mission-encouragement");

      checkbox.addEventListener("change", () => {
        appState.missions[todayKey].items[index].completed = checkbox.checked;
        wrapper.classList.toggle("is-complete", checkbox.checked);
        saveState();
        syncDailyPerformanceFromMission();
        if (checkbox.checked) {
          triggerTaskCompletionFeedback(wrapper, encouragement);
        }
        renderMissionCompletionState(appState.missions[todayKey]);
      });

      textarea.addEventListener("input", () => {
        appState.missions[todayKey].items[index].text = textarea.value;
        saveState();
      });

      elements.missionList.appendChild(wrapper);
    });
  }

  function renderMissionCompletionState(mission) {
    const items = mission?.items || [];
    const completedCount = items.filter((item) => item.completed).length;
    const isComplete = items.length > 0 && completedCount === items.length;
    const wasComplete = elements.missionCard.classList.contains("mission-complete");

    elements.missionCard.classList.toggle("mission-complete", isComplete);
    elements.missionFeedback.classList.toggle("hidden", !isComplete);
    if (isComplete) {
      elements.missionFeedback.innerHTML = "<strong>Mission complete.</strong><span>You finished what mattered.</span>";
      if (!wasComplete) {
        pulseElement(elements.missionCard, "card-wave");
      }
    } else {
      elements.missionFeedback.innerHTML = "";
    }
  }

  function triggerTaskCompletionFeedback(wrapper, encouragement) {
    encouragement.textContent = TASK_FEEDBACK_MESSAGES[Math.floor(Math.random() * TASK_FEEDBACK_MESSAGES.length)];
    encouragement.classList.remove("hidden");
    wrapper.classList.add("task-pop");
    wrapper.classList.add("task-glow");

    window.setTimeout(() => {
      wrapper.classList.remove("task-pop");
      wrapper.classList.remove("task-glow");
    }, 900);

    window.setTimeout(() => {
      encouragement.classList.add("hidden");
      encouragement.textContent = "";
    }, 1400);
  }

  function syncDailyPerformanceFromMission() {
    // Track assigned/completed tasks by date so tomorrow's mission load can adapt.
    const mission = appState.missions[todayKey];
    if (!mission?.items?.length) {
      return;
    }

    const assigned = mission.items.length;
    const completed = mission.items.filter((item) => item.completed).length;
    appState.performance[todayKey] = {
      ...(appState.performance[todayKey] || {}),
      date: todayKey,
      assignedTasks: assigned,
      completedTasks: completed,
      completionPercentage: assigned ? completed / assigned : 0,
      loadLevel: mission.loadLevel || appState.performance[todayKey]?.loadLevel || "Standard",
      won: Boolean(appState.wins[todayKey]?.won),
      updatedAt: new Date().toISOString()
    };
  }

  function getMomentumStatus(context) {
    const snapshot = getRecentPerformanceSnapshot();
    const mode = context.daily.mode;

    if (mode === "attack" && snapshot.strongDays >= 3) return "Pressure is a privilege.";
    if (context.daily.state === "Locked In" && snapshot.completionRate >= 0.75) return "You're in rhythm.";
    if (context.daily.state === "Good" && snapshot.winRate >= 0.6) return "Momentum is building.";
    if (mode === "stability" && snapshot.completionRate >= 0.55) return "Stay steady.";
    if (mode === "protect") return "Protect the streak.";
    if (mode === "recovery") return "Rebuild the rhythm.";
    return "Keep the chain alive.";
  }

  function pulseElement(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => {
      element.classList.remove(className);
    }, 1200);
  }

  function calculateProgressSignal(profile) {
    let score = 12;
    if (profile.goalTitle) score += 10;
    if (profile.why) score += 12;
    if (profile.baseline) score += 7;
    if (profile.target) score += 10;
    if (profile.gap) score += 8;
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
      syncDailyPerformanceFromMission();
      if (appState.performance[todayKey]) {
        appState.performance[todayKey].won = true;
      }
      saveState();
      renderDashboard();
      pulseElement(elements.winCard, "win-celebration");
      pulseElement(elements.streakPill, "streak-bump");
      updateWinStatus(WIN_REWARD_MESSAGES[Math.floor(Math.random() * WIN_REWARD_MESSAGES.length)]);
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
    syncDailyPerformanceFromMission();
    if (appState.performance[todayKey]) {
      appState.performance[todayKey].won = false;
    }
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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
