// Life Execution V1
// Local-first personal operating system built with vanilla JavaScript.

(function () {
  const STORAGE_KEY = "lifeExecution.v1";
  const SIMULATED_DATE_STORAGE_KEY = "lifeExecution.dev.simulatedDate";
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

  const TIMELINE_ADVANCE_MESSAGES = [
    { title: "Milestone complete.", body: "You moved forward." },
    { title: "Path updated.", body: "The next milestone is now in focus." },
    { title: "Milestone complete.", body: "The line moved because you did." }
  ];

  const TIMELINE_GOAL_COMPLETE_MESSAGE = {
    title: "Goal complete.",
    body: "You built this."
  };

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
  let activeDateKey = getActiveDateKey();
  const flowState = {
    onboardingStep: 0,
    modalStep: 0,
    timelineSelectionId: "",
    pendingMilestoneAdvance: null
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
    openProfileBtn: document.getElementById("open-profile-btn"),
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
    goalsList: document.getElementById("goals-list"),
    addGoalBtn: document.getElementById("add-goal-btn"),
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
    devDateLabel: document.getElementById("dev-date-label"),
    devDateBadge: document.getElementById("dev-date-badge"),
    useRealDateBtn: document.getElementById("use-real-date-btn"),
    prevDayBtn: document.getElementById("prev-day-btn"),
    nextDayBtn: document.getElementById("next-day-btn"),
    streakPill: document.getElementById("streak-pill"),
    goalCard: document.getElementById("goal-card"),
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
    winCard: document.getElementById("win-card"),
    viewTimelineBtn: document.getElementById("view-timeline-btn"),
    timelineProgressPercent: document.getElementById("timeline-progress-percent"),
    timelineProgressCount: document.getElementById("timeline-progress-count"),
    timelineFeedback: document.getElementById("timeline-feedback"),
    timelineTrack: document.getElementById("timeline-track"),
    timelineDetailTitle: document.getElementById("timeline-detail-title"),
    timelineDetailText: document.getElementById("timeline-detail-text"),
    timelineDetailStatus: document.getElementById("timeline-detail-status"),
    timelineCompleteBtn: document.getElementById("timeline-complete-btn"),
    goalManagerForm: document.getElementById("goal-manager-form"),
    goalModalTitle: document.getElementById("goal-modal-title"),
    goalEditId: document.getElementById("goal-edit-id"),
    goalInputTitle: document.getElementById("goal-input-title"),
    goalInputWhy: document.getElementById("goal-input-why"),
    goalInputBaseline: document.getElementById("goal-input-baseline"),
    goalInputMilestone: document.getElementById("goal-input-milestone"),
    myProfileForm: document.getElementById("my-profile-form"),
    myProfileStatus: document.getElementById("my-profile-status"),
    addNextMilestoneBtn: document.getElementById("add-next-milestone-btn"),
    moveFinalGoalBtn: document.getElementById("move-final-goal-btn"),
    milestoneNextForm: document.getElementById("milestone-next-form"),
    milestoneNextChoice: document.getElementById("milestone-next-choice")
  };

  init();

  function init() {
    ensureStateShape();
    syncActiveDate();
    seedDailyQuote();
    renderStateButtons();
    renderPriorityOptions();
    renderEmotionOptions();
    renderDevDateControls();
    bindEvents();
    routeApp();
  }

  function ensureStateShape() {
    appState.profile = {
      ...createEmptyProfile(),
      ...(appState.profile || {})
    };
    appState.goals = Array.isArray(appState.goals) ? appState.goals : [];
    appState.primaryGoalId = appState.primaryGoalId || "";
    appState.userProfile = {
      ...createEmptyUserProfile(),
      ...(appState.userProfile || {})
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
    ensureGoalsState();
    syncMilestoneTimeline();
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
      milestones: [],
      milestoneSelectionId: "",
      goalCompletedAt: "",
      category: "",
      financialNotes: "",
      physicalNotes: "",
      familyNotes: "",
      spiritualNotes: "",
      strengths: "",
      obstacles: ""
    };
  }

  function createEmptyUserProfile() {
    return {
      jobRole: "",
      monthlyIncome: "",
      workDays: "",
      workHours: "",
      increaseIncome: "",
      moneyUrgency: "",
      relationshipStatus: "",
      hasChildren: "",
      childrenCount: "",
      familyResponsibility: "",
      familyPriority: "",
      fitnessLevel: "",
      limitations: "",
      limitationsNotes: "",
      healthGoal: "",
      energy: "",
      weekdayTime: "",
      weekendTime: "",
      bestTaskTime: "",
      sleepQuality: "",
      coachingStyle: "",
      stressHelp: "",
      taskStyle: "",
      moreInfo: ""
    };
  }

  function createGoalRecord(goal = {}) {
    const profile = {
      ...createEmptyProfile(),
      ...(goal.profile || goal.profileSnapshot || goal)
    };
    const title = (goal.title || profile.goalTitle || "").trim();
    const why = (goal.why || profile.why || "").trim();
    const baseline = (goal.baseline || profile.baseline || "").trim();
    const milestone = (goal.milestone || profile.phaseMilestone || "").trim();
    const timeline = (goal.timeline || profile.timeline || "").trim();
    const category = (goal.category || profile.category || inferGoalCategory({ title, milestone, baseline, profile })).trim();

    return {
      id: (goal.id || createId("goal")).trim(),
      title,
      why,
      baseline,
      milestone,
      timeline,
      category,
      isPrimary: Boolean(goal.isPrimary),
      profile: {
        ...profile,
        goalTitle: title,
        why,
        baseline,
        phaseMilestone: milestone,
        timeline,
        category
      }
    };
  }

  function buildGoalSignature(goalLike) {
    return [
      (goalLike?.title || goalLike?.goalTitle || "").trim().toLowerCase(),
      (goalLike?.why || "").trim().toLowerCase(),
      (goalLike?.baseline || "").trim().toLowerCase(),
      (goalLike?.milestone || goalLike?.phaseMilestone || "").trim().toLowerCase(),
      (goalLike?.timeline || "").trim().toLowerCase()
    ].join("|");
  }

  // Keep the saved goals collection separate from the dashboard's current primary goal.
  function ensureGoalsState() {
    const normalizedGoals = (Array.isArray(appState.goals) ? appState.goals : [])
      .map((goal) => createGoalRecord(goal))
      .filter((goal) => goal.title || goal.why || goal.baseline || goal.milestone);

    const profileHasGoal = hasMeaningfulProfileData(appState.profile);
    const profileGoal = profileHasGoal
      ? createGoalRecord({
        id: appState.primaryGoalId || createId("goal"),
        isPrimary: true,
        profile: appState.profile
      })
      : null;

    if (profileGoal) {
      const profileSignature = buildGoalSignature(profileGoal);
      const existingProfileGoal = normalizedGoals.find((goal) => buildGoalSignature(goal) === profileSignature);
      if (existingProfileGoal) {
        existingProfileGoal.isPrimary = true;
        if (!existingProfileGoal.profile || !hasMeaningfulProfileData(existingProfileGoal.profile)) {
          existingProfileGoal.profile = {
            ...createEmptyProfile(),
            ...appState.profile,
            goalTitle: existingProfileGoal.title,
            why: existingProfileGoal.why,
            baseline: existingProfileGoal.baseline,
            phaseMilestone: existingProfileGoal.milestone,
            timeline: existingProfileGoal.timeline,
            category: existingProfileGoal.category
          };
        }
      } else {
        normalizedGoals.unshift(profileGoal);
      }
    }

    if (!normalizedGoals.length) {
      appState.goals = [];
      appState.primaryGoalId = "";
      return;
    }

    let primaryGoal = normalizedGoals.find((goal) => goal.id === appState.primaryGoalId)
      || normalizedGoals.find((goal) => goal.isPrimary)
      || normalizedGoals[0];

    normalizedGoals.forEach((goal) => {
      goal.isPrimary = goal.id === primaryGoal.id;
    });

    appState.goals = normalizedGoals;
    appState.primaryGoalId = primaryGoal.id;
    syncProfileFromPrimaryGoal();
  }

  function getPrimaryGoal() {
    return appState.goals.find((goal) => goal.isPrimary) || appState.goals.find((goal) => goal.id === appState.primaryGoalId) || appState.goals[0] || null;
  }

  function getSupportingGoals() {
    return appState.goals.filter((goal) => !goal.isPrimary);
  }

  function syncProfileFromPrimaryGoal() {
    const primaryGoal = getPrimaryGoal();
    if (!primaryGoal) {
      return;
    }

    const primaryProfile = {
      ...createEmptyProfile(),
      ...(primaryGoal.profile || {})
    };
    primaryProfile.goalTitle = primaryGoal.title || primaryProfile.goalTitle;
    primaryProfile.why = primaryGoal.why || primaryProfile.why;
    primaryProfile.baseline = primaryGoal.baseline || primaryProfile.baseline;
    primaryProfile.phaseMilestone = primaryGoal.milestone || primaryProfile.phaseMilestone;
    primaryProfile.timeline = primaryGoal.timeline || primaryProfile.timeline;
    primaryProfile.category = primaryGoal.category || primaryProfile.category || inferGoalCategory(primaryGoal);
    appState.primaryGoalId = primaryGoal.id;
    appState.profile = primaryProfile;
  }

  function syncPrimaryGoalFromProfile() {
    const primaryGoal = getPrimaryGoal();
    if (!primaryGoal) {
      return;
    }

    primaryGoal.title = appState.profile.goalTitle || primaryGoal.title;
    primaryGoal.why = appState.profile.why || primaryGoal.why;
    primaryGoal.baseline = appState.profile.baseline || primaryGoal.baseline;
    primaryGoal.milestone = appState.profile.phaseMilestone || primaryGoal.milestone;
    primaryGoal.timeline = appState.profile.timeline || primaryGoal.timeline;
    primaryGoal.category = inferGoalCategory({
      title: primaryGoal.title,
      milestone: primaryGoal.milestone,
      baseline: primaryGoal.baseline,
      profile: appState.profile
    });
    primaryGoal.isPrimary = true;
    primaryGoal.profile = {
      ...createEmptyProfile(),
      ...appState.profile,
      goalTitle: primaryGoal.title,
      why: primaryGoal.why,
      baseline: primaryGoal.baseline,
      phaseMilestone: primaryGoal.milestone,
      timeline: primaryGoal.timeline,
      category: primaryGoal.category
    };

    appState.goals.forEach((goal) => {
      if (goal.id !== primaryGoal.id) {
        goal.isPrimary = false;
      }
    });
    appState.primaryGoalId = primaryGoal.id;
  }

  function createId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function inferGoalCategory(goal) {
    const text = `${goal?.title || ""} ${goal?.milestone || ""} ${goal?.baseline || ""} ${goal?.profile?.goalTitle || ""} ${goal?.profile?.target || ""}`.toLowerCase();
    if (/(health|fit|fitness|workout|gym|run|walk|sleep|train|meal|body)/.test(text)) return "health";
    if (/(family|home|marriage|kids|children|relationship|partner|parent)/.test(text)) return "family";
    if (/(money|income|budget|debt|revenue|sales|client|business|work|career|job|cash)/.test(text)) return "money";
    if (/(learn|study|skill|habit|discipline|growth|practice|read|write)/.test(text)) return "growth";
    return "goal";
  }

  function formatGoalCategory(category) {
    const labels = {
      goal: "Goal",
      health: "Health",
      family: "Family",
      money: "Money",
      growth: "Growth"
    };
    return labels[category] || "Goal";
  }

  function openGoalManager(goalId = "") {
    const goal = appState.goals.find((item) => item.id === goalId) || null;
    elements.goalModalTitle.textContent = goal ? "Edit Goal" : "Add Goal";
    elements.goalEditId.value = goal?.id || "";
    elements.goalInputTitle.value = goal?.title || "";
    elements.goalInputWhy.value = goal?.why || "";
    elements.goalInputBaseline.value = goal?.baseline || "";
    elements.goalInputMilestone.value = goal?.milestone || "";
    openModal("goal-manager-modal");
  }

  // Keep the current dashboard goal visible in "Your Goals" without changing the main goal logic.
  function ensureMainGoalInGoalsList() {
    if (!hasMeaningfulProfileData(appState.profile)) {
      return;
    }

    const mainGoalRecord = createGoalRecord({
      id: appState.primaryGoalId || createId("goal"),
      isPrimary: true,
      profile: appState.profile
    });
    const mainGoalSignature = buildGoalSignature(mainGoalRecord);
    const existingIndex = appState.goals.findIndex((goal) =>
      goal.id === appState.primaryGoalId || buildGoalSignature(goal) === mainGoalSignature
    );

    if (existingIndex >= 0) {
      appState.goals[existingIndex] = {
        ...createGoalRecord(appState.goals[existingIndex]),
        id: appState.goals[existingIndex].id || mainGoalRecord.id,
        isPrimary: appState.goals[existingIndex].id === appState.primaryGoalId,
        profile: {
          ...createEmptyProfile(),
          ...appState.profile
        }
      };
    } else {
      appState.goals.unshift(mainGoalRecord);
    }

    if (!appState.primaryGoalId) {
      const existingPrimary = appState.goals.find((goal) => goal.isPrimary);
      appState.primaryGoalId = existingPrimary?.id || mainGoalRecord.id;
    }

    appState.goals = appState.goals.map((goal) => ({
      ...goal,
      isPrimary: goal.id === appState.primaryGoalId
    }));
  }

  function saveGoalFromForm() {
    ensureMainGoalInGoalsList();
    const goalId = elements.goalEditId.value.trim();
    const goalData = {
      id: goalId || createId("goal"),
      title: elements.goalInputTitle.value.trim(),
      why: elements.goalInputWhy.value.trim(),
      baseline: elements.goalInputBaseline.value.trim(),
      milestone: elements.goalInputMilestone.value.trim()
    };

    if (!goalData.title || !goalData.why || !goalData.baseline) {
      return;
    }

    const existingIndex = appState.goals.findIndex((goal) => goal.id === goalId);
    const existingGoal = existingIndex >= 0 ? appState.goals[existingIndex] : null;
    const isPrimaryGoal = existingGoal ? existingGoal.isPrimary : false;
    const goalRecord = createGoalRecord({
      ...existingGoal,
      ...goalData,
      isPrimary: isPrimaryGoal,
      category: inferGoalCategory(goalData),
      profile: {
        ...createEmptyProfile(),
        ...(existingGoal?.profile || {}),
        goalTitle: goalData.title,
        why: goalData.why,
        baseline: goalData.baseline,
        phaseMilestone: goalData.milestone,
        timeline: existingGoal?.timeline || "",
        category: inferGoalCategory(goalData)
      }
    });

    if (existingIndex >= 0) {
      appState.goals[existingIndex] = goalRecord;
    } else {
      goalRecord.isPrimary = false;
      appState.goals.push(goalRecord);
    }

    if (!appState.primaryGoalId) {
      appState.primaryGoalId = goalRecord.id;
      goalRecord.isPrimary = true;
    }

    if (goalRecord.isPrimary) {
      appState.profile = {
        ...createEmptyProfile(),
        ...goalRecord.profile,
        category: goalRecord.category
      };
      syncDerivedProfileFields();
      syncPrimaryGoalFromProfile();
    }

    saveState();
    renderDashboard();
    elements.goalManagerForm.reset();
    closeModal("goal-manager-modal");
  }

  function setPrimaryGoal(goalId) {
    if (goalId === appState.primaryGoalId) {
      return;
    }

    syncPrimaryGoalFromProfile();
    appState.goals.forEach((goal) => {
      goal.isPrimary = goal.id === goalId;
    });
    appState.primaryGoalId = goalId;
    syncProfileFromPrimaryGoal();
    syncDerivedProfileFields();
    ensureMissionForToday(true);
    saveState();
    renderDashboard();
  }

  function renderGoalsList() {
    ensureMainGoalInGoalsList();
    elements.goalsList.innerHTML = "";

    if (!appState.goals.length) {
      elements.goalsList.innerHTML = "<div class=\"goal-item\"><p class=\"muted\">Add a goal to start balancing your mission across more than one life area.</p></div>";
      return;
    }

    const orderedGoals = [...appState.goals].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
    orderedGoals.forEach((goal) => {
      const isPrimary = goal.isPrimary;
      const item = document.createElement("article");
      item.className = `goal-item${isPrimary ? " is-primary" : ""}`;
      item.innerHTML = `
        <div class="goal-item-head">
          <div>
            <p class="card-label">${isPrimary ? "Primary Goal" : "Supporting Goal"}</p>
            <h3>${escapeHtml(goal.title || "Untitled goal")}</h3>
          </div>
          <span class="mission-tag">${escapeHtml(formatGoalCategory(goal.category || inferGoalCategory(goal)))}</span>
        </div>
        <div class="goal-item-body">
          <p class="muted">${escapeHtml(goal.why || "Keep the reason visible.")}</p>
          <div class="goal-mini-grid">
            <div>
              <span class="mini-label">Baseline</span>
              <strong>${escapeHtml(goal.baseline || "Not set")}</strong>
            </div>
            <div>
              <span class="mini-label">Milestone</span>
              <strong>${escapeHtml(goal.milestone || "Optional")}</strong>
            </div>
          </div>
        </div>
        <div class="goal-item-actions">
          <button class="btn btn-secondary" type="button" data-edit-goal="${goal.id}">Edit</button>
          ${isPrimary ? '<span class="chip">Primary Goal</span>' : `<button class="btn btn-ghost" type="button" data-set-primary="${goal.id}">Set as Primary</button>`}
        </div>
      `;

      const editButton = item.querySelector("[data-edit-goal]");
      editButton.addEventListener("click", () => openGoalManager(goal.id));

      const setPrimaryButton = item.querySelector("[data-set-primary]");
      if (setPrimaryButton) {
        setPrimaryButton.addEventListener("click", () => setPrimaryGoal(goal.id));
      }

      elements.goalsList.appendChild(item);
    });
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

  function fillUserProfileForm() {
    if (!elements.myProfileForm) {
      return;
    }

    const profile = {
      ...createEmptyUserProfile(),
      ...(appState.userProfile || {})
    };

    Array.from(elements.myProfileForm.elements).forEach((field) => {
      if (!field.name) {
        return;
      }
      field.value = profile[field.name] ?? "";
    });

    elements.myProfileStatus.classList.add("hidden");
    elements.myProfileStatus.textContent = "Profile saved.";
  }

  function saveUserProfile(event) {
    event.preventDefault();
    const formData = new FormData(elements.myProfileForm);
    const nextProfile = createEmptyUserProfile();

    Object.keys(nextProfile).forEach((key) => {
      nextProfile[key] = (formData.get(key) || "").toString().trim();
    });

    appState.userProfile = nextProfile;
    saveState();
    elements.myProfileStatus.textContent = "Profile saved.";
    elements.myProfileStatus.classList.remove("hidden");
  }

  // The app runs on the active app date, which is real by default and simulated only in dev mode.
  function syncActiveDate() {
    activeDateKey = getActiveDateKey();
  }

  function getActiveDateKey() {
    const simulated = localStorage.getItem(SIMULATED_DATE_STORAGE_KEY);
    return simulated || getRealTodayKey();
  }

  function getRealTodayKey() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function isUsingSimulatedDate() {
    return Boolean(localStorage.getItem(SIMULATED_DATE_STORAGE_KEY));
  }

  function setSimulatedDate(dateKey) {
    localStorage.setItem(SIMULATED_DATE_STORAGE_KEY, dateKey);
    handleAppDateChange();
  }

  function clearSimulatedDate() {
    localStorage.removeItem(SIMULATED_DATE_STORAGE_KEY);
    handleAppDateChange();
  }

  function handleAppDateChange() {
    syncActiveDate();
    seedDailyQuote();
    renderDevDateControls();
    routeApp();
  }

  function renderDevDateControls() {
    elements.devDateLabel.textContent = formatDisplayDate(new Date(`${activeDateKey}T12:00:00`));
    elements.devDateBadge.classList.toggle("hidden", !isUsingSimulatedDate());
  }

  function getActiveDateTimestamp() {
    return new Date(`${activeDateKey}T12:00:00`).toISOString();
  }

  function routeApp() {
    const hasProfile = hasCompletedProfile();
    const completedOpening = Boolean(appState.daily[activeDateKey]?.state);

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
    const quoteIndex = deterministicIndex(activeDateKey, QUOTES.length);
    appState.meta.dailyQuoteDate = activeDateKey;
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
    const today = appState.daily[activeDateKey];
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
    const priority = appState.daily[activeDateKey]?.priority || "";
    appState.daily[activeDateKey] = {
      date: activeDateKey,
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
    if (!appState.daily[activeDateKey]) {
      return;
    }

    appState.daily[activeDateKey].priority = priority;
    appState.daily[activeDateKey].updatedAt = new Date().toISOString();
    saveState();
    selectButton(elements.priorityOptions, priority);
  }

  function clearDailyPriority() {
    if (!appState.daily[activeDateKey]) {
      return;
    }

    appState.daily[activeDateKey].priority = "";
    appState.daily[activeDateKey].updatedAt = new Date().toISOString();
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
    elements.openProfileBtn.addEventListener("click", () => {
      fillUserProfileForm();
      openModal("my-profile-modal");
    });
    elements.viewTimelineBtn.addEventListener("click", () => {
      renderTimeline();
      openModal("timeline-modal");
    });
    elements.addGoalBtn.addEventListener("click", () => openGoalManager());
    elements.useRealDateBtn.addEventListener("click", clearSimulatedDate);
    elements.prevDayBtn.addEventListener("click", () => {
      setSimulatedDate(offsetDateKey(activeDateKey, -1));
    });
    elements.nextDayBtn.addEventListener("click", () => {
      setSimulatedDate(offsetDateKey(activeDateKey, 1));
    });

    elements.lifeUpdateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveLifeUpdate();
      ensureMissionForToday(true);
      renderDashboard();
      elements.lifeUpdateForm.reset();
      renderEmotionOptions();
      closeModal("life-update-modal");
    });

    elements.goalManagerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveGoalFromForm();
    });
    elements.myProfileForm.addEventListener("submit", saveUserProfile);
    elements.addNextMilestoneBtn.addEventListener("click", () => {
      elements.milestoneNextChoice.classList.add("hidden");
      elements.milestoneNextForm.classList.remove("hidden");
    });
    elements.moveFinalGoalBtn.addEventListener("click", moveToFinalGoalTarget);
    elements.milestoneNextForm.addEventListener("submit", saveNextMilestoneFromPrompt);

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
    elements.timelineCompleteBtn.addEventListener("click", completeCurrentMilestone);
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
    const placeholder = getClarityPlaceholder(step);
    return `
      <div class="field-group">
        <label for="${fieldId}" class="sr-only">${step.question}</label>
        <textarea id="${fieldId}" data-flow-field="true" rows="5" maxlength="220" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>
      </div>
    `;
  }

  function getClarityPlaceholder(step) {
    if (step.key === "phaseMilestone") {
      return getFallbackMilestone(appState.profile);
    }
    return step.placeholder || "";
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
    if (key === "phaseMilestone") {
      const value = appState.profile.phaseMilestone || "";
      return value === getFallbackMilestone(appState.profile) ? "" : value;
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
    syncPrimaryGoalFromProfile();
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
    appState.profile.category = inferGoalCategory({
      title: appState.profile.goalTitle,
      milestone: appState.profile.phaseMilestone,
      profile: appState.profile
    });
    syncMilestoneTimeline();
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
    localStorage.removeItem(SIMULATED_DATE_STORAGE_KEY);
    window.location.reload();
  }

  function syncRoadmap() {
    appState.roadmap = generateRoadmap(appState.profile);
  }

  // Keep the new timeline data synced with the legacy milestone fields.
  function syncMilestoneTimeline() {
    const profile = appState.profile;
    const existing = Array.isArray(profile.milestones) ? profile.milestones : [];
    let milestones = existing
      .map((milestone, index) => normalizeMilestone(milestone, index))
      .filter((milestone) => milestone.label);

    if (!milestones.length) {
      milestones = buildDefaultMilestones(profile);
    }

    const currentIndex = milestones.findIndex((milestone) => !milestone.completedAt);
    const activeIndex = currentIndex === -1 ? Math.max(milestones.length - 1, 0) : currentIndex;
    let activeMilestone = milestones[activeIndex];

    if (activeMilestone && profile.phaseMilestone && activeMilestone.label !== profile.phaseMilestone) {
      milestones[activeIndex] = {
        ...activeMilestone,
        label: profile.phaseMilestone,
        detail: activeMilestone.detail || profile.phaseWhy || getFallbackMilestoneReason(profile, profile.phaseMilestone)
      };
      activeMilestone = milestones[activeIndex];
    }

    if (activeMilestone && !activeMilestone.completedAt && profile.phaseWhy) {
      milestones[activeIndex] = {
        ...activeMilestone,
        detail: profile.phaseWhy
      };
      activeMilestone = milestones[activeIndex];
    }

    profile.milestones = milestones;
    profile.milestoneSelectionId = profile.milestoneSelectionId || activeMilestone?.id || "";
    profile.phaseMilestone = activeMilestone?.label || profile.phaseMilestone || getFallbackMilestone(profile);
  }

  function normalizeMilestone(milestone, index) {
    return {
      id: (milestone?.id || `milestone-${index + 1}`).toString(),
      label: (milestone?.label || milestone?.title || "").toString().trim(),
      detail: (milestone?.detail || "").toString().trim(),
      completedAt: milestone?.completedAt || null
    };
  }

  function buildDefaultMilestones(profile) {
    const currentLabel = profile.phaseMilestone || getFallbackMilestone(profile);
    const goalLabel = profile.goalTitle || "your goal";
    const timelineLabel = profile.timeline || "your timing";

    return [
      {
        id: "milestone-1",
        label: currentLabel,
        detail: profile.phaseWhy || getFallbackMilestoneReason(profile, currentLabel),
        completedAt: null
      },
      {
        id: "milestone-2",
        label: profile.timeline ? `Land it by ${shortLabel(timelineLabel, 34)}` : `Complete ${shortLabel(goalLabel, 42)}`,
        detail: profile.timeline
          ? `Carry the work across the finish line so the goal is real by ${profile.timeline}.`
          : `Finish the path and make ${goalLabel} real.`,
        completedAt: null
      }
    ];
  }

  function getMilestones(profile) {
    const milestones = Array.isArray(profile?.milestones) ? profile.milestones : [];
    return milestones.length ? milestones : buildDefaultMilestones(profile || appState.profile);
  }

  function getCurrentMilestone(profile) {
    const milestones = getMilestones(profile || appState.profile);
    return milestones.find((milestone) => !milestone.completedAt) || milestones[milestones.length - 1] || null;
  }

  function getSelectedMilestone(profile) {
    const milestones = getMilestones(profile || appState.profile);
    const selectedId = (profile || appState.profile).milestoneSelectionId || flowState.timelineSelectionId;
    return milestones.find((milestone) => milestone.id === selectedId) || getCurrentMilestone(profile);
  }

  function getTimelineProgress(profile) {
    const milestones = getMilestones(profile || appState.profile);
    const total = milestones.length;
    const completed = milestones.filter((milestone) => milestone.completedAt).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }

  function getTimelineNodeState(milestone, currentMilestone) {
    if (milestone.completedAt) return "complete";
    if (currentMilestone && milestone.id === currentMilestone.id) return "current";
    return "future";
  }

  function getMilestoneDetail(milestone, profile) {
    if (!milestone) {
      return "Milestone details will appear here.";
    }
    if (milestone.detail) {
      return milestone.detail;
    }
    return profile.phaseWhy || getFallbackMilestoneReason(profile, milestone.label);
  }

  function shortLabel(value, limit) {
    const text = (value || "").toString().trim();
    if (text.length <= limit) {
      return text;
    }
    return `${text.slice(0, limit - 1).trim()}...`;
  }

  // Render the horizontal timeline and keep the detail panel in sync.
  function renderTimeline() {
    syncMilestoneTimeline();
    const profile = appState.profile;
    const milestones = getMilestones(profile);
    const currentMilestone = getCurrentMilestone(profile);
    const selectedMilestone = getSelectedMilestone(profile);
    const progress = getTimelineProgress(profile);
    const previousProgress = Number(elements.timelineTrack.dataset.progress || 0);

    elements.timelineProgressPercent.textContent = `${progress.percent}%`;
    elements.timelineProgressCount.textContent = `${progress.completed} of ${progress.total} complete`;
    elements.timelineTrack.innerHTML = "";

    milestones.forEach((milestone, index) => {
      const state = getTimelineNodeState(milestone, currentMilestone);
      const isSelected = selectedMilestone && milestone.id === selectedMilestone.id;
      const node = document.createElement("div");
      node.className = `timeline-node is-${state}${isSelected ? " is-selected" : ""}`;
      node.innerHTML = `
        <button class="timeline-node-button" type="button" aria-label="${escapeHtml(milestone.label)}">
          ${milestone.completedAt ? '<span class="timeline-node-check">&#10003;</span>' : `<span>${index + 1}</span>`}
        </button>
        <span class="timeline-node-label">${escapeHtml(shortLabel(milestone.label, 26))}</span>
      `;

      node.querySelector(".timeline-node-button").addEventListener("click", () => {
        selectTimelineMilestone(milestone.id);
      });

      elements.timelineTrack.appendChild(node);
    });

    elements.timelineTrack.style.setProperty("--timeline-progress", previousProgress);
    window.requestAnimationFrame(() => {
      const nextProgress = progress.percent / 100;
      elements.timelineTrack.style.setProperty("--timeline-progress", nextProgress);
      elements.timelineTrack.dataset.progress = String(nextProgress);
    });

    renderTimelineDetail();
  }

  function renderTimelineDetail() {
    const profile = appState.profile;
    const selectedMilestone = getSelectedMilestone(profile);
    const currentMilestone = getCurrentMilestone(profile);
    const isCurrent = Boolean(
      selectedMilestone &&
      currentMilestone &&
      selectedMilestone.id === currentMilestone.id &&
      !selectedMilestone.completedAt
    );

    elements.timelineDetailTitle.textContent = selectedMilestone?.label || "No milestone selected";
    elements.timelineDetailText.textContent = getMilestoneDetail(selectedMilestone, profile);
    elements.timelineDetailStatus.textContent = selectedMilestone?.completedAt ? "Completed" : isCurrent ? "Current" : "Upcoming";
    elements.timelineDetailStatus.classList.toggle("hidden", !selectedMilestone);
    elements.timelineCompleteBtn.classList.toggle("hidden", !isCurrent);
  }

  function selectTimelineMilestone(milestoneId) {
    appState.profile.milestoneSelectionId = milestoneId;
    flowState.timelineSelectionId = milestoneId;
    syncPrimaryGoalFromProfile();
    saveState();
    renderTimeline();
  }

  // Complete the active milestone, advance focus, and preserve existing profile compatibility.
  function completeCurrentMilestone() {
    syncMilestoneTimeline();
    const profile = appState.profile;
    const milestones = getMilestones(profile).map((milestone) => ({ ...milestone }));
    const currentIndex = milestones.findIndex((milestone) => !milestone.completedAt);
    if (currentIndex === -1) {
      return;
    }

    if (!window.confirm("Complete this milestone?")) {
      return;
    }

    milestones[currentIndex].completedAt = getActiveDateTimestamp();
    const isFinalMilestone = currentIndex === milestones.length - 1;
    const nextMilestone = milestones[currentIndex + 1] || milestones[currentIndex];

    profile.milestones = milestones;
    profile.milestoneSelectionId = nextMilestone.id;
    profile.phaseMilestone = nextMilestone.label;
    if (isFinalMilestone) {
      profile.goalCompletedAt = getActiveDateTimestamp();
    } else {
      profile.goalCompletedAt = "";
    }

    syncPrimaryGoalFromProfile();
    saveState();
    renderDashboard();
    renderTimeline();
    pulseElement(elements.timelineCompleteBtn.closest(".timeline-detail"), "timeline-complete-pop");

    if (isFinalMilestone) {
      showTimelineFeedback(TIMELINE_GOAL_COMPLETE_MESSAGE.title, TIMELINE_GOAL_COMPLETE_MESSAGE.body);
      pulseElement(elements.goalCard, "goal-card-complete");
      return;
    }

    showTimelineFeedback("Milestone complete.", "What's next?");
    openMilestoneAdvancePrompt();
  }

  function openMilestoneAdvancePrompt() {
    flowState.pendingMilestoneAdvance = {
      profileId: appState.primaryGoalId || "primary",
      finalMilestoneId: getMilestones(appState.profile)[getMilestones(appState.profile).length - 1]?.id || ""
    };
    elements.milestoneNextChoice.classList.remove("hidden");
    elements.milestoneNextForm.classList.add("hidden");
    elements.milestoneNextForm.reset();
    openModal("milestone-next-modal");
  }

  function moveToFinalGoalTarget() {
    flowState.pendingMilestoneAdvance = null;
    closeModal("milestone-next-modal");
    renderDashboard();
    renderTimeline();
  }

  function saveNextMilestoneFromPrompt(event) {
    event.preventDefault();
    const formData = new FormData(elements.milestoneNextForm);
    const title = (formData.get("title") || "").toString().trim();
    const why = (formData.get("why") || "").toString().trim();
    if (!title) {
      return;
    }

    const profile = appState.profile;
    const milestones = getMilestones(profile).map((milestone) => ({ ...milestone }));
    const finalIndex = milestones.length - 1;
    const finalMilestone = milestones[finalIndex];
    const nextMilestone = {
      id: createId("milestone"),
      label: title,
      detail: why,
      completedAt: null
    };

    milestones.splice(Math.max(finalIndex, 0), 0, nextMilestone);
    profile.milestones = milestones;
    profile.milestoneSelectionId = nextMilestone.id;
    profile.phaseMilestone = nextMilestone.label;
    if (why) {
      profile.phaseWhy = why;
    }
    if (finalMilestone?.id === profile.milestoneSelectionId) {
      profile.milestoneSelectionId = nextMilestone.id;
    }

    syncPrimaryGoalFromProfile();
    saveState();
    closeModal("milestone-next-modal");
    renderDashboard();
    renderTimeline();
    showTimelineFeedback("Path updated.", "The next real milestone is now in focus.");
  }

  function showTimelineFeedback(title, body) {
    elements.timelineFeedback.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;
    elements.timelineFeedback.classList.remove("hidden");
    window.clearTimeout(showTimelineFeedback.timeoutId);
    showTimelineFeedback.timeoutId = window.setTimeout(() => {
      elements.timelineFeedback.classList.add("hidden");
      elements.timelineFeedback.innerHTML = "";
    }, 2200);
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
    const primaryGoal = getPrimaryGoal();
    const supportingGoals = getSupportingGoals();
    const daily = appState.daily[activeDateKey] || { state: "Neutral", mode: "stability", coachResponse: STATE_RESPONSES.Neutral };
    const latestUpdate = appState.lifeUpdates[0] || null;
    const infoScore = Object.values(profile).filter(Boolean).length;
    const lowInfo = infoScore <= 2;
    return { profile, daily, latestUpdate, infoScore, lowInfo, primaryGoal, supportingGoals };
  }

  function ensureMissionForToday(forceRegenerate) {
    if (!appState.daily[activeDateKey]) {
      return;
    }

    if (!forceRegenerate && appState.missions[activeDateKey]?.items?.length) {
      return;
    }

    const context = getTodayContext();
    const plan = generateMissionPlan(context);
    appState.missions[activeDateKey] = {
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
        id: `${activeDateKey}-${index + 1}`,
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
      Light: { level: "Light", count: 3, primaryCount: 2, includeReset: true },
      Standard: { level: "Standard", count: 4, primaryCount: 3, includeReset: mode === "protect" || mode === "recovery" },
      Heavy: { level: "Heavy", count: 5, primaryCount: 4, includeReset: true },
      Peak: { level: "Peak", count: 6, primaryCount: 4, includeReset: true }
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
    const { primaryGoal, supportingGoals, latestUpdate } = context;
    const primaryTasks = buildPrimaryGoalMissionTasks(context, loadProfile, primaryGoal);
    const supportTasks = supportingGoals.map((goal) => buildSupportingGoalTask(goal, context)).filter(Boolean);
    const tasks = [...primaryTasks, ...supportTasks];

    return dedupeMissionTasks(applyMissionBonuses(tasks, latestUpdate));
  }

  // Build a realistic daily stack: most energy goes to the primary goal, while supporting goals get one clear move.
  function buildPrimaryGoalMissionTasks(context, loadProfile, primaryGoal) {
    const goal = primaryGoal || createGoalRecord({ profile: context.profile });
    const milestoneContext = getMilestoneContext(context);
    const tasks = [];

    tasks.push({
      category: inferGoalCategory(goal),
      role: "main",
      text: buildMilestoneMainTask(milestoneContext, context.daily.mode)
    });

    const followUps = buildSpecificGoalFollowUps(goal, context, milestoneContext);
    return dedupeMissionTasks([
      ...tasks,
      ...followUps.slice(0, Math.max(loadProfile.primaryCount - 1, 1)).map((task) => ({
        ...task,
        role: "support"
      }))
    ]).slice(0, loadProfile.primaryCount);
  }

  function buildSpecificGoalFollowUps(goal, context, milestoneContext) {
    const mode = context.daily.mode;
    const category = inferGoalCategory(goal);
    const title = goal.title || context.profile.goalTitle || "your main goal";
    const milestone = goal.milestone || context.profile.phaseMilestone || getFallbackMilestone(context.profile);
    const baseline = goal.baseline || context.profile.baseline || "today's baseline";
    const taskMap = {
      goal: [
        `Write the exact deliverable that proves progress on "${shortLabel(milestone, 48)}" before your first work block ends.`,
        `Spend ${mode === "attack" ? "30" : mode === "recovery" ? "10" : "20"} minutes improving one visible part of ${shortLabel(title, 52)}.`,
        `Review what is still stuck in ${shortLabel(baseline, 44)} and remove one blocker today.`
      ],
      health: [
        `Prepare the gear, food, or recovery step that makes "${shortLabel(milestone, 44)}" easier to repeat tomorrow.`,
        `Log the result of today's health move before bed so the trend stays visible.`,
        `Protect your next meal, workout, or sleep block from one distraction today.`
      ],
      family: [
        `Decide the exact time for today's family move tied to "${shortLabel(milestone, 44)}".`,
        `Send one clear message that lowers friction at home before dinner.`,
        `Reset one small part of home so the goal feels easier to sustain tonight.`
      ],
      money: [
        `Define the single money move that would improve "${shortLabel(milestone, 44)}" by tonight.`,
        `Track one number tied to ${shortLabel(title, 40)} before you stop working.`,
        `Finish one follow-up that keeps income or opportunity moving today.`
      ],
      growth: [
        `Practice the exact skill tied to "${shortLabel(milestone, 44)}" for ${mode === "attack" ? "25" : "15"} minutes.`,
        `Capture one lesson from today's work on ${shortLabel(title, 44)} before bed.`,
        `Prepare the next repeatable rep for this goal tonight.`
      ]
    };

    return (taskMap[category] || taskMap.goal).map((text) => ({ category, text }));
  }

  function buildSupportingGoalTask(goal, context) {
    const category = inferGoalCategory(goal);
    const title = goal.title || "this goal";
    const milestone = goal.milestone || "";
    const mode = context.daily.mode;
    const baseline = goal.baseline || "where this goal stands now";

    const taskByCategory = {
      goal: milestone
        ? `Move "${shortLabel(milestone, 50)}" forward with one 15-minute block today.`
        : `Finish one concrete step that improves ${shortLabel(title, 48)} today.`,
      health: milestone
        ? `Complete one health action that directly supports "${shortLabel(milestone, 46)}" today.`
        : `Do one health action that makes ${shortLabel(title, 46)} more consistent today.`,
      family: milestone
        ? `Take one family action that moves "${shortLabel(milestone, 46)}" forward today.`
        : `Create one calm moment that supports ${shortLabel(title, 46)} today.`,
      money: milestone
        ? `Complete one money task that advances "${shortLabel(milestone, 46)}" today.`
        : `Handle one money move that improves ${shortLabel(title, 46)} today.`,
      growth: milestone
        ? `Do one focused rep that supports "${shortLabel(milestone, 46)}" today.`
        : `Practice one repeatable action that improves ${shortLabel(title, 46)} today.`
    };

    const intensityHint = mode === "recovery"
      ? "Keep it small and clean."
      : mode === "attack"
        ? "Finish it before the day gets noisy."
        : "Make it visible before bed.";

    return {
      category,
      role: "support",
      text: `${taskByCategory[category] || taskByCategory.goal} ${intensityHint}`,
      baseline
    };
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
    const text = ((getCurrentMilestone(profile)?.label || profile.phaseMilestone || getFallbackMilestone(profile) || "")).toLowerCase();

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
      "Work stress": ["money", "goal", "reset"],
      "New opportunity": ["goal", "money", "growth"],
      "Financial change": ["money", "goal", "reset"],
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
      recentKeys.push(offsetDateKey(activeDateKey, -offset));
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
    const mission = appState.missions[activeDateKey] || { title: "", subtitle: "", items: [] };
    syncMilestoneTimeline();
    const currentMilestone = getCurrentMilestone(profile);
    const timelineProgress = getTimelineProgress(profile);

    elements.todayDate.textContent = formatDisplayDate(new Date(`${activeDateKey}T12:00:00`));
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
    elements.progressLabel.textContent = profile.goalCompletedAt ? "Goal complete" : progressPercent.label;
    elements.progressFill.style.width = `${progressPercent.value}%`;
    elements.goalCard.classList.toggle("goal-card-complete", Boolean(profile.goalCompletedAt));

    syncDailyPerformanceFromMission();
    syncRoadmap();
    saveState();
    const roadmap = appState.roadmap;
    const nextMilestone = currentMilestone?.label || profile.phaseMilestone || getFallbackMilestone(profile);
    elements.phaseCardTitle.textContent = profile.phaseName || roadmap[0].title;
    elements.phaseFocusText.textContent = profile.phaseFocus || profile.gap || "Choose the next useful thing and do it well";
    elements.phaseMilestoneText.textContent = nextMilestone;
    elements.phaseWhyText.textContent = getMilestoneDetail(currentMilestone, profile);
    elements.viewTimelineBtn.textContent = `View Timeline (${timelineProgress.percent}%)`;

    renderGoalsList();
    renderRoadmap(profile);
    elements.missionTitle.textContent = mission.title;
    elements.missionSubtitle.textContent = mission.subtitle;
    renderMissionItems(mission.items);
    renderMissionCompletionState(mission);

    elements.totalWins.textContent = String(appState.totalWins || 0);
    elements.historyPhase.textContent = profile.phaseName || roadmap[0].title;
    elements.historyMode.textContent = daily.mode;
    renderWinHistory();

    elements.reflectionText.value = appState.reflections[activeDateKey] || "";
    updateWinStatus();
    if (!document.getElementById("timeline-modal")?.classList.contains("hidden")) {
      renderTimeline();
    }
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
        appState.missions[activeDateKey].items[index].completed = checkbox.checked;
        wrapper.classList.toggle("is-complete", checkbox.checked);
        saveState();
        syncDailyPerformanceFromMission();
        if (checkbox.checked) {
          triggerTaskCompletionFeedback(wrapper, encouragement);
        }
        renderMissionCompletionState(appState.missions[activeDateKey]);
      });

      textarea.addEventListener("input", () => {
        appState.missions[activeDateKey].items[index].text = textarea.value;
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
    const mission = appState.missions[activeDateKey];
    if (!mission?.items?.length) {
      return;
    }

    const assigned = mission.items.length;
    const completed = mission.items.filter((item) => item.completed).length;
    appState.performance[activeDateKey] = {
      ...(appState.performance[activeDateKey] || {}),
      date: activeDateKey,
      assignedTasks: assigned,
      completedTasks: completed,
      completionPercentage: assigned ? completed / assigned : 0,
      loadLevel: mission.loadLevel || appState.performance[activeDateKey]?.loadLevel || "Standard",
      won: Boolean(appState.wins[activeDateKey]?.won),
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
    appState.reflections[activeDateKey] = elements.reflectionText.value.trim();
    saveState();
    elements.saveReflectionBtn.textContent = "Saved";
    window.setTimeout(() => {
      elements.saveReflectionBtn.textContent = "Save Reflection";
    }, 1200);
  }

  function recordWin(won) {
    const existing = appState.wins[activeDateKey];

    if (won) {
      if (existing?.won) {
        updateWinStatus("Today's win is already recorded.");
        return;
      }

      const yesterdayKey = offsetDateKey(activeDateKey, -1);
      appState.wins[activeDateKey] = {
        date: activeDateKey,
        won: true,
        updatedAt: new Date().toISOString()
      };

      if (appState.lastWinDate === yesterdayKey) {
        appState.streak += 1;
      } else {
        appState.streak = 1;
      }

      appState.lastWinDate = activeDateKey;
      appState.totalWins += 1;
      syncDailyPerformanceFromMission();
      if (appState.performance[activeDateKey]) {
        appState.performance[activeDateKey].won = true;
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

    appState.wins[activeDateKey] = {
      date: activeDateKey,
      won: false,
      updatedAt: new Date().toISOString()
    };
    syncDailyPerformanceFromMission();
    if (appState.performance[activeDateKey]) {
      appState.performance[activeDateKey].won = false;
    }
    saveState();
    updateWinStatus("Day still open. You can come back and claim it later.");
    renderWinHistory();
  }

  function updateWinStatus(message) {
    const todayWin = appState.wins[activeDateKey];
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
      const dateKey = offsetDateKey(activeDateKey, -offset);
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
    if (id === "my-profile-modal") {
      fillUserProfileForm();
    }
    if (id === "timeline-modal") {
      renderTimeline();
    }
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
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
