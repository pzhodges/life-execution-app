// Life Execution V5.3
// Local-first personal operating system built with vanilla JavaScript.

(function () {
  const DEBUG = false;
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

  const GOAL_COMPLETION_LINES = [
    "You did what most people won't.",
    "You followed through.",
    "This is earned.",
    "You built this.",
    "You stayed with it long enough to become it."
  ];

  const GOAL_COMPLETION_SECONDARY_LINE = "Take a second. This matters.";
  const AI_MILESTONE_ROUTE = "/api/suggest-next-milestone";
  const AI_ROADMAP_ROUTE = "/api/generate-roadmap";
  const AI_MISSION_ROUTE = "/api/generate-daily-mission";

  function debugLog(...args) {
    if (DEBUG) {
      console.log(...args);
    }
  }

  const CLARITY_STEPS = [
    {
      key: "goalTitle",
      question: "What are you working toward?",
      hint: "Name the main thing you want to move forward.",
      placeholder: "Build my business, get financially stable, get back in shape",
      type: "textarea"
    },
    {
      key: "why",
      question: "Why does this matter right now?",
      hint: "Keep it human. Short is fine.",
      placeholder: "I need stability, I want to show up for my family, I'm tired of drifting",
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
      key: "target",
      question: "What does success look like?",
      hint: "Describe the result in plain language.",
      placeholder: "Consistent income, stronger health, a finished launch",
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
      key: "contextNotes",
      question: "Any optional context worth knowing?",
      hint: "Share anything that should shape the plan, or skip it.",
      placeholder: "Time limits, family pressure, money urgency, energy, schedule, or constraints",
      type: "textarea"
    }
  ];

  const appState = loadState();
  let activeDateKey = getActiveDateKey();
  const flowState = {
    onboardingStep: 0,
    modalStep: 0,
    timelineSelectionId: "",
    pendingMilestoneAdvance: null,
    pendingRoadmapApproval: null,
    selectedCompletedGoalId: "",
    goalCelebration: null
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
    missionMetaRow: document.getElementById("mission-meta-row"),
    missionPlanStatus: document.getElementById("mission-plan-status"),
    missionLoadChip: document.getElementById("mission-load-chip"),
    missionEstimateChip: document.getElementById("mission-estimate-chip"),
    missionFeedback: document.getElementById("mission-feedback"),
    roadmapList: document.getElementById("roadmap-list"),
    goalsList: document.getElementById("goals-list"),
    completedGoalsBtn: document.getElementById("completed-goals-btn"),
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
    milestoneNextEyebrow: document.getElementById("milestone-next-eyebrow"),
    milestoneNextTitle: document.getElementById("milestone-next-title"),
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
    myProfileForm: document.getElementById("my-profile-form"),
    myProfileStatus: document.getElementById("my-profile-status"),
    acceptMilestoneBtn: document.getElementById("accept-milestone-btn"),
    editMilestoneBtn: document.getElementById("edit-milestone-btn"),
    cancelEditMilestoneBtn: document.getElementById("cancel-edit-milestone-btn"),
    moveFinalGoalBtn: document.getElementById("move-final-goal-btn"),
    milestoneNextForm: document.getElementById("milestone-next-form"),
    milestoneNextChoice: document.getElementById("milestone-next-choice"),
    milestoneNextStatus: document.getElementById("milestone-next-status"),
    roadmapPreviewCard: document.getElementById("roadmap-preview-card"),
    roadmapPreviewList: document.getElementById("roadmap-preview-list"),
    milestoneSuggestionLoading: document.getElementById("milestone-suggestion-loading"),
    milestoneSuggestionCard: document.getElementById("milestone-suggestion-card"),
    milestoneSuggestionTitle: document.getElementById("milestone-suggestion-title"),
    milestoneSuggestionWhy: document.getElementById("milestone-suggestion-why"),
    milestoneNextTitleInput: document.getElementById("next-milestone-title"),
    milestoneNextWhyInput: document.getElementById("next-milestone-why"),
    completedGoalsEmpty: document.getElementById("completed-goals-empty"),
    completedGoalsList: document.getElementById("completed-goals-list"),
    completedGoalDetail: document.getElementById("completed-goal-detail"),
    completedGoalDetailTitle: document.getElementById("completed-goal-detail-title"),
    completedGoalDetailDate: document.getElementById("completed-goal-detail-date"),
    completedGoalDetailText: document.getElementById("completed-goal-detail-text"),
    completedGoalDetailStats: document.getElementById("completed-goal-detail-stats"),
    completedGoalProgressCount: document.getElementById("completed-goal-progress-count"),
    completedGoalTimeline: document.getElementById("completed-goal-timeline"),
    goalCelebrationModal: document.getElementById("goal-celebration-modal"),
    goalCelebrationScreen: document.querySelector("#goal-celebration-modal .celebration-screen"),
    goalCelebrationContent: document.querySelector("#goal-celebration-modal .celebration-content"),
    goalCelebrationTitle: document.getElementById("goal-celebration-title"),
    goalCelebrationGoalName: document.getElementById("goal-celebration-goal-name"),
    goalCelebrationLine: document.getElementById("goal-celebration-line"),
    goalCelebrationSecondary: document.getElementById("goal-celebration-secondary"),
    goalCelebrationStats: document.getElementById("goal-celebration-stats"),
    goalCelebrationNextBtn: document.getElementById("goal-celebration-next-btn"),
    goalCelebrationArchiveBtn: document.getElementById("goal-celebration-archive-btn")
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
    routeApp().catch((error) => console.error("Route app failed", error));
  }

  function ensureStateShape() {
    appState.profile = {
      ...createEmptyProfile(),
      ...(appState.profile || {})
    };
    appState.goals = Array.isArray(appState.goals) ? appState.goals : [];
    appState.completedGoals = Array.isArray(appState.completedGoals) ? appState.completedGoals : [];
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
    appState.milestoneExecutionPlans = appState.milestoneExecutionPlans || {};
    appState.meta = appState.meta || {};
    appState.streak = Number.isFinite(appState.streak) ? appState.streak : 0;
    appState.totalWins = Number.isFinite(appState.totalWins) ? appState.totalWins : 0;
    appState.lastWinDate = appState.lastWinDate || null;
    appState.meta.onboardingCompleted = Boolean(
      appState.meta.onboardingCompleted || hasMeaningfulProfileData(appState.profile)
    );
    appState.meta.onboardingStep = clampStepIndex(appState.meta.onboardingStep || 0);
    normalizeCompletedGoalsState();
    ensureGoalsState();
    normalizeMissionState();
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
      roadmap: [],
      roadmapConfirmed: false,
      currentMilestoneIndex: 0,
      createdAt: "",
      milestones: [],
      milestoneSelectionId: "",
      goalCompletedAt: "",
      category: "",
      financialNotes: "",
      physicalNotes: "",
      familyNotes: "",
      spiritualNotes: "",
      strengths: "",
      obstacles: "",
      contextNotes: ""
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
    const createdAt = (goal.createdAt || profile.createdAt || "").toString().trim();
    const completedAt = (goal.completedAt || profile.goalCompletedAt || "").toString().trim();
    const roadmap = normalizeRoadmapItems(goal.roadmap || profile.roadmap || profile.milestones || goal.milestones, profile);
    const currentMilestoneIndex = Number.isInteger(goal.currentMilestoneIndex)
      ? goal.currentMilestoneIndex
      : Number.isInteger(profile.currentMilestoneIndex)
        ? profile.currentMilestoneIndex
        : getCurrentMilestoneIndexFromRoadmap(roadmap);

    return {
      id: (goal.id || createId("goal")).trim(),
      title,
      why,
      baseline,
      milestone,
      timeline,
      category,
      createdAt,
      completedAt,
      roadmap,
      currentMilestoneIndex,
      isPrimary: Boolean(goal.isPrimary),
      profile: {
        ...profile,
        goalTitle: title,
        why,
        baseline,
        phaseMilestone: milestone,
        roadmap,
        currentMilestoneIndex,
        milestones: roadmap,
        timeline,
        category,
        createdAt,
        goalCompletedAt: completedAt
      }
    };
  }

  function isGoalMarkedComplete(goalLike) {
    return Boolean(
      goalLike?.completedAt
      || goalLike?.goalCompletedAt
      || goalLike?.profile?.goalCompletedAt
      || goalLike?.profileSnapshot?.goalCompletedAt
    );
  }

  function getGoalArchiveKey(goalLike) {
    return (goalLike?.id || buildGoalSignature(goalLike || {})).trim();
  }

  function createCompletedGoalRecord(record = {}) {
    const goalRecord = createGoalRecord(record);
    const profileSnapshot = {
      ...createEmptyProfile(),
      ...(record.profileSnapshot || record.profile || record),
      goalTitle: goalRecord.title,
      why: goalRecord.why,
      baseline: goalRecord.baseline,
      phaseMilestone: goalRecord.milestone,
      timeline: goalRecord.timeline,
      category: goalRecord.category,
      createdAt: goalRecord.createdAt,
      goalCompletedAt: (record.completedAt || goalRecord.completedAt || "").toString().trim()
    };
    const milestones = getMilestones(profileSnapshot).map((milestone, index) =>
      normalizeMilestone(milestone, index)
    );
    const completedAt = profileSnapshot.goalCompletedAt;
    const completedMilestones = milestones.map((milestone) => ({
      ...milestone,
      completedAt: milestone.completedAt || completedAt || null
    }));
    const providedStats = record.journeyStats || {};
    const milestonesCompleted = Number.isFinite(providedStats.milestonesCompleted)
      ? providedStats.milestonesCompleted
      : completedMilestones.filter((milestone) => milestone.completedAt).length;

    return {
      ...goalRecord,
      isPrimary: false,
      createdAt: goalRecord.createdAt,
      completedAt,
      summary: (record.summary || profileSnapshot.why || profileSnapshot.phaseWhy || "").toString().trim(),
      profileSnapshot: {
        ...profileSnapshot,
        roadmap: completedMilestones,
        currentMilestoneIndex: Math.max(completedMilestones.length - 1, 0),
        milestones: completedMilestones,
        milestoneSelectionId: completedMilestones[completedMilestones.length - 1]?.id || ""
      },
      journeyStats: {
        totalDays: Number.isFinite(providedStats.totalDays) ? providedStats.totalDays : null,
        wins: Number.isFinite(providedStats.wins) ? providedStats.wins : null,
        peakStreak: Number.isFinite(providedStats.peakStreak) ? providedStats.peakStreak : null,
        milestonesCompleted
      }
    };
  }

  // Migrate any legacy "completed but still active" goals into the archive on load.
  function normalizeCompletedGoalsState() {
    const archiveMap = new Map(
      (Array.isArray(appState.completedGoals) ? appState.completedGoals : [])
        .map((goal) => createCompletedGoalRecord(goal))
        .filter((goal) => goal.title || goal.summary || goal.completedAt)
        .map((goal) => [getGoalArchiveKey(goal), goal])
    );
    const activeGoals = [];

    (Array.isArray(appState.goals) ? appState.goals : []).forEach((goal) => {
      const normalizedGoal = createGoalRecord(goal);
      if (!(normalizedGoal.title || normalizedGoal.why || normalizedGoal.baseline || normalizedGoal.milestone)) {
        return;
      }

      if (isGoalMarkedComplete(normalizedGoal)) {
        const archivedGoal = createCompletedGoalRecord({
          ...normalizedGoal,
          profileSnapshot: normalizedGoal.profile
        });
        archiveMap.set(getGoalArchiveKey(archivedGoal), archivedGoal);
        return;
      }

      activeGoals.push(normalizedGoal);
    });

    if (hasMeaningfulProfileData(appState.profile) && isGoalMarkedComplete({ profile: appState.profile })) {
      const archivedProfileGoal = createCompletedGoalRecord({
        id: appState.primaryGoalId || createId("goal"),
        profileSnapshot: appState.profile
      });
      archiveMap.set(getGoalArchiveKey(archivedProfileGoal), archivedProfileGoal);
      appState.profile = createEmptyProfile();
    }

    appState.goals = activeGoals;
    appState.completedGoals = Array.from(archiveMap.values()).sort((a, b) => {
      return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
    });

    if (!appState.goals.some((goal) => goal.id === appState.primaryGoalId)) {
      appState.primaryGoalId = "";
    }
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
      .filter((goal) => (goal.title || goal.why || goal.baseline || goal.milestone) && !isGoalMarkedComplete(goal));

    const profileHasGoal = hasMeaningfulProfileData(appState.profile) && !isGoalMarkedComplete({ profile: appState.profile });
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
    primaryProfile.roadmap = normalizeRoadmapItems(primaryGoal.roadmap || primaryProfile.roadmap, primaryProfile);
    primaryProfile.currentMilestoneIndex = Number.isInteger(primaryGoal.currentMilestoneIndex)
      ? primaryGoal.currentMilestoneIndex
      : getCurrentMilestoneIndexFromRoadmap(primaryProfile.roadmap);
    primaryProfile.milestones = primaryProfile.roadmap;
    primaryProfile.timeline = primaryGoal.timeline || primaryProfile.timeline;
    primaryProfile.category = primaryGoal.category || primaryProfile.category || inferGoalCategory(primaryGoal);
    primaryProfile.createdAt = primaryGoal.createdAt || primaryProfile.createdAt;
    primaryProfile.goalCompletedAt = "";
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
    primaryGoal.roadmap = normalizeRoadmapItems(appState.profile.roadmap || primaryGoal.roadmap, appState.profile);
    primaryGoal.currentMilestoneIndex = Number.isInteger(appState.profile.currentMilestoneIndex)
      ? appState.profile.currentMilestoneIndex
      : getCurrentMilestoneIndexFromRoadmap(primaryGoal.roadmap);
    primaryGoal.timeline = appState.profile.timeline || primaryGoal.timeline;
    primaryGoal.createdAt = appState.profile.createdAt || primaryGoal.createdAt || "";
    primaryGoal.completedAt = appState.profile.goalCompletedAt || "";
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
      roadmap: primaryGoal.roadmap,
      currentMilestoneIndex: primaryGoal.currentMilestoneIndex,
      milestones: primaryGoal.roadmap,
      timeline: primaryGoal.timeline,
      category: primaryGoal.category,
      createdAt: primaryGoal.createdAt,
      goalCompletedAt: primaryGoal.completedAt
    };

    appState.goals.forEach((goal) => {
      if (goal.id !== primaryGoal.id) {
        goal.isPrimary = false;
      }
    });
    appState.primaryGoalId = primaryGoal.id;
  }

  function normalizeMissionState() {
    appState.missions = Object.entries(appState.missions || {}).reduce((accumulator, [dateKey, mission]) => {
      accumulator[dateKey] = normalizeMissionRecord(mission, dateKey);
      return accumulator;
    }, {});
    appState.milestoneExecutionPlans = Object.entries(appState.milestoneExecutionPlans || {}).reduce((accumulator, [key, plan]) => {
      const normalizedPlan = normalizeMilestoneExecutionPlan(plan);
      if (normalizedPlan) {
        accumulator[key] = normalizedPlan;
      }
      return accumulator;
    }, {});
  }

  function normalizeMissionRecord(mission, dateKey = activeDateKey) {
    const items = Array.isArray(mission?.items)
      ? mission.items.map((item, index) => normalizeMissionItem(item, `${dateKey}-${index + 1}`))
      : [];
    const planStatus = (mission?.planStatus || mission?.aiPlan?.status || mission?.source || "").toString().trim().toLowerCase();
    const selectedSupportingGoals = Array.isArray(mission?.selectedSupportingGoals)
      ? mission.selectedSupportingGoals.map((goal) => (goal || "").toString().trim()).filter(Boolean)
      : Array.isArray(mission?.aiPlan?.selected_supporting_goals)
        ? mission.aiPlan.selected_supporting_goals.map((goal) => (goal || "").toString().trim()).filter(Boolean)
        : [];

    return {
      title: (mission?.title || "").toString().trim(),
      subtitle: (mission?.subtitle || "").toString().trim(),
      loadLevel: (mission?.loadLevel || formatMissionLoadLabel(mission?.missionLoad) || "Standard").toString().trim(),
      missionLoad: (mission?.missionLoad || mission?.loadLevel || "standard").toString().trim().toLowerCase(),
      dailyFocus: (mission?.dailyFocus || mission?.title || "").toString().trim(),
      source: planStatus || (mission?.source || "").toString().trim().toLowerCase(),
      sourceLabel: (mission?.sourceLabel || getMissionSourceLabel(planStatus || mission?.source)).toString().trim(),
      planStatus,
      selectedSupportingGoals,
      milestoneEstimate: (mission?.milestoneEstimate || "").toString().trim(),
      milestoneEstimateDays: Number.isFinite(Number(mission?.milestoneEstimateDays)) ? Number(mission.milestoneEstimateDays) : null,
      aiPlan: normalizeSavedAIPlan(mission?.aiPlan),
      executionPlan: normalizeMilestoneExecutionPlan(mission?.executionPlan || mission?.aiPlan?.execution_plan),
      generatedAt: mission?.generatedAt || "",
      items
    };
  }

  function normalizeMissionItem(item, fallbackId) {
    const title = (item?.title || item?.text || "").toString().trim();
    let subtasks = Array.isArray(item?.subtasks)
      ? item.subtasks.map((subtask, index) => normalizeMissionSubtask(subtask, `${fallbackId}-subtask-${index + 1}`)).filter((entry) => entry.text)
      : [];
    if (item?.completed && subtasks.length) {
      subtasks = subtasks.map((subtask) => ({
        ...subtask,
        completed: true
      }));
    }
    const completed = Boolean(item?.completed || (subtasks.length && subtasks.every((subtask) => subtask.completed)));

    return {
      id: (item?.id || fallbackId).toString().trim(),
      title,
      text: (item?.text || title).toString().trim(),
      summary: (item?.summary || "").toString().trim(),
      category: (item?.category || "").toString().trim(),
      completed,
      role: (item?.role || "").toString().trim(),
      goalType: (item?.goalType || item?.goal_type || "").toString().trim(),
      goalTitle: (item?.goalTitle || item?.goal_title || "").toString().trim(),
      completesMilestone: Boolean(item?.completesMilestone || item?.completes_milestone),
      expanded: Boolean(item?.expanded),
      subtasks
    };
  }

  function normalizeMissionSubtask(subtask, fallbackId) {
    if (typeof subtask === "string") {
      return {
        id: fallbackId,
        text: subtask.trim(),
        completed: false
      };
    }

    return {
      id: (subtask?.id || fallbackId).toString().trim(),
      text: (subtask?.text || "").toString().trim(),
      completed: Boolean(subtask?.completed)
    };
  }

  function normalizeSavedAIPlan(aiPlan) {
    if (!aiPlan || typeof aiPlan !== "object") {
      return null;
    }

    const missions = Array.isArray(aiPlan.missions)
      ? aiPlan.missions.map((mission) => ({
        goal_type: (mission?.goal_type || "").toString().trim(),
        goal_title: (mission?.goal_title || "").toString().trim(),
        title: (mission?.title || "").toString().trim(),
        summary: (mission?.summary || "").toString().trim(),
        completes_milestone: Boolean(mission?.completes_milestone),
        subtasks: Array.isArray(mission?.subtasks)
          ? mission.subtasks.map((subtask) => (subtask || "").toString().trim()).filter(Boolean)
          : []
      })).filter((mission) => mission.goal_type && mission.goal_title && mission.title)
      : [];

    return {
      daily_focus: (aiPlan.daily_focus || "").toString().trim(),
      mission_load: (aiPlan.mission_load || "").toString().trim().toLowerCase(),
      selected_supporting_goals: Array.isArray(aiPlan.selected_supporting_goals)
        ? aiPlan.selected_supporting_goals.map((goal) => (goal || "").toString().trim()).filter(Boolean)
        : [],
      milestone_estimate: (aiPlan.milestone_estimate || "").toString().trim(),
      milestone_estimate_days: Number.isFinite(Number(aiPlan.milestone_estimate_days)) ? Number(aiPlan.milestone_estimate_days) : null,
      status: (aiPlan.status || "").toString().trim().toLowerCase(),
      execution_plan: normalizeMilestoneExecutionPlan(aiPlan.execution_plan),
      missions
    };
  }

  function getMissionSourceLabel(status) {
    return (status || "").toString().trim().toLowerCase() === "ai" ? "AI planned" : "Fallback mode";
  }

  function normalizeMilestoneExecutionPlan(plan) {
    if (!plan || typeof plan !== "object") {
      return null;
    }

    const requiredActionCategories = Array.isArray(plan.required_action_categories)
      ? plan.required_action_categories.map((item) => (item || "").toString().trim()).filter(Boolean)
      : [];
    const completionCriteria = Array.isArray(plan.completion_criteria)
      ? plan.completion_criteria.map((item) => (item || "").toString().trim()).filter(Boolean)
      : [];
    const milestoneTitle = (plan.milestone_title || "").toString().trim();

    if (!milestoneTitle) {
      return null;
    }

    return {
      milestone_title: milestoneTitle,
      estimated_days: Number.isFinite(Number(plan.estimated_days)) ? Number(plan.estimated_days) : 0,
      milestone_started_at: (plan.milestone_started_at || "").toString().trim(),
      elapsed_days: Number.isFinite(Number(plan.elapsed_days)) ? Number(plan.elapsed_days) : 0,
      progression_focus: (plan.progression_focus || "").toString().trim(),
      required_action_categories: requiredActionCategories,
      weekly_rhythm: (plan.weekly_rhythm || "").toString().trim(),
      recovery_needs: (plan.recovery_needs || "").toString().trim(),
      completion_criteria: completionCriteria,
      can_complete_with_single_mission: Boolean(plan.can_complete_with_single_mission)
    };
  }

  function createId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function inferGoalCategory(goal) {
    const text = `${goal?.title || ""} ${goal?.milestone || ""} ${goal?.baseline || ""} ${goal?.profile?.goalTitle || ""} ${goal?.profile?.target || ""}`.toLowerCase();
    if (/(health|fit|fitness|workout|gym|run|walk|sleep|train|meal|body|bench|deadlift|squat|cardio|strength|lift)/.test(text)) return "health";
    if (/(family|home|marriage|kids|children|relationship|partner|parent)/.test(text)) return "family";
    if (/(money|finance|financial|income|budget|debt|revenue|sales|client|business|work|career|job|cash|save|saving|savings|invest|investing)/.test(text)) return "money";
    if (/(learn|study|skill|habit|discipline|growth|practice|read|write)/.test(text)) return "growth";
    return "goal";
  }

  function formatGoalCategory(category) {
    const labels = {
      goal: "Goal",
      health: "Health",
      family: "Family",
      money: "Finance",
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
    openModal("goal-manager-modal");
  }

  // Keep the current dashboard goal visible in "Your Goals" without changing the main goal logic.
  function ensureMainGoalInGoalsList() {
    if (!hasMeaningfulProfileData(appState.profile) || isGoalMarkedComplete({ profile: appState.profile })) {
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

  // Shared goal-upsert path so both Clarity Builder and Add Goal attach AI roadmaps to a real saved goal object.
  function ensurePrimaryGoalRecordFromProfile() {
    if (!hasMeaningfulProfileData(appState.profile)) {
      return null;
    }

    ensureMainGoalInGoalsList();
    syncPrimaryGoalFromProfile();

    const primaryGoal = getPrimaryGoal();
    if (!primaryGoal) {
      return null;
    }

    primaryGoal.isPrimary = true;
    appState.primaryGoalId = primaryGoal.id;
    appState.goals = appState.goals.map((goal) => ({
      ...goal,
      isPrimary: goal.id === primaryGoal.id
    }));

    return primaryGoal;
  }

  function getExplicitRoadmapValue(goalLike) {
    if (Array.isArray(goalLike?.roadmap)) {
      return goalLike.roadmap;
    }
    if (Array.isArray(goalLike?.profile?.roadmap)) {
      return goalLike.profile.roadmap;
    }
    if (Array.isArray(goalLike?.profile?.milestones)) {
      return goalLike.profile.milestones;
    }
    return [];
  }

  // Only treat a roadmap as reusable when it was explicitly saved before,
  // or when legacy data clearly contains more than the default fallback nodes.
  function hasValidRoadmap(goalLike) {
    const rawRoadmap = getExplicitRoadmapValue(goalLike);
    const normalizedRoadmap = (Array.isArray(rawRoadmap) ? rawRoadmap : [])
      .map((milestone, index) => normalizeMilestone(milestone, index))
      .filter((milestone) => milestone.label);
    const roadmapLength = normalizedRoadmap.length;
    const firstRoadmapItem = normalizedRoadmap[0] || null;
    const hasConfirmedRoadmapFlag = Boolean(goalLike?.roadmapConfirmed || goalLike?.profile?.roadmapConfirmed);
    const hasOnlyFallbackFinalNode = roadmapLength === 1
      && firstRoadmapItem?.id === "milestone-final";
    const hasOnlyFallbackDefaultNodes = roadmapLength === 2
      && normalizedRoadmap[0]?.id === "milestone-1"
      && normalizedRoadmap[1]?.id === "milestone-final";
    const hasLegacySavedRoadmap = normalizedRoadmap.length > 1
      && normalizedRoadmap.some((milestone) => !["milestone-1", "milestone-final"].includes(milestone.id));
    const result = hasConfirmedRoadmapFlag || (!hasOnlyFallbackFinalNode && !hasOnlyFallbackDefaultNodes && hasLegacySavedRoadmap);

    debugLog("CB STEP: raw roadmap value", rawRoadmap);
    debugLog("CB STEP: roadmap length", roadmapLength);
    debugLog("CB STEP: first roadmap item", firstRoadmapItem);
    debugLog("CB STEP: result of hasValidRoadmap(goal)", result);

    return result;
  }

  // Single source of truth for saving a goal record and, when needed,
  // handing it into the AI roadmap approval flow used by Add Goal.
  async function saveGoalThroughRoadmapPipeline(goalInput = {}, options = {}) {
    debugLog("CB STEP: entered shared save pipeline", {
      goalInput,
      options
    });
    ensureMainGoalInGoalsList();
    const goalId = (goalInput.id || "").trim();
    const goalData = {
      id: goalId || createId("goal"),
      title: (goalInput.title || "").trim(),
      why: (goalInput.why || "").trim(),
      baseline: (goalInput.baseline || "").trim(),
      timeline: (goalInput.timeline || "").trim()
    };

    if (!goalData.title || !goalData.why || !goalData.baseline) {
      console.error("missing goal fields", {
        goalData,
        hasTitle: Boolean(goalData.title),
        hasWhy: Boolean(goalData.why),
        hasBaseline: Boolean(goalData.baseline)
      });
      return null;
    }

    const existingIndex = appState.goals.findIndex((goal) => goal.id === goalData.id);
    const existingGoal = existingIndex >= 0 ? appState.goals[existingIndex] : null;
    const goalProfileSeed = {
      ...createEmptyProfile(),
      ...(existingGoal?.profile || {}),
      ...(goalInput.profile || {}),
      goalTitle: goalData.title,
      why: goalData.why,
      baseline: goalData.baseline,
      timeline: goalData.timeline || goalInput.profile?.timeline || existingGoal?.timeline || existingGoal?.profile?.timeline || "",
      phaseMilestone: goalInput.profile?.phaseMilestone || existingGoal?.profile?.phaseMilestone || existingGoal?.milestone || "",
      phaseWhy: goalInput.profile?.phaseWhy || existingGoal?.profile?.phaseWhy || "",
      createdAt: existingGoal ? (existingGoal.createdAt || "") : ((goalInput.createdAt || "").trim() || getActiveDateTimestamp())
    };
    const goalCategory = inferGoalCategory({
      ...goalData,
      profile: goalProfileSeed
    });
    const shouldBePrimary = options.forcePrimary || (existingGoal ? existingGoal.isPrimary : !appState.primaryGoalId);
    const goalRecord = createGoalRecord({
      ...existingGoal,
      ...goalData,
      createdAt: goalProfileSeed.createdAt,
      isPrimary: shouldBePrimary,
      category: goalCategory,
      profile: {
        ...goalProfileSeed,
        category: goalCategory
      }
    });

    if (existingIndex >= 0) {
      appState.goals[existingIndex] = goalRecord;
    } else {
      appState.goals.push(goalRecord);
    }

    if (goalRecord.isPrimary || !appState.primaryGoalId) {
      appState.primaryGoalId = goalRecord.id;
      goalRecord.isPrimary = true;
      appState.goals = appState.goals.map((goal) => ({
        ...goal,
        isPrimary: goal.id === goalRecord.id
      }));
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
    if (options.resetGoalForm) {
      elements.goalManagerForm.reset();
    }
    if (options.closeGoalModal) {
      closeModal("goal-manager-modal");
    }

    const hasRoadmap = hasValidRoadmap(existingGoal);
    const shouldGenerateRoadmap = options.forceGenerateRoadmap === true || !hasRoadmap;
    debugLog("CB STEP: roadmap-present check result", {
      hasRoadmap,
      existingIndex,
      shouldGenerateRoadmap,
      goalId: goalRecord.id,
      milestoneCount: getMilestonesFromProfile(goalRecord.profile).length,
      forceGenerateRoadmap: options.forceGenerateRoadmap === true
    });

    if (shouldGenerateRoadmap) {
      debugLog("CB STEP: calling AI roadmap generator", {
        goalId: goalRecord.id,
        originSurface: options.originSurface || "goal-manager"
      });
      await openRoadmapApprovalPrompt({
        originSurface: options.originSurface || "goal-manager",
        goalId: goalRecord.id
      });
      return goalRecord;
    }

    renderDashboard();
    return goalRecord;
  }

  async function saveGoalFromForm() {
    await saveGoalThroughRoadmapPipeline({
      id: elements.goalEditId.value.trim(),
      title: elements.goalInputTitle.value.trim(),
      why: elements.goalInputWhy.value.trim(),
      baseline: elements.goalInputBaseline.value.trim()
    }, {
      originSurface: "goal-manager",
      resetGoalForm: true,
      closeGoalModal: true
    });
  }

  async function setPrimaryGoal(goalId) {
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
    await ensureMissionForToday(true);
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
        setPrimaryButton.addEventListener("click", () => {
          setPrimaryGoal(goal.id).catch((error) => console.error("Unable to switch primary goal", error));
        });
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
    routeApp().catch((error) => console.error("Route app failed", error));
  }

  function renderDevDateControls() {
    elements.devDateLabel.textContent = formatDisplayDate(new Date(`${activeDateKey}T12:00:00`));
    elements.devDateBadge.classList.toggle("hidden", !isUsingSimulatedDate());
  }

  function getActiveDateTimestamp() {
    return new Date(`${activeDateKey}T12:00:00`).toISOString();
  }

  async function routeApp() {
    const hasProfile = hasCompletedProfile();
    const completedOpening = Boolean(appState.daily[activeDateKey]?.state);

    showScreen(completedOpening ? (hasProfile ? "dashboard" : "onboarding") : "opening");

    if (completedOpening && hasProfile) {
      await ensureMissionForToday();
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

  function hasActiveGoalProfile(profile) {
    return hasMeaningfulProfileData(profile) && !isGoalMarkedComplete({ profile });
  }

  function hasCompletedProfile() {
    return Boolean(appState.meta.onboardingCompleted || hasMeaningfulProfileData(appState.profile));
  }

  function clampStepIndex(index) {
    return Math.min(Math.max(index, 0), CLARITY_STEPS.length - 1);
  }

  function bindEvents() {
    elements.startDayBtn.addEventListener("click", async () => {
      if (hasCompletedProfile()) {
        await ensureMissionForToday();
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
    elements.completedGoalsBtn.addEventListener("click", () => openModal("completed-goals-modal"));
    elements.addGoalBtn.addEventListener("click", () => openGoalManager());
    elements.useRealDateBtn.addEventListener("click", clearSimulatedDate);
    elements.prevDayBtn.addEventListener("click", () => {
      setSimulatedDate(offsetDateKey(activeDateKey, -1));
    });
    elements.nextDayBtn.addEventListener("click", () => {
      setSimulatedDate(offsetDateKey(activeDateKey, 1));
    });

    elements.lifeUpdateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      saveLifeUpdate();
      await ensureMissionForToday(true);
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
    elements.acceptMilestoneBtn.addEventListener("click", acceptSuggestedMilestone);
    elements.editMilestoneBtn.addEventListener("click", openMilestoneEditForm);
    elements.cancelEditMilestoneBtn.addEventListener("click", showMilestoneSuggestionView);
    elements.moveFinalGoalBtn.addEventListener("click", moveToFinalGoalTarget);
    elements.milestoneNextForm.addEventListener("submit", saveNextMilestoneFromPrompt);
    elements.goalCelebrationNextBtn.addEventListener("click", openNextGoalBuilder);
    elements.goalCelebrationArchiveBtn.addEventListener("click", () => {
      closeModal("goal-celebration-modal");
      openModal("completed-goals-modal");
    });

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => closeModal(button.dataset.closeModal));
    });

    elements.regenerateMissionBtn.addEventListener("click", async () => {
      await ensureMissionForToday(true);
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
    return appState.profile[key] || "";
  }

  function persistClarityAnswer(step, value) {
    const cleaned = (value || "").toString().trim();
    if (!appState.profile.createdAt && cleaned && !hasMeaningfulProfileData(appState.profile)) {
      appState.profile.createdAt = getActiveDateTimestamp();
    }
    if (step.key === "gap") {
      appState.profile.gap = cleaned;
      appState.profile.phaseFocus = cleaned;
    } else if (step.key === "why") {
      appState.profile.why = cleaned;
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
    appState.profile.category = inferGoalCategory({
      title: appState.profile.goalTitle,
      milestone: appState.profile.phaseMilestone,
      profile: appState.profile
    });
    if (appState.profile.phaseMilestone || getMilestonesFromProfile(appState.profile).length || appState.meta.onboardingCompleted) {
      syncMilestoneTimeline();
    }
  }

  async function moveClarityFlow(surface, direction) {
    const key = surface === "modal" ? "modalStep" : "onboardingStep";
    const current = flowState[key];
    const nextStep = current + direction;

    if (nextStep < 0) {
      flowState[key] = 0;
      renderClarityFlow(surface);
      return;
    }

    if (nextStep >= CLARITY_STEPS.length) {
      appState.meta.onboardingStep = CLARITY_STEPS.length - 1;
      saveState();

      if (appState.profile.goalTitle && appState.profile.why && appState.profile.baseline) {
        try {
          debugLog("CB STEP: finish clicked", {
            surface,
            onboardingStep: appState.meta.onboardingStep
          });
          const primaryGoal = ensurePrimaryGoalRecordFromProfile();
          const clarityGoalInput = {
            id: primaryGoal?.id || appState.primaryGoalId || "",
            title: appState.profile.goalTitle,
            why: appState.profile.why,
            baseline: appState.profile.baseline,
            timeline: appState.profile.timeline,
            profile: {
              ...createEmptyProfile(),
              ...appState.profile
            }
          };

          debugLog("CB STEP: goal payload built", clarityGoalInput);
          debugLog("CB STEP: calling shared save pipeline", {
            goalId: clarityGoalInput.id || "(new)",
            title: clarityGoalInput.title
          });
          await saveGoalThroughRoadmapPipeline(clarityGoalInput, {
            forcePrimary: true,
            originSurface: surface
          });
          return;
        } catch (error) {
          console.error("any caught exceptions in the Clarity Builder finish flow", error);
          throw error;
        }
      }

      await finalizeClarityFlow(surface);
      return;
    }

    flowState[key] = nextStep;
    if (surface === "onboarding") {
      appState.meta.onboardingStep = nextStep;
      saveState();
    }
    renderClarityFlow(surface);
  }

  function getMilestonesFromProfile(profile) {
    const source = Array.isArray(profile?.roadmap) && profile.roadmap.length
      ? profile.roadmap
      : profile?.milestones;
    return Array.isArray(source)
      ? source.map((milestone, index) => normalizeMilestone(milestone, index)).filter((milestone) => milestone.label)
      : [];
  }

  async function finalizeClarityFlow(surface) {
    appState.meta.onboardingCompleted = true;
    appState.meta.onboardingStep = CLARITY_STEPS.length - 1;
    syncRoadmap();
    saveState();
    await ensureMissionForToday(true);
    renderDashboard();
    debugLog("Dashboard updated");
    if (surface === "modal") {
      closeModal("profile-modal");
    } else {
      showScreen("dashboard");
    }
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
    let milestones = normalizeRoadmapItems(profile.roadmap || profile.milestones, profile);

    if (!milestones.length) {
      if (!profile.phaseMilestone && !appState.meta.onboardingCompleted) {
        profile.roadmap = [];
        profile.milestones = [];
        profile.currentMilestoneIndex = 0;
        profile.milestoneSelectionId = "";
        return;
      }
      milestones = buildDefaultMilestones(profile);
    }

    const activeIndex = Number.isInteger(profile.currentMilestoneIndex)
      ? Math.min(Math.max(profile.currentMilestoneIndex, 0), Math.max(milestones.length - 1, 0))
      : getCurrentMilestoneIndexFromRoadmap(milestones);
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

    profile.roadmap = milestones;
    profile.milestones = milestones;
    profile.currentMilestoneIndex = getCurrentMilestoneIndexFromRoadmap(milestones);
    profile.milestoneSelectionId = profile.milestoneSelectionId || activeMilestone?.id || "";
    profile.phaseMilestone = activeMilestone?.label || profile.phaseMilestone || getFallbackMilestone(profile);
  }

  function normalizeMilestone(milestone, index) {
    return {
      id: (milestone?.id || `milestone-${index + 1}`).toString(),
      label: (milestone?.label || milestone?.title || "").toString().trim(),
      detail: (milestone?.detail || milestone?.whyItMatters || milestone?.why_it_matters || "").toString().trim(),
      completedAt: milestone?.completedAt || null,
      isFinalGoal: Boolean(milestone?.isFinalGoal || milestone?.is_final_goal)
    };
  }

  function getCurrentMilestoneIndexFromRoadmap(roadmap) {
    const safeRoadmap = Array.isArray(roadmap) ? roadmap : [];
    const nextIndex = safeRoadmap.findIndex((milestone) => !milestone.completedAt);
    return nextIndex === -1 ? Math.max(safeRoadmap.length - 1, 0) : nextIndex;
  }

  function normalizeRoadmapItems(items, profile) {
    const normalizedItems = (Array.isArray(items) ? items : [])
      .map((item, index) => normalizeMilestone(item, index))
      .filter((item) => item.label);
    return ensureFinalGoalMilestone(normalizedItems, profile || appState.profile);
  }

  function getFinalGoalTarget(profile) {
    return (profile?.target || profile?.goalTitle || "your goal").toString().trim();
  }

  function getFinalGoalDetail(profile) {
    const finalGoalTarget = getFinalGoalTarget(profile);
    if (profile?.timeline) {
      return `Reach ${finalGoalTarget} by ${profile.timeline}.`;
    }
    return `Reach ${finalGoalTarget}.`;
  }

  // Keep the user's actual goal as the real endpoint so AI stops when the goal itself is next.
  function ensureFinalGoalMilestone(milestones, profile) {
    const normalizedMilestones = (Array.isArray(milestones) ? milestones : [])
      .map((milestone, index) => normalizeMilestone(milestone, index))
      .filter((milestone) => milestone.label);
    const finalGoalTarget = getFinalGoalTarget(profile);

    if (!finalGoalTarget) {
      return normalizedMilestones;
    }

    if (!normalizedMilestones.length) {
      return [{
        id: "milestone-final",
        label: finalGoalTarget,
        detail: getFinalGoalDetail(profile),
        completedAt: null,
        isFinalGoal: true
      }];
    }

    const lastIndex = normalizedMilestones.length - 1;
    normalizedMilestones.forEach((milestone, index) => {
      normalizedMilestones[index] = {
        ...milestone,
        isFinalGoal: index === lastIndex
      };
    });
    normalizedMilestones[lastIndex] = {
      ...normalizedMilestones[lastIndex],
      id: normalizedMilestones[lastIndex].id || "milestone-final",
      label: finalGoalTarget,
      detail: normalizedMilestones[lastIndex].detail || getFinalGoalDetail(profile),
      isFinalGoal: true
    };

    return normalizedMilestones;
  }

  function isFinalGoalMilestone(milestone, profile) {
    return isSameMilestoneText(milestone?.label, getFinalGoalTarget(profile));
  }

  function buildDefaultMilestones(profile) {
    const currentLabel = profile.phaseMilestone || getFallbackMilestone(profile);
    return ensureFinalGoalMilestone([
      {
        id: "milestone-1",
        label: currentLabel,
        detail: profile.phaseWhy || getFallbackMilestoneReason(profile, currentLabel),
        completedAt: null
      },
      {
        id: "milestone-final",
        label: getFinalGoalTarget(profile),
        detail: getFinalGoalDetail(profile),
        completedAt: null
      }
    ], profile);
  }

  function getMilestones(profile) {
    const normalizedMilestones = normalizeRoadmapItems((profile || appState.profile).roadmap || getMilestonesFromProfile(profile || appState.profile), profile || appState.profile);
    return normalizedMilestones.length ? normalizedMilestones : buildDefaultMilestones(profile || appState.profile);
  }

  function getCurrentMilestone(profile) {
    const milestones = getMilestones(profile || appState.profile);
    const milestoneIndex = Number.isInteger((profile || appState.profile).currentMilestoneIndex)
      ? Math.min(Math.max((profile || appState.profile).currentMilestoneIndex, 0), Math.max(milestones.length - 1, 0))
      : getCurrentMilestoneIndexFromRoadmap(milestones);
    return milestones[milestoneIndex] || milestones.find((milestone) => !milestone.completedAt) || milestones[milestones.length - 1] || null;
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

  function getTimelineProgressForMilestones(milestones) {
    const total = milestones.length;
    const completed = milestones.filter((milestone) => milestone.completedAt).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }

  function getDateKeyFromValue(value) {
    if (!value) {
      return "";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }
    return parsed.toISOString().slice(0, 10);
  }

  function getCalendarDaySpan(startValue, endValue) {
    const startKey = getDateKeyFromValue(startValue);
    const endKey = getDateKeyFromValue(endValue);
    if (!startKey || !endKey) {
      return null;
    }
    const start = new Date(`${startKey}T12:00:00`);
    const end = new Date(`${endKey}T12:00:00`);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
    return diff >= 0 ? diff + 1 : null;
  }

  function calculateGoalJourneyStats(profileSnapshot, createdAt, completedAt) {
    const milestones = getMilestones(profileSnapshot);
    const milestoneCount = milestones.filter((milestone) => milestone.completedAt).length;
    const totalDays = getCalendarDaySpan(createdAt, completedAt);
    const startKey = getDateKeyFromValue(createdAt);
    const endKey = getDateKeyFromValue(completedAt);

    if (!startKey || !endKey) {
      return {
        totalDays: null,
        wins: null,
        peakStreak: null,
        milestonesCompleted: milestoneCount
      };
    }

    const winKeys = Object.keys(appState.wins)
      .filter((dateKey) => dateKey >= startKey && dateKey <= endKey && appState.wins[dateKey]?.won)
      .sort();

    let peakStreak = 0;
    let currentStreak = 0;
    let previousWinKey = "";

    winKeys.forEach((dateKey) => {
      if (previousWinKey && offsetDateKey(previousWinKey, 1) === dateKey) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      peakStreak = Math.max(peakStreak, currentStreak);
      previousWinKey = dateKey;
    });

    return {
      totalDays,
      wins: winKeys.length,
      peakStreak: winKeys.length ? peakStreak : 0,
      milestonesCompleted: milestoneCount
    };
  }

  function getGoalCelebrationStats(goal) {
    if (!goal?.journeyStats) {
      return [];
    }

    const stats = [];
    if (Number.isFinite(goal.journeyStats.totalDays)) {
      stats.push({ label: "Days", value: String(goal.journeyStats.totalDays) });
    }
    if (Number.isFinite(goal.journeyStats.wins)) {
      stats.push({ label: "Wins", value: String(goal.journeyStats.wins) });
    }
    if (Number.isFinite(goal.journeyStats.peakStreak)) {
      stats.push({ label: "Peak streak", value: String(goal.journeyStats.peakStreak) });
    }
    if (Number.isFinite(goal.journeyStats.milestonesCompleted)) {
      stats.push({ label: "Milestones", value: String(goal.journeyStats.milestonesCompleted) });
    }
    return stats;
  }

  function renderStatsMarkup(stats) {
    const safeStats = Array.isArray(stats) ? stats : [];
    if (!safeStats.length) {
      return "<div class=\"celebration-stat\"><span class=\"mini-label\">Milestones</span><strong>Finished</strong></div>";
    }

    return safeStats
      .map((stat) => `
        <div class="celebration-stat">
          <span class="mini-label">${escapeHtml(stat.label)}</span>
          <strong>${escapeHtml(stat.value)}</strong>
        </div>
      `)
      .join("");
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

  function sanitizePlannerValue(value) {
    if (Array.isArray(value)) {
      const cleanedList = value
        .map((entry) => sanitizePlannerValue(entry))
        .filter((entry) => entry !== undefined);
      return cleanedList.length ? cleanedList : undefined;
    }

    if (value && typeof value === "object") {
      const cleanedObject = Object.entries(value).reduce((accumulator, [key, entry]) => {
        const cleanedEntry = sanitizePlannerValue(entry);
        if (cleanedEntry !== undefined) {
          accumulator[key] = cleanedEntry;
        }
        return accumulator;
      }, {});
      return Object.keys(cleanedObject).length ? cleanedObject : undefined;
    }

    const cleanedText = (value || "").toString().trim();
    return cleanedText || undefined;
  }

  function buildMilestoneSuggestionPayload(completedMilestone, milestones, options = {}) {
    const activeGoal = getMilestoneFlowGoal(options.goalId) || getPrimaryGoal() || createGoalRecord({ profile: appState.profile });
    const goalProfile = getProfileForGoal(activeGoal);
    const finalMilestone = milestones[milestones.length - 1] || null;
    const mode = options.mode || "next";
    const payload = sanitizePlannerValue({
      requestType: mode === "initial" ? "first_milestone" : "next_milestone",
      primaryGoal: activeGoal.title || goalProfile.goalTitle || appState.profile.goalTitle,
      primaryGoalWhy: activeGoal.why || goalProfile.why || appState.profile.why,
      baseline: activeGoal.baseline || goalProfile.baseline || appState.profile.baseline,
      finalGoal: getFinalGoalTarget(goalProfile) || finalMilestone?.label || activeGoal.title,
      completedMilestone: completedMilestone?.label,
      completedMilestoneWhy: completedMilestone?.detail,
      currentState: appState.daily[activeDateKey] || {},
      profile: {
        goalTitle: activeGoal.title || goalProfile.goalTitle,
        why: activeGoal.why || goalProfile.why,
        baseline: activeGoal.baseline || goalProfile.baseline,
        target: goalProfile.target,
        timeline: activeGoal.timeline || goalProfile.timeline,
        phaseName: goalProfile.phaseName,
        phaseFocus: goalProfile.phaseFocus,
        phaseMilestone: goalProfile.phaseMilestone,
        phaseWhy: goalProfile.phaseWhy,
        category: activeGoal.category || goalProfile.category,
        contextNotes: goalProfile.contextNotes || appState.profile.contextNotes
      },
      userProfile: appState.userProfile || {},
      supportingGoals: getSupportingGoals().map((goal) => ({
        title: goal.title,
        why: goal.why,
        baseline: goal.baseline,
        milestone: goal.milestone,
        timeline: goal.timeline,
        category: goal.category
      })),
      supportingContext: {
        appDate: activeDateKey,
        timeline: activeGoal.timeline || goalProfile.timeline,
        phaseName: goalProfile.phaseName,
        phaseFocus: goalProfile.phaseFocus,
        contextNotes: goalProfile.contextNotes || appState.profile.contextNotes,
        latestLifeUpdate: appState.lifeUpdates[0] || null
      }
    });

    return payload || {};
  }

  function buildRoadmapGenerationPayload(goalId) {
    const activeGoal = getMilestoneFlowGoal(goalId) || getPrimaryGoal() || createGoalRecord({ profile: appState.profile });
    const goalProfile = getProfileForGoal(activeGoal);
    const finalGoal = goalProfile.target || activeGoal.title || goalProfile.goalTitle;

    return sanitizePlannerValue({
      goal_title: activeGoal.title || goalProfile.goalTitle,
      why: activeGoal.why || goalProfile.why,
      baseline: activeGoal.baseline || goalProfile.baseline,
      final_goal: finalGoal,
      timeline: activeGoal.timeline || goalProfile.timeline,
      currentState: appState.daily[activeDateKey] || {},
      profile: {
        goalTitle: activeGoal.title || goalProfile.goalTitle,
        why: activeGoal.why || goalProfile.why,
        baseline: activeGoal.baseline || goalProfile.baseline,
        target: finalGoal,
        timeline: activeGoal.timeline || goalProfile.timeline,
        phaseName: goalProfile.phaseName,
        phaseFocus: goalProfile.phaseFocus,
        category: activeGoal.category || goalProfile.category,
        contextNotes: goalProfile.contextNotes || appState.profile.contextNotes
      },
      userProfile: appState.userProfile || {},
      supportingContext: {
        appDate: activeDateKey,
        timeline: activeGoal.timeline || goalProfile.timeline,
        contextNotes: goalProfile.contextNotes || appState.profile.contextNotes,
        latestLifeUpdate: appState.lifeUpdates[0] || null
      }
    }) || {};
  }

  function buildDailyMissionPayload(context) {
    const primaryGoal = context.primaryGoal || getPrimaryGoal() || createGoalRecord({ profile: appState.profile });
    const primaryProfile = getProfileForGoal(primaryGoal);
    const currentMilestone = getCurrentMilestone(primaryProfile);
    const recentPerformance = getRecentPerformanceSnapshot();
    const latestUpdate = context.latestUpdate || appState.lifeUpdates[0] || null;
    const recentMissionHistory = getRecentMissionHistoryForAI();
    const currentExecutionPlan = getCurrentMilestoneExecutionPlan(primaryGoal, primaryProfile, currentMilestone);

    return sanitizePlannerValue({
      currentDate: activeDateKey,
      whatMattersMostToday: context.daily?.priority || context.profile?.gap || context.profile?.phaseFocus,
      currentState: {
        state: context.daily?.state || "Neutral",
        mode: context.daily?.mode || "stability",
        coachResponse: context.daily?.coachResponse || "",
        priority: context.daily?.priority || "",
        mood: context.daily?.state || "",
        energy: appState.userProfile?.energy || "",
        latestEmotions: Array.isArray(latestUpdate?.emotions) ? latestUpdate.emotions : []
      },
      primaryGoal: {
        title: primaryGoal.title || primaryProfile.goalTitle,
        why: primaryGoal.why || primaryProfile.why,
        baseline: primaryGoal.baseline || primaryProfile.baseline,
        target: primaryProfile.target || primaryGoal.title || primaryProfile.goalTitle,
        timeline: primaryGoal.timeline || primaryProfile.timeline,
        category: primaryGoal.category || primaryProfile.category || inferGoalCategory(primaryGoal)
      },
      currentMilestone: currentMilestone ? {
        label: currentMilestone.label,
        detail: getMilestoneDetail(currentMilestone, primaryProfile),
        isFinalGoal: Boolean(currentMilestone.isFinalGoal)
      } : null,
      baselineToMilestoneGap: primaryProfile.gap || primaryProfile.phaseFocus || "",
      supportingGoals: context.supportingGoals.map((goal) => {
        const goalProfile = getProfileForGoal(goal);
        const supportingMilestone = getCurrentMilestone(goalProfile);
        return {
          title: goal.title || goalProfile.goalTitle,
          why: goal.why || goalProfile.why,
          baseline: goal.baseline || goalProfile.baseline,
          milestone: supportingMilestone?.label || goal.milestone || goalProfile.phaseMilestone,
          timeline: goal.timeline || goalProfile.timeline,
          category: goal.category || goalProfile.category || inferGoalCategory(goal)
        };
      }),
      recentStreak: {
        currentStreak: appState.streak || 0,
        recentCompletionRate: recentPerformance.completionRate,
        recentWinRate: recentPerformance.winRate,
        strongDays: recentPerformance.strongDays
      },
      roadmapProgress: {
        currentMilestoneIndex: Number.isInteger(primaryProfile.currentMilestoneIndex) ? primaryProfile.currentMilestoneIndex + 1 : 1,
        milestoneCount: getMilestones(primaryProfile).length
      },
      currentExecutionPlan,
      recentMissionHistory,
      profile: {
        goalTitle: primaryProfile.goalTitle,
        why: primaryProfile.why,
        baseline: primaryProfile.baseline,
        target: primaryProfile.target,
        gap: primaryProfile.gap,
        timeline: primaryProfile.timeline,
        phaseName: primaryProfile.phaseName,
        phaseFocus: primaryProfile.phaseFocus,
        phaseMilestone: currentMilestone?.label || primaryProfile.phaseMilestone,
        phaseWhy: getMilestoneDetail(currentMilestone, primaryProfile),
        category: primaryProfile.category,
        contextNotes: primaryProfile.contextNotes,
        strengths: primaryProfile.strengths,
        obstacles: primaryProfile.obstacles
      },
      userProfile: appState.userProfile || {},
      latestLifeUpdate: latestUpdate
    }) || {};
  }

  function getCurrentMilestoneExecutionPlan(goal = getPrimaryGoal(), profile = appState.profile, milestone = getCurrentMilestone(profile)) {
    const executionPlanKey = getMilestoneExecutionPlanKey(goal, milestone, profile);
    const storedPlan = normalizeMilestoneExecutionPlan(appState.milestoneExecutionPlans?.[executionPlanKey]);
    if (!storedPlan) {
      return null;
    }

    const milestoneStartedAt = storedPlan.milestone_started_at || activeDateKey;
    return {
      ...storedPlan,
      milestone_started_at: milestoneStartedAt,
      elapsed_days: getElapsedDaysForMilestone(milestoneStartedAt, activeDateKey)
    };
  }

  function getMilestoneExecutionPlanKey(goal = getPrimaryGoal(), milestone = getCurrentMilestone(appState.profile), profile = appState.profile) {
    const goalId = (goal?.id || appState.primaryGoalId || "primary").toString().trim();
    const milestoneId = (milestone?.id || normalizeMilestoneText(milestone?.label || profile?.phaseMilestone || "current")).toString().trim();
    const baseline = normalizeMilestoneText(goal?.baseline || profile?.baseline || "");
    const target = normalizeMilestoneText(goal?.profile?.target || profile?.target || "");
    return [goalId, milestoneId, baseline, target].join("|");
  }

  function getElapsedDaysForMilestone(startDateKey, currentDateKey = activeDateKey) {
    if (!startDateKey || !currentDateKey) {
      return 0;
    }
    const start = new Date(`${startDateKey}T12:00:00`);
    const current = new Date(`${currentDateKey}T12:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(current.getTime())) {
      return 0;
    }
    return Math.max(0, Math.round((current.getTime() - start.getTime()) / 86400000));
  }

  function saveCurrentMilestoneExecutionPlan(context, executionPlan) {
    const primaryGoal = context.primaryGoal || getPrimaryGoal();
    const primaryProfile = getProfileForGoal(primaryGoal);
    const currentMilestone = getCurrentMilestone(primaryProfile);
    const executionPlanKey = getMilestoneExecutionPlanKey(primaryGoal, currentMilestone, primaryProfile);
    const existingPlan = normalizeMilestoneExecutionPlan(appState.milestoneExecutionPlans?.[executionPlanKey]);
    const normalizedPlan = normalizeMilestoneExecutionPlan({
      ...executionPlan,
      milestone_started_at: existingPlan?.milestone_started_at || executionPlan?.milestone_started_at || activeDateKey,
      elapsed_days: getElapsedDaysForMilestone(
        existingPlan?.milestone_started_at || executionPlan?.milestone_started_at || activeDateKey,
        activeDateKey
      )
    });

    if (!normalizedPlan) {
      return null;
    }

    appState.milestoneExecutionPlans[executionPlanKey] = normalizedPlan;
    return normalizedPlan;
  }

  function clearExecutionPlansForGoal(goalId) {
    const safeGoalId = (goalId || "").toString().trim();
    if (!safeGoalId) {
      return;
    }

    Object.keys(appState.milestoneExecutionPlans || {}).forEach((key) => {
      if (key.startsWith(`${safeGoalId}|`)) {
        delete appState.milestoneExecutionPlans[key];
      }
    });
  }

  function getRecentMissionHistoryForAI() {
    const history = [];

    for (let offset = 1; offset <= 4; offset += 1) {
      const dateKey = offsetDateKey(activeDateKey, -offset);
      const savedMission = normalizeMissionRecord(appState.missions[dateKey], dateKey);
      if (!savedMission?.items?.length) {
        continue;
      }

      history.push({
        date: dateKey,
        source: savedMission.source || "",
        missionLoad: savedMission.missionLoad || "",
        dailyFocus: savedMission.dailyFocus || "",
        missions: savedMission.items.slice(0, 6).map((item) => ({
          goalType: item.goalType || "",
          goalTitle: item.goalTitle || "",
          category: item.category || "",
          title: item.title || item.text || "",
          summary: item.summary || "",
          subtasks: Array.isArray(item.subtasks)
            ? item.subtasks.map((subtask) => subtask.text || "").filter(Boolean)
            : []
        }))
      });
    }

    return history;
  }

  async function requestRoadmapGeneration(payload) {
    if (window.location.protocol === "file:") {
      throw new Error("AI roadmap generation needs the local server running. Start the app with npm start or node server.js.");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 22000);

    try {
      const response = await window.fetch(AI_ROADMAP_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to generate the roadmap.");
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The AI roadmap planner timed out.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function requestDailyMissionPlan(payload) {
    if (window.location.protocol === "file:") {
      throw new Error("AI mission planning needs the local server running. Start the app with npm start or node server.js.");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 24000);

    try {
      const response = await window.fetch(AI_MISSION_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to generate today's mission.");
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The AI mission engine timed out.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function requestNextMilestoneSuggestion(payload) {
    if (window.location.protocol === "file:") {
      throw new Error("AI suggestions need the local server running. Start the app with npm start or node server.js.");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 18000);

    try {
      const response = await window.fetch(AI_MILESTONE_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to generate the next milestone.");
      }

      return {
        title: (data.next_milestone || "").toString().trim(),
        why: (data.why_it_matters || "").toString().trim()
      };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The AI milestone planner timed out.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function setMilestoneAdvanceStatus(title, body) {
    if (!title && !body) {
      elements.milestoneNextStatus.classList.add("hidden");
      elements.milestoneNextStatus.innerHTML = "";
      return;
    }

    elements.milestoneNextStatus.innerHTML = `
      ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
      ${body ? `<span>${escapeHtml(body)}</span>` : ""}
    `;
    elements.milestoneNextStatus.classList.remove("hidden");
  }

  function resetMilestoneAdvanceModal() {
    setMilestoneAdvanceStatus("", "");
    elements.roadmapPreviewCard.classList.add("hidden");
    elements.roadmapPreviewList.innerHTML = "";
    elements.milestoneSuggestionLoading.classList.add("hidden");
    elements.milestoneSuggestionCard.classList.add("hidden");
    elements.milestoneNextChoice.classList.add("hidden");
    elements.milestoneNextForm.classList.add("hidden");
    elements.moveFinalGoalBtn.classList.remove("hidden");
    elements.acceptMilestoneBtn.disabled = false;
    elements.milestoneNextEyebrow.textContent = "AI Milestone Planner";
    elements.milestoneNextTitle.textContent = "Milestone complete. Here's the next step.";
    elements.acceptMilestoneBtn.textContent = "Accept Milestone";
    elements.editMilestoneBtn.textContent = "Edit Milestone";
    elements.editMilestoneBtn.classList.remove("hidden");
    elements.milestoneSuggestionTitle.textContent = "Next milestone";
    elements.milestoneSuggestionWhy.textContent = "Why it matters will appear here.";
    elements.milestoneNextForm.reset();
  }

  function configureMilestoneAdvanceModal() {
    const mode = flowState.pendingMilestoneAdvance?.mode || "next";
    const isInitial = mode === "initial";

    elements.milestoneNextEyebrow.textContent = "AI Milestone Planner";
    elements.milestoneNextTitle.textContent = isInitial
      ? "Here's your first milestone."
      : "Milestone complete. Here's the next step.";
    elements.moveFinalGoalBtn.classList.toggle("hidden", isInitial);
  }

  function renderRoadmapPreview(roadmapItems) {
    elements.roadmapPreviewList.innerHTML = "";
    roadmapItems.forEach((milestone, index) => {
      const step = document.createElement("article");
      step.className = `roadmap-preview-step${milestone.isFinalGoal ? " is-final" : ""}`;
      step.innerHTML = `
        <div class="roadmap-preview-head">
          <div>
            <strong>${escapeHtml(milestone.label)}</strong>
          </div>
          <span class="roadmap-step-index">${index + 1}</span>
        </div>
        <p class="muted">${escapeHtml(milestone.detail || "Meaningful progress toward the final goal.")}</p>
        ${milestone.isFinalGoal ? '<span class="chip">Final Goal</span>' : ""}
      `;
      elements.roadmapPreviewList.appendChild(step);
    });
    elements.roadmapPreviewCard.classList.remove("hidden");
  }

  function normalizeGeneratedRoadmap(data, goalId) {
    const targetGoal = getMilestoneFlowGoal(goalId);
    const goalProfile = getProfileForGoal(targetGoal);
    const milestones = Array.isArray(data?.milestones)
      ? data.milestones.map((milestone, index) => normalizeMilestone({
        id: `roadmap-${index + 1}`,
        title: milestone.title,
        detail: milestone.why_it_matters,
        isFinalGoal: milestone.is_final_goal
      }, index))
      : [];
    return normalizeRoadmapItems(milestones, {
      ...goalProfile,
      target: data?.final_goal || goalProfile.target || targetGoal?.title || goalProfile.goalTitle
    });
  }

  async function openRoadmapApprovalPrompt(options = {}) {
    const ensuredGoal = options.goalId ? getMilestoneFlowGoal(options.goalId) : ensurePrimaryGoalRecordFromProfile();
    flowState.pendingRoadmapApproval = {
      goalId: options.goalId || ensuredGoal?.id || appState.primaryGoalId || "",
      originSurface: options.originSurface || ""
    };
    resetMilestoneAdvanceModal();
    elements.milestoneNextEyebrow.textContent = "AI Roadmap Planner";
    elements.milestoneNextTitle.textContent = "Here's the path.";
    elements.acceptMilestoneBtn.textContent = "Accept Roadmap";
    elements.editMilestoneBtn.classList.add("hidden");
    elements.moveFinalGoalBtn.classList.add("hidden");
    elements.milestoneSuggestionLoading.classList.remove("hidden");
    openModal("milestone-next-modal");

    try {
      debugLog("AI roadmap request started", {
        goalId: flowState.pendingRoadmapApproval.goalId
      });
      const roadmapResponse = await requestRoadmapGeneration(
        buildRoadmapGenerationPayload(flowState.pendingRoadmapApproval.goalId)
      );

      if (!flowState.pendingRoadmapApproval) {
        return;
      }

      debugLog("CB STEP: AI roadmap response received", roadmapResponse);
      const roadmap = normalizeGeneratedRoadmap(roadmapResponse, flowState.pendingRoadmapApproval.goalId);
      if (!Array.isArray(roadmapResponse?.milestones) || !roadmap.length) {
        console.error("invalid roadmap response", {
          roadmapResponse,
          normalizedRoadmap: roadmap
        });
      }
      flowState.pendingRoadmapApproval.roadmap = roadmap;
      elements.milestoneSuggestionLoading.classList.add("hidden");
      renderRoadmapPreview(roadmap);
      elements.milestoneNextChoice.classList.remove("hidden");
    } catch (error) {
      if (!flowState.pendingRoadmapApproval) {
        return;
      }
      console.error("roadmap request failure", error);
      elements.milestoneSuggestionLoading.classList.add("hidden");
      elements.acceptMilestoneBtn.disabled = true;
      setMilestoneAdvanceStatus("AI roadmap unavailable.", error.message);
      elements.milestoneNextChoice.classList.remove("hidden");
      window.alert("AI roadmap request failed. Check console.");
    }
  }

  async function acceptRoadmapApproval() {
    const approval = flowState.pendingRoadmapApproval;
    if (!approval?.roadmap?.length) {
      return;
    }

    saveGoalRoadmapState(approval.goalId, approval.roadmap);
    debugLog("CB STEP: roadmap saved to goal", {
      goalId: approval.goalId,
      milestoneCount: approval.roadmap.length
    });
    saveState();
    flowState.pendingRoadmapApproval = null;
    closeModal("milestone-next-modal");

    if (approval.originSurface === "onboarding" || approval.originSurface === "modal") {
      debugLog("CB STEP: dashboard render after roadmap save");
      await finalizeClarityFlow(approval.originSurface);
    } else {
      renderDashboard();
      debugLog("CB STEP: dashboard render after roadmap save");
    }
  }

  function renderMilestoneSuggestionCard(suggestion) {
    elements.milestoneSuggestionTitle.textContent = suggestion?.title || "No suggestion available";
    elements.milestoneSuggestionWhy.textContent = suggestion?.why || "Edit the milestone if you want to shape the next step yourself.";
    elements.milestoneSuggestionCard.classList.remove("hidden");
  }

  function populateMilestoneEditForm(suggestion) {
    elements.milestoneNextTitleInput.value = suggestion?.title || "";
    elements.milestoneNextWhyInput.value = suggestion?.why || "";
  }

  function showMilestoneSuggestionView() {
    configureMilestoneAdvanceModal();
    elements.milestoneNextForm.classList.add("hidden");
    elements.milestoneSuggestionLoading.classList.add("hidden");
    elements.milestoneNextChoice.classList.remove("hidden");
    elements.milestoneSuggestionCard.classList.toggle("hidden", !flowState.pendingMilestoneAdvance?.suggestion);
    elements.acceptMilestoneBtn.disabled = !flowState.pendingMilestoneAdvance?.suggestion?.title;
  }

  function openMilestoneEditForm() {
    const suggestion = flowState.pendingMilestoneAdvance?.suggestion || { title: "", why: "" };
    configureMilestoneAdvanceModal();
    populateMilestoneEditForm(suggestion);
    elements.milestoneNextChoice.classList.add("hidden");
    elements.milestoneSuggestionLoading.classList.add("hidden");
    elements.milestoneNextForm.classList.remove("hidden");
    window.requestAnimationFrame(() => elements.milestoneNextTitleInput.focus());
  }

  function normalizeMilestoneText(value) {
    return (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function isSameMilestoneText(left, right) {
    const normalizedLeft = normalizeMilestoneText(left);
    const normalizedRight = normalizeMilestoneText(right);
    return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
  }

  function getPendingFinalMilestone(milestones) {
    const finalMilestoneId = flowState.pendingMilestoneAdvance?.finalMilestoneId;
    return milestones.find((milestone) => milestone.id === finalMilestoneId) || milestones[milestones.length - 1] || null;
  }

  function getGoalById(goalId) {
    return appState.goals.find((goal) => goal.id === goalId) || null;
  }

  function getMilestoneFlowGoal(goalId) {
    if (goalId) {
      return getGoalById(goalId);
    }
    return getPrimaryGoal() || createGoalRecord({ profile: appState.profile });
  }

  function getProfileForGoal(goal) {
    if (goal?.isPrimary && goal.id === appState.primaryGoalId) {
      return appState.profile;
    }
    return {
      ...createEmptyProfile(),
      ...(goal?.profile || {})
    };
  }

  function getActiveRoadmapMilestone(roadmap) {
    const safeRoadmap = Array.isArray(roadmap) ? roadmap : [];
    const activeIndex = getCurrentMilestoneIndexFromRoadmap(safeRoadmap);
    return safeRoadmap[activeIndex] || safeRoadmap[0] || null;
  }

  function buildMilestoneFlowMilestones(goal, options = {}) {
    const goalProfile = getProfileForGoal(goal);
    const existingMilestones = getMilestonesFromProfile(goalProfile);
    if (existingMilestones.length) {
      return ensureFinalGoalMilestone(existingMilestones, goalProfile);
    }

    return ensureFinalGoalMilestone([
      {
        id: "milestone-final",
        label: getFinalGoalTarget(goalProfile),
        detail: getFinalGoalDetail(goalProfile),
        completedAt: null
      }
    ], goalProfile);
  }

  function saveGoalMilestoneState(goalId, milestone) {
    const goal = getGoalById(goalId);
    if (!goal || !milestone?.label) {
      return;
    }

    const goalProfile = {
      ...createEmptyProfile(),
      ...(goal.profile || {}),
      goalTitle: goal.title,
      why: goal.why,
      baseline: goal.baseline,
      phaseMilestone: milestone.label,
      phaseWhy: milestone.detail || "",
      timeline: goal.timeline || goal.profile?.timeline || "",
      category: goal.category || inferGoalCategory(goal),
      createdAt: goal.createdAt || goal.profile?.createdAt || ""
    };

    goalProfile.roadmap = ensureFinalGoalMilestone(Array.isArray(milestone.milestones)
      ? milestone.milestones.map((entry, index) => normalizeMilestone(entry, index))
      : buildDefaultMilestones(goalProfile), goalProfile);
    goalProfile.milestones = goalProfile.roadmap;
    goalProfile.currentMilestoneIndex = Math.max(goalProfile.roadmap.findIndex((entry) => entry.id === milestone.id), 0);
    goalProfile.milestoneSelectionId = milestone.id || goalProfile.roadmap[goalProfile.currentMilestoneIndex]?.id || "";

    goal.milestone = milestone.label;
    goal.roadmap = goalProfile.roadmap;
    goal.currentMilestoneIndex = goalProfile.currentMilestoneIndex;
    goal.profile = goalProfile;
    clearExecutionPlansForGoal(goal.id);

    if (goal.isPrimary) {
      appState.profile = {
        ...createEmptyProfile(),
        ...goalProfile
      };
      syncDerivedProfileFields();
      syncPrimaryGoalFromProfile();
    }
  }

  function saveGoalRoadmapState(goalId, roadmapItems) {
    const goal = getMilestoneFlowGoal(goalId);
    if (!goal) {
      return;
    }

    const goalProfile = {
      ...createEmptyProfile(),
      ...getProfileForGoal(goal),
      goalTitle: goal.title,
      why: goal.why,
      baseline: goal.baseline,
      target: goal.profile?.target || getProfileForGoal(goal).target || goal.title,
      timeline: goal.timeline || goal.profile?.timeline || "",
      category: goal.category || inferGoalCategory(goal),
      createdAt: goal.createdAt || goal.profile?.createdAt || ""
    };
    const roadmap = normalizeRoadmapItems(roadmapItems, goalProfile);
    const currentMilestone = getActiveRoadmapMilestone(roadmap);

    goal.roadmap = roadmap;
    goal.roadmapConfirmed = true;
    goal.currentMilestoneIndex = getCurrentMilestoneIndexFromRoadmap(roadmap);
    goal.milestone = currentMilestone?.label || "";
    clearExecutionPlansForGoal(goal.id);
    goal.profile = {
      ...goalProfile,
      roadmap,
      roadmapConfirmed: true,
      milestones: roadmap,
      currentMilestoneIndex: goal.currentMilestoneIndex,
      phaseMilestone: currentMilestone?.label || "",
      phaseWhy: currentMilestone?.detail || ""
    };

    if (goal.isPrimary) {
      appState.profile = {
        ...createEmptyProfile(),
        ...goal.profile
      };
      syncDerivedProfileFields();
      syncPrimaryGoalFromProfile();
    }
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
    if (!hasActiveGoalProfile(appState.profile) && !getPrimaryGoal()) {
      elements.timelineProgressPercent.textContent = "0%";
      elements.timelineProgressCount.textContent = "0 of 0 complete";
      elements.timelineTrack.innerHTML = "";
      elements.timelineTrack.dataset.progress = "0";
      elements.timelineTrack.style.setProperty("--timeline-progress", 0);
      renderTimelineDetail();
      return;
    }

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
    const hasGoal = hasActiveGoalProfile(profile) || Boolean(getPrimaryGoal());
    if (!hasGoal) {
      elements.timelineDetailTitle.textContent = "No active goal";
      elements.timelineDetailText.textContent = "Set the next goal when you're ready. Completed goals stay in the archive.";
      elements.timelineDetailStatus.classList.add("hidden");
      elements.timelineCompleteBtn.classList.add("hidden");
      return;
    }

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

  function renderCompletedGoalTimeline(goal) {
    const profileSnapshot = goal?.profileSnapshot || createEmptyProfile();
    const milestones = getMilestones(profileSnapshot).map((milestone, index) => normalizeMilestone(milestone, index));
    const progress = getTimelineProgressForMilestones(milestones);

    elements.completedGoalProgressCount.textContent = `${progress.completed} of ${progress.total} complete`;
    elements.completedGoalTimeline.innerHTML = "";
    elements.completedGoalTimeline.style.setProperty("--timeline-progress", progress.percent / 100 || 0);
    elements.completedGoalTimeline.dataset.progress = String(progress.percent / 100 || 0);

    milestones.forEach((milestone, index) => {
      const node = document.createElement("div");
      node.className = "timeline-node is-complete";
      node.innerHTML = `
        <button class="timeline-node-button" type="button" disabled aria-label="${escapeHtml(milestone.label)}">
          <span class="timeline-node-check">&#10003;</span>
        </button>
        <span class="timeline-node-label">${escapeHtml(shortLabel(milestone.label, 26))}</span>
      `;
      elements.completedGoalTimeline.appendChild(node);
    });
  }

  function selectTimelineMilestone(milestoneId) {
    appState.profile.milestoneSelectionId = milestoneId;
    flowState.timelineSelectionId = milestoneId;
    syncPrimaryGoalFromProfile();
    saveState();
    renderTimeline();
  }

  function buildArchivedPrimaryGoal(completedAt, finalMilestones) {
    const activeGoal = getPrimaryGoal();
    if (!activeGoal) {
      return null;
    }

    const completedMilestones = (finalMilestones || getMilestones(appState.profile)).map((milestone, index) => {
      const normalizedMilestone = normalizeMilestone(milestone, index);
      return {
        ...normalizedMilestone,
        completedAt: normalizedMilestone.completedAt || completedAt
      };
    });
    const createdAt = activeGoal.createdAt || appState.profile.createdAt || "";
    const profileSnapshot = {
      ...createEmptyProfile(),
      ...appState.profile,
      goalTitle: activeGoal.title || appState.profile.goalTitle,
      why: activeGoal.why || appState.profile.why,
      baseline: activeGoal.baseline || appState.profile.baseline,
      phaseMilestone: completedMilestones[completedMilestones.length - 1]?.label || activeGoal.milestone || appState.profile.phaseMilestone,
      timeline: activeGoal.timeline || appState.profile.timeline,
      category: activeGoal.category || appState.profile.category,
      createdAt,
      goalCompletedAt: completedAt,
      roadmap: completedMilestones,
      currentMilestoneIndex: Math.max(completedMilestones.length - 1, 0),
      milestoneSelectionId: completedMilestones[completedMilestones.length - 1]?.id || "",
      milestones: completedMilestones
    };
    const journeyStats = calculateGoalJourneyStats(profileSnapshot, createdAt, completedAt);

    return createCompletedGoalRecord({
      ...activeGoal,
      createdAt,
      completedAt,
      summary: profileSnapshot.why || profileSnapshot.phaseWhy || "",
      journeyStats,
      profileSnapshot
    });
  }

  // Final goal completion is archived separately so completed goals leave all active flows cleanly.
  function archiveCompletedPrimaryGoal(completedGoal) {
    if (!completedGoal) {
      return;
    }

    clearExecutionPlansForGoal(completedGoal.id);

    const archiveKey = getGoalArchiveKey(completedGoal);
    const archiveMap = new Map(appState.completedGoals.map((goal) => [getGoalArchiveKey(goal), goal]));
    archiveMap.set(archiveKey, completedGoal);
    appState.completedGoals = Array.from(archiveMap.values()).sort((a, b) => {
      return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
    });
    appState.goals = appState.goals.filter((goal) => goal.id !== completedGoal.id);
    flowState.selectedCompletedGoalId = completedGoal.id;
    flowState.timelineSelectionId = "";

    if (appState.goals.length) {
      appState.primaryGoalId = appState.goals[0].id;
      appState.goals = appState.goals.map((goal) => ({
        ...goal,
        isPrimary: goal.id === appState.primaryGoalId
      }));
      syncProfileFromPrimaryGoal();
      syncDerivedProfileFields();
    } else {
      appState.primaryGoalId = "";
      appState.profile = createEmptyProfile();
      appState.roadmap = generateRoadmap(appState.profile);
    }
  }

  function openGoalCelebration(goal) {
    const stats = getGoalCelebrationStats(goal);
    flowState.goalCelebration = {
      goalId: goal.id,
      goalTitle: goal.title,
      line: GOAL_COMPLETION_LINES[Math.floor(Math.random() * GOAL_COMPLETION_LINES.length)],
      secondaryLine: GOAL_COMPLETION_SECONDARY_LINE,
      stats
    };
    renderGoalCelebration();
    openModal("goal-celebration-modal");
  }

  function renderGoalCelebration() {
    const celebration = flowState.goalCelebration;
    if (!celebration) {
      return;
    }

    elements.goalCelebrationTitle.textContent = "GOAL COMPLETE.";
    elements.goalCelebrationGoalName.textContent = celebration.goalTitle || "";
    elements.goalCelebrationGoalName.classList.toggle("hidden", !celebration.goalTitle);
    elements.goalCelebrationLine.textContent = celebration.line;
    elements.goalCelebrationSecondary.textContent = celebration.secondaryLine;
    elements.goalCelebrationStats.innerHTML = renderStatsMarkup(celebration.stats);
    prepareCelebrationSequence();
  }

  function prepareCelebrationSequence() {
    const stats = Array.from(elements.goalCelebrationStats.querySelectorAll(".celebration-stat"));
    stats.forEach((stat, index) => {
      stat.style.setProperty("--celebration-delay", `${0.44 + index * 0.1}s`);
    });

    [elements.goalCelebrationNextBtn, elements.goalCelebrationArchiveBtn].forEach((button, index) => {
      button.style.setProperty("--celebration-delay", `${0.82 + index * 0.08}s`);
    });
  }

  function restartCelebrationSequence() {
    const modal = elements.goalCelebrationModal;
    if (!modal) {
      return;
    }

    modal.classList.remove("is-entering");
    void modal.offsetWidth;
    modal.classList.add("is-entering");
  }

  async function completePrimaryGoal(finalMilestones) {
    const completedAt = getActiveDateTimestamp();
    const archivedGoal = buildArchivedPrimaryGoal(completedAt, finalMilestones);
    if (!archivedGoal) {
      return;
    }

    archiveCompletedPrimaryGoal(archivedGoal);
    await ensureMissionForToday(true);
    saveState();
    renderDashboard();
    showTimelineFeedback(TIMELINE_GOAL_COMPLETE_MESSAGE.title, TIMELINE_GOAL_COMPLETE_MESSAGE.body);
    openGoalCelebration(archivedGoal);
  }

  // Complete the current stored roadmap item and advance to the next saved milestone without re-calling AI.
  async function completeCurrentMilestone() {
    await applyCurrentMilestoneCompletion({
      skipConfirm: false,
      feedbackTitle: "Milestone complete.",
      feedbackBody: "The next roadmap step is now active."
    });
  }

  async function applyCurrentMilestoneCompletion(options = {}) {
    syncMilestoneTimeline();
    const profile = appState.profile;
    const milestones = getMilestones(profile).map((milestone) => ({ ...milestone }));
    const currentIndex = milestones.findIndex((milestone) => !milestone.completedAt);
    if (currentIndex === -1) {
      return;
    }

    if (!options.skipConfirm && !window.confirm("Complete this milestone?")) {
      return;
    }

    const completedAt = getActiveDateTimestamp();
    milestones[currentIndex] = {
      ...milestones[currentIndex],
      detail: milestones[currentIndex].detail || getMilestoneDetail(milestones[currentIndex], profile),
      completedAt
    };
    // Use the actual goal target as the stopping condition, even if older milestone arrays are out of shape.
    const isFinalMilestone = currentIndex === milestones.length - 1 || isFinalGoalMilestone(milestones[currentIndex], profile);
    const completedMilestone = milestones[currentIndex];

    if (isFinalMilestone) {
      await completePrimaryGoal(milestones);
      return;
    }

    const nextMilestone = milestones[currentIndex + 1] || milestones[milestones.length - 1] || null;
    profile.roadmap = milestones;
    profile.milestones = milestones;
    profile.currentMilestoneIndex = Math.min(currentIndex + 1, Math.max(milestones.length - 1, 0));
    profile.milestoneSelectionId = nextMilestone?.id || "";
    profile.phaseMilestone = nextMilestone?.label || profile.phaseMilestone;
    profile.phaseWhy = nextMilestone?.detail || "";
    profile.goalCompletedAt = "";

    syncPrimaryGoalFromProfile();
    clearExecutionPlansForGoal(appState.primaryGoalId);
    await ensureMissionForToday(true);
    saveState();
    renderDashboard();
    renderTimeline();
    pulseElement(elements.timelineCompleteBtn.closest(".timeline-detail"), "timeline-complete-pop");
    showTimelineFeedback(
      options.feedbackTitle || "Milestone complete.",
      options.feedbackBody || "The next roadmap step is now active."
    );
  }

  async function openMilestoneAdvancePrompt(options = {}) {
    const targetGoal = getMilestoneFlowGoal(options.goalId);
    const milestones = (Array.isArray(options.milestones)
      ? options.milestones
      : buildMilestoneFlowMilestones(targetGoal, options)
    ).map((milestone, index) => normalizeMilestone(milestone, index));
    const finalMilestone = milestones[milestones.length - 1] || null;
    flowState.pendingMilestoneAdvance = {
      mode: options.mode || "next",
      originSurface: options.originSurface || "",
      goalId: options.goalId || appState.primaryGoalId || "",
      profileId: appState.primaryGoalId || "primary",
      completedMilestoneId: options.completedMilestone?.id || "",
      finalMilestoneId: finalMilestone?.id || "",
      suggestion: null
    };

    resetMilestoneAdvanceModal();
    configureMilestoneAdvanceModal();
    elements.milestoneSuggestionLoading.classList.remove("hidden");
    openModal("milestone-next-modal");

    try {
      const suggestion = await requestNextMilestoneSuggestion(
        buildMilestoneSuggestionPayload(options.completedMilestone, milestones, options)
      );

      if (!flowState.pendingMilestoneAdvance) {
        return;
      }

      flowState.pendingMilestoneAdvance.suggestion = suggestion;
      populateMilestoneEditForm(suggestion);
      renderMilestoneSuggestionCard(suggestion);
      showMilestoneSuggestionView();

      if (flowState.pendingMilestoneAdvance?.mode !== "initial" && isSameMilestoneText(suggestion.title, finalMilestone?.label)) {
        setMilestoneAdvanceStatus(
          "This suggestion points straight at the final goal.",
          "Accept it to move directly to the finish line, or edit it into one more checkpoint."
        );
      }
    } catch (error) {
      if (!flowState.pendingMilestoneAdvance) {
        return;
      }

      elements.acceptMilestoneBtn.disabled = true;
      setMilestoneAdvanceStatus("AI suggestion unavailable.", error.message);
      showMilestoneSuggestionView();
    }
  }

  async function acceptSuggestedMilestone() {
    if (flowState.pendingRoadmapApproval) {
      await acceptRoadmapApproval();
      return;
    }
    const suggestion = flowState.pendingMilestoneAdvance?.suggestion;
    if (!suggestion?.title) {
      openMilestoneEditForm();
      return;
    }

    await applyApprovedMilestone(suggestion);
  }

  async function moveToFinalGoalTarget() {
    const pendingAdvance = flowState.pendingMilestoneAdvance;
    const targetGoal = getMilestoneFlowGoal(pendingAdvance?.goalId);
    const targetProfile = pendingAdvance?.goalId ? getProfileForGoal(targetGoal) : appState.profile;
    const milestones = getMilestones(targetProfile).map((milestone, index) => normalizeMilestone(milestone, index));
    const finalMilestone = getPendingFinalMilestone(milestones);

    if (finalMilestone) {
      if (pendingAdvance?.goalId) {
        saveGoalMilestoneState(pendingAdvance.goalId, {
          id: finalMilestone.id,
          label: finalMilestone.label,
          detail: finalMilestone.detail || "",
          milestones
        });
      } else {
        targetProfile.milestones = milestones;
        targetProfile.milestoneSelectionId = finalMilestone.id;
        targetProfile.phaseMilestone = finalMilestone.label;
        targetProfile.phaseWhy = finalMilestone.detail || "";
        syncPrimaryGoalFromProfile();
      }
      saveState();
    }

    flowState.pendingMilestoneAdvance = null;
    closeModal("milestone-next-modal");
    if (pendingAdvance?.mode === "initial" && (pendingAdvance.originSurface === "onboarding" || pendingAdvance.originSurface === "modal")) {
      await finalizeClarityFlow(pendingAdvance.originSurface || "onboarding");
    } else {
      renderDashboard();
      renderTimeline();
    }
    showTimelineFeedback("Path updated.", "Final goal is now the active target.");
  }

  async function saveNextMilestoneFromPrompt(event) {
    event.preventDefault();
    const title = elements.milestoneNextTitleInput.value.trim();
    const why = elements.milestoneNextWhyInput.value.trim();
    if (!title) {
      elements.milestoneNextTitleInput.focus();
      return;
    }

    await applyApprovedMilestone({ title, why });
  }

  async function applyApprovedMilestone(suggestion) {
    const pendingAdvance = flowState.pendingMilestoneAdvance;
    if (!pendingAdvance) {
      return;
    }

    const targetGoal = getMilestoneFlowGoal(pendingAdvance.goalId);
    const targetProfile = pendingAdvance.goalId ? getProfileForGoal(targetGoal) : appState.profile;
    const milestones = getMilestones(targetProfile).map((milestone, index) => normalizeMilestone(milestone, index));
    const finalMilestone = getPendingFinalMilestone(milestones);
    const title = (suggestion?.title || "").trim();
    const why = (suggestion?.why || "").trim();

    if (!title) {
      return;
    }

    if (isSameMilestoneText(title, finalMilestone?.label)) {
      await moveToFinalGoalTarget();
      return;
    }

    const insertAt = finalMilestone
      ? milestones.findIndex((milestone) => milestone.id === finalMilestone.id)
      : milestones.length;
    const nextMilestone = {
      id: createId("milestone"),
      label: title,
      detail: why,
      completedAt: null
    };

    milestones.splice(Math.max(insertAt, 0), 0, nextMilestone);
    if (pendingAdvance.goalId) {
      saveGoalMilestoneState(pendingAdvance.goalId, {
        id: nextMilestone.id,
        label: nextMilestone.label,
        detail: why,
        milestones
      });
    } else {
      targetProfile.milestones = milestones;
      targetProfile.milestoneSelectionId = nextMilestone.id;
      targetProfile.phaseMilestone = nextMilestone.label;
      targetProfile.phaseWhy = why;
      syncPrimaryGoalFromProfile();
    }

    saveState();
    flowState.pendingMilestoneAdvance = null;
    closeModal("milestone-next-modal");
    if (pendingAdvance.mode === "initial" && (pendingAdvance.originSurface === "onboarding" || pendingAdvance.originSurface === "modal")) {
      await finalizeClarityFlow(pendingAdvance.originSurface || "onboarding");
      showTimelineFeedback("Path set.", "Your first real milestone is now active.");
    } else {
      renderDashboard();
      renderTimeline();
      showTimelineFeedback("Path updated.", "The next real milestone is now in focus.");
    }
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

  // Daily missions are AI-first in V5.3. We only touch the legacy planner when the AI path fails.
  async function ensureMissionForToday(forceRegenerate) {
    if (!appState.daily[activeDateKey]) {
      return null;
    }

    const savedAIMission = getSavedMissionForDate(activeDateKey);
    if (!forceRegenerate && savedAIMission) {
      appState.missions[activeDateKey] = savedAIMission;
      saveState();
      return savedAIMission;
    }

    const existingMission = normalizeMissionRecord(appState.missions[activeDateKey], activeDateKey);
    if (!forceRegenerate && existingMission?.items?.length) {
      appState.missions[activeDateKey] = existingMission;
      saveState();
      return existingMission;
    }

    const context = getTodayContext();
    setMissionPlanningState(true);
    let plan = null;

    try {
      plan = await generateAIMissionPlan(context);
    } catch (error) {
      if (savedAIMission) {
        console.error("AI mission refresh failed. Keeping the saved AI mission for today.", error);
        appState.missions[activeDateKey] = savedAIMission;
        saveState();
        setMissionPlanningState(false, savedAIMission);
        return savedAIMission;
      }

      debugLog("MISSION LOAD: fallback activated", {
        date: activeDateKey,
        reason: error.message
      });
      console.error("AI mission planning failed. Falling back to local mission logic.", error);
      plan = buildFallbackMissionPlan(context, error);
    }

    const savedExecutionPlan = plan.executionPlan
      ? saveCurrentMilestoneExecutionPlan(context, plan.executionPlan)
      : getCurrentMilestoneExecutionPlan(context.primaryGoal, context.profile, getCurrentMilestone(context.profile));

    appState.missions[activeDateKey] = normalizeMissionRecord({
      ...plan,
      executionPlan: savedExecutionPlan,
      generatedAt: new Date().toISOString()
    }, activeDateKey);
    if (appState.missions[activeDateKey].source === "ai") {
      debugLog("MISSION LOAD: AI mission saved", {
        date: activeDateKey,
        selectedSupportingGoals: appState.missions[activeDateKey].selectedSupportingGoals
      });
    }
    syncDailyPerformanceFromMission();
    saveState();
    setMissionPlanningState(false, appState.missions[activeDateKey]);
    return appState.missions[activeDateKey];
  }

  async function generateAIMissionPlan(context) {
    const payload = buildDailyMissionPayload(context);
    debugLog("MISSION LOAD: AI request started", {
      date: activeDateKey,
      hasSupportingGoals: context.supportingGoals.length
    });
    const response = await requestDailyMissionPlan(payload);
    debugLog("MISSION LOAD: AI response received", {
      date: activeDateKey,
      missionCount: Array.isArray(response?.missions) ? response.missions.length : 0
    });
    return normalizeAIMissionPlan(response, context);
  }

  function normalizeAIMissionPlan(plan, context) {
    const currentMilestone = getCurrentMilestone(context.profile);
    const selectedSupportingGoals = Array.from(new Set(
      (Array.isArray(plan.missions) ? plan.missions : [])
        .filter((mission) => (mission?.goal_type || "").toString().trim() === "supporting")
        .map((mission) => (mission?.goal_title || "").toString().trim())
        .filter(Boolean)
    ));
    const executionPlan = normalizeMilestoneExecutionPlan(plan.execution_plan);

    return {
      title: (plan.daily_focus || "AI planned day").toString().trim(),
      subtitle: currentMilestone?.label
        ? `Current milestone: ${currentMilestone.label}`
        : "Current milestone anchored plan",
      dailyFocus: (plan.daily_focus || "").toString().trim(),
      loadLevel: formatMissionLoadLabel(plan.mission_load),
      missionLoad: (plan.mission_load || "standard").toString().trim().toLowerCase(),
      source: "ai",
      sourceLabel: "AI planned",
      planStatus: "ai",
      selectedSupportingGoals,
      milestoneEstimate: (plan.milestone_estimate || "").toString().trim(),
      milestoneEstimateDays: Number(plan.milestone_estimate_days) || null,
      executionPlan,
      aiPlan: {
        daily_focus: (plan.daily_focus || "").toString().trim(),
        mission_load: (plan.mission_load || "standard").toString().trim().toLowerCase(),
        selected_supporting_goals: selectedSupportingGoals,
        execution_plan: executionPlan,
        missions: Array.isArray(plan.missions) ? plan.missions.map((mission) => ({
          goal_type: (mission?.goal_type || "").toString().trim(),
          goal_title: (mission?.goal_title || "").toString().trim(),
          title: (mission?.title || "").toString().trim(),
          summary: (mission?.summary || "").toString().trim(),
          completes_milestone: Boolean(mission?.completes_milestone),
          subtasks: Array.isArray(mission?.subtasks)
            ? mission.subtasks.map((subtask) => (subtask || "").toString().trim()).filter(Boolean)
            : []
        })) : [],
        milestone_estimate: (plan.milestone_estimate || "").toString().trim(),
        milestone_estimate_days: Number(plan.milestone_estimate_days) || null,
        status: "ai"
      },
      items: (Array.isArray(plan.missions) ? plan.missions : []).map((mission, index) => normalizeMissionItem({
        id: `${activeDateKey}-${index + 1}`,
        title: mission.title,
        text: mission.title,
        summary: mission.summary,
        category: getMissionCategoryKey(mission),
        completed: false,
        goalType: mission.goal_type,
        goalTitle: mission.goal_title,
        completesMilestone: Boolean(mission.completes_milestone),
        expanded: false,
        subtasks: Array.isArray(mission.subtasks)
          ? mission.subtasks.map((subtask, subtaskIndex) => ({
            id: `${activeDateKey}-${index + 1}-subtask-${subtaskIndex + 1}`,
            text: subtask,
            completed: false
          }))
          : []
      }, `${activeDateKey}-${index + 1}`))
    };
  }

  function buildFallbackMissionPlan(context, error) {
    const plan = generateMissionPlan(context);
    return {
      ...plan,
      source: "fallback",
      sourceLabel: "Fallback mode",
      planStatus: "fallback",
      selectedSupportingGoals: [],
      aiPlan: null,
      executionPlan: getCurrentMilestoneExecutionPlan(context.primaryGoal, context.profile, getCurrentMilestone(context.profile)),
      missionLoad: (plan.loadLevel || "Standard").toLowerCase(),
      dailyFocus: plan.title,
      milestoneEstimate: getFallbackMilestoneEstimate(context.profile),
      milestoneEstimateDays: null,
      subtitle: error?.message ? `${plan.subtitle} Fallback mode is active.` : plan.subtitle
    };
  }

  function setMissionPlanningState(isPlanning, mission = null) {
    if (!elements.regenerateMissionBtn) {
      return;
    }

    elements.regenerateMissionBtn.disabled = isPlanning;
    elements.regenerateMissionBtn.textContent = isPlanning ? "Planning..." : "Refresh Mission";

    if (!isPlanning || !elements.missionPlanStatus) {
      return;
    }

    elements.missionPlanStatus.textContent = "Planning with AI...";
    elements.missionLoadChip.classList.add("hidden");
    elements.missionEstimateChip.classList.add("hidden");
  }

  // Keep one saved mission record per app date, and prefer a valid saved AI plan for the whole day.
  function getSavedMissionForDate(dateKey = activeDateKey) {
    debugLog("MISSION LOAD: checking saved mission for date", dateKey);
    const savedMission = normalizeMissionRecord(appState.missions[dateKey], dateKey);

    if (isValidSavedAIMission(savedMission)) {
      debugLog("MISSION LOAD: using saved AI mission", dateKey);
      return savedMission;
    }

    debugLog("MISSION LOAD: no saved AI mission found", dateKey);
    return null;
  }

  function isValidSavedAIMission(mission) {
    if (!mission || mission.source !== "ai") {
      return false;
    }

    if (!mission.dailyFocus || !Array.isArray(mission.items) || !mission.items.length) {
      return false;
    }

    return mission.items.every((item) => {
      const title = (item?.title || item?.text || "").toString().trim();
      return Boolean(title);
    });
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
      missionLoad: loadProfile.level.toLowerCase(),
      items: tasks.map((item, index) => ({
        id: `${activeDateKey}-${index + 1}`,
        title: item.text,
        text: item.text,
        summary: "",
        category: item.category,
        completed: false,
        role: item.role,
        goalType: item.role === "main" ? "primary" : item.category === "reset" ? "reset" : "supporting",
        goalTitle: item.role === "main"
          ? (context.primaryGoal?.title || context.profile.goalTitle || "Primary goal")
          : item.category === "reset"
            ? "Reset"
            : context.supportingGoals.find((goal) => inferGoalCategory(goal) === getMissionCategoryKey(item))?.title || "Supporting goal",
        expanded: false,
        subtasks: []
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
    const mission = normalizeMissionRecord(appState.missions[activeDateKey], activeDateKey);
    appState.missions[activeDateKey] = mission;
    const hasActiveGoal = hasActiveGoalProfile(profile) || Boolean(getPrimaryGoal());
    if (hasActiveGoal) {
      syncMilestoneTimeline();
    }
    const currentMilestone = hasActiveGoal ? getCurrentMilestone(profile) : null;
    const timelineProgress = hasActiveGoal ? getTimelineProgress(profile) : { percent: 0 };

    elements.todayDate.textContent = formatDisplayDate(new Date(`${activeDateKey}T12:00:00`));
    elements.streakCount.textContent = String(appState.streak || 0);
    elements.todayState.textContent = daily.state;
    elements.todayMode.textContent = daily.mode;
    elements.todaySummary.textContent = daily.coachResponse;
    elements.momentumStatus.textContent = getMomentumStatus(getTodayContext());

    elements.goalCardTitle.textContent = hasActiveGoal ? (profile.goalTitle || "Your main mission") : "No active goal";
    elements.goalWhyText.textContent = hasActiveGoal
      ? (profile.why || "Clarity gets stronger when you keep returning to what matters.")
      : "Your last completed goal is safely archived. Set the next one when you're ready.";
    elements.goalBaselineText.textContent = hasActiveGoal ? (profile.baseline || "Not clear yet") : "Archive saved";
    elements.goalTargetText.textContent = hasActiveGoal ? (profile.target || "Still taking shape") : "Choose the next meaningful target";

    if (hasActiveGoal && profile.timeline) {
      elements.goalTimelineChip.textContent = profile.timeline;
      elements.goalTimelineChip.classList.remove("hidden");
    } else {
      elements.goalTimelineChip.classList.add("hidden");
    }

    const progressPercent = hasActiveGoal ? calculateProgressSignal(profile) : { value: 0, label: "Awaiting clarity" };
    elements.progressLabel.textContent = hasActiveGoal ? progressPercent.label : "Awaiting clarity";
    elements.progressFill.style.width = `${progressPercent.value}%`;
    elements.goalCard.classList.toggle("goal-card-complete", false);

    syncDailyPerformanceFromMission();
    syncRoadmap();
    saveState();
    const roadmap = appState.roadmap;
    const nextMilestone = hasActiveGoal
      ? (currentMilestone?.label || profile.phaseMilestone || getFallbackMilestone(profile))
      : "No active milestone";
    elements.phaseCardTitle.textContent = hasActiveGoal ? (profile.phaseName || roadmap[0].title) : "Set the next goal";
    elements.phaseFocusText.textContent = hasActiveGoal
      ? (profile.phaseFocus || profile.gap || "Choose the next useful thing and do it well")
      : "Completed goals stay archived. The next one starts when you decide it does.";
    elements.phaseMilestoneText.textContent = nextMilestone;
    elements.phaseWhyText.textContent = hasActiveGoal
      ? getMilestoneDetail(currentMilestone, profile)
      : "Use Completed Goals to revisit what you finished.";
    elements.viewTimelineBtn.textContent = `View Timeline (${timelineProgress.percent}%)`;
    elements.viewTimelineBtn.disabled = !hasActiveGoal;

    renderGoalsList();
    updateCompletedGoalsButton();
    renderRoadmap(profile);
    elements.missionTitle.textContent = mission.dailyFocus || mission.title || "Small moves still count.";
    elements.missionSubtitle.textContent = mission.subtitle;
    renderMissionMeta(mission);
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
    if (!document.getElementById("completed-goals-modal")?.classList.contains("hidden")) {
      renderCompletedGoalsArchive();
    }
    showScreen("dashboard");
  }

  function updateCompletedGoalsButton() {
    const count = appState.completedGoals.length;
    elements.completedGoalsBtn.textContent = count ? `Completed Goals (${count})` : "Completed Goals";
  }

  function renderCompletedGoalsArchive() {
    const completedGoals = [...appState.completedGoals].sort((a, b) => {
      return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
    });
    elements.completedGoalsList.innerHTML = "";
    elements.completedGoalsEmpty.classList.toggle("hidden", completedGoals.length > 0);
    elements.completedGoalDetail.classList.toggle("hidden", completedGoals.length === 0);

    if (!completedGoals.length) {
      elements.completedGoalTimeline.innerHTML = "";
      elements.completedGoalDetailStats.innerHTML = "";
      return;
    }

    if (!completedGoals.some((goal) => goal.id === flowState.selectedCompletedGoalId)) {
      flowState.selectedCompletedGoalId = completedGoals[0].id;
    }

    completedGoals.forEach((goal) => {
      const stats = getGoalCelebrationStats(goal);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `completed-goal-card${goal.id === flowState.selectedCompletedGoalId ? " is-selected" : ""}`;
      card.innerHTML = `
        <div class="completed-goal-card-head">
          <div>
            <p class="card-label">Completed Goal</p>
            <h3>${escapeHtml(goal.title || "Completed goal")}</h3>
          </div>
          <span class="chip">${escapeHtml(formatGoalCategory(goal.category || inferGoalCategory(goal)))}</span>
        </div>
        <p class="completed-goal-summary">${escapeHtml(goal.summary || "Finished and archived.")}</p>
        <div class="completed-goal-card-meta">
          <span class="completed-goal-progress">100%</span>
          <span class="muted">${escapeHtml(formatArchiveCompletionMeta(goal, stats))}</span>
        </div>
      `;
      card.addEventListener("click", () => {
        flowState.selectedCompletedGoalId = goal.id;
        renderCompletedGoalsArchive();
      });
      elements.completedGoalsList.appendChild(card);
    });

    renderCompletedGoalDetail(completedGoals.find((goal) => goal.id === flowState.selectedCompletedGoalId) || completedGoals[0]);
  }

  function formatArchiveCompletionMeta(goal, stats) {
    const parts = [];
    if (goal.completedAt) {
      parts.push(formatDisplayDate(new Date(goal.completedAt)));
    }
    const milestoneStat = stats.find((stat) => stat.label === "Milestones");
    if (milestoneStat) {
      parts.push(`${milestoneStat.value} milestones`);
    }
    return parts.join(" | ");
  }

  function renderCompletedGoalDetail(goal) {
    if (!goal) {
      elements.completedGoalDetail.classList.add("hidden");
      return;
    }

    const stats = getGoalCelebrationStats(goal);
    elements.completedGoalDetail.classList.remove("hidden");
    elements.completedGoalDetailTitle.textContent = goal.title || "Completed goal";
    elements.completedGoalDetailText.textContent = goal.summary || goal.profileSnapshot?.phaseWhy || "Finished and archived.";
    if (goal.completedAt) {
      elements.completedGoalDetailDate.textContent = formatDisplayDate(new Date(goal.completedAt));
      elements.completedGoalDetailDate.classList.remove("hidden");
    } else {
      elements.completedGoalDetailDate.classList.add("hidden");
    }
    elements.completedGoalDetailStats.innerHTML = renderStatsMarkup(stats);
    renderCompletedGoalTimeline(goal);
  }

  function openNextGoalBuilder() {
    closeModal("goal-celebration-modal");
    if (appState.goals.length) {
      openGoalManager();
      return;
    }

    appState.profile = createEmptyProfile();
    flowState.modalStep = 0;
    fillProfileForms();
    openModal("profile-modal");
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

  function renderMissionMeta(mission) {
    const sourceLabel = mission?.sourceLabel || (mission?.source === "ai" ? "AI planned" : "Fallback mode");
    elements.missionPlanStatus.textContent = sourceLabel || "Fallback mode";

    const loadLabel = mission?.missionLoad ? `Load: ${formatMissionLoadLabel(mission.missionLoad)}` : "";
    const estimateLabel = getMissionEstimateLabel(mission);

    elements.missionLoadChip.textContent = loadLabel;
    elements.missionLoadChip.classList.toggle("hidden", !loadLabel);
    elements.missionEstimateChip.textContent = estimateLabel;
    elements.missionEstimateChip.classList.toggle("hidden", !estimateLabel);
  }

  function renderMissionItems(items) {
    elements.missionList.innerHTML = "";
    const normalizedItems = (Array.isArray(items) ? items : []).map((item, index) =>
      normalizeMissionItem(item, `${activeDateKey}-${index + 1}`)
    );

    normalizedItems.forEach((item, index) => {
      const wrapper = document.createElement("div");
      const hasSubtasks = item.subtasks.length > 0;
      wrapper.className = `mission-item ${item.completed ? "is-complete" : ""} ${hasSubtasks ? "has-subtasks" : ""} ${item.expanded ? "is-expanded" : ""}`.trim();
      wrapper.innerHTML = hasSubtasks
        ? `
          <input class="mission-check" type="checkbox" ${item.completed ? "checked" : ""} aria-label="Mark mission complete">
          <div class="mission-meta">
            <div class="mission-topline">
              <span class="mission-tag">${escapeHtml(formatMissionTag(item))}</span>
              ${item.goalTitle ? `<span class="mission-goal-title">${escapeHtml(item.goalTitle)}</span>` : ""}
            </div>
            <button class="mission-toggle" type="button" aria-expanded="${item.expanded ? "true" : "false"}">
              <strong>${escapeHtml(item.title || item.text || "Mission")}</strong>
              ${item.summary ? `<p class="mission-summary">${escapeHtml(item.summary)}</p>` : ""}
              <span class="mission-toggle-text">${item.expanded ? "Hide subtasks" : `Show subtasks (${item.subtasks.length})`}</span>
            </button>
            <div class="mission-subtasks-shell">
              <div class="mission-subtasks">
                <div class="mission-subtasks-list"></div>
              </div>
            </div>
          </div>
          <span class="mission-encouragement hidden"></span>
        `
        : `
          <input class="mission-check" type="checkbox" ${item.completed ? "checked" : ""} aria-label="Mark mission complete">
          <div class="mission-meta">
            <div class="mission-topline">
              <span class="mission-tag">${escapeHtml(formatMissionTag(item))}</span>
              ${item.goalTitle ? `<span class="mission-goal-title">${escapeHtml(item.goalTitle)}</span>` : ""}
            </div>
            <div class="mission-copy">
              <strong>${escapeHtml(item.title || item.text || "Mission")}</strong>
              ${item.summary ? `<p class="mission-summary">${escapeHtml(item.summary)}</p>` : ""}
            </div>
          </div>
          <span class="mission-encouragement hidden"></span>
        `;

      const checkbox = wrapper.querySelector(".mission-check");
      const encouragement = wrapper.querySelector(".mission-encouragement");

      checkbox.addEventListener("change", async () => {
        const mission = appState.missions[activeDateKey];
        mission.items[index].completed = checkbox.checked;
        if (Array.isArray(mission.items[index].subtasks) && mission.items[index].subtasks.length) {
          mission.items[index].subtasks = mission.items[index].subtasks.map((subtask) => ({
            ...subtask,
            completed: checkbox.checked
          }));
        }
        wrapper.classList.toggle("is-complete", checkbox.checked);
        saveState();
        syncDailyPerformanceFromMission();
        if (checkbox.checked) {
          triggerTaskCompletionFeedback(wrapper, encouragement);
        }
        if (await maybeAutoCompleteMilestoneFromMission(mission.items[index])) {
          return;
        }
        renderMissionItems(mission.items);
        renderMissionCompletionState(appState.missions[activeDateKey]);
      });

      if (hasSubtasks) {
        const toggle = wrapper.querySelector(".mission-toggle");
        const list = wrapper.querySelector(".mission-subtasks-list");

        toggle.addEventListener("click", () => {
          const mission = appState.missions[activeDateKey];
          const nextExpanded = !mission.items[index].expanded;
          mission.items[index].expanded = nextExpanded;
          saveState();
          wrapper.classList.toggle("is-expanded", nextExpanded);
          toggle.setAttribute("aria-expanded", nextExpanded ? "true" : "false");
          const toggleText = toggle.querySelector(".mission-toggle-text");
          if (toggleText) {
            toggleText.textContent = nextExpanded ? "Hide subtasks" : `Show subtasks (${mission.items[index].subtasks.length})`;
          }
        });

        item.subtasks.forEach((subtask, subtaskIndex) => {
          const subtaskRow = document.createElement("label");
          subtaskRow.className = `mission-subtask ${subtask.completed ? "is-complete" : ""}`;
          subtaskRow.innerHTML = `
            <input class="mission-subtask-check" type="checkbox" ${subtask.completed ? "checked" : ""} aria-label="Mark subtask complete">
            <span class="mission-subtask-text">${escapeHtml(subtask.text)}</span>
          `;

          const subtaskCheck = subtaskRow.querySelector(".mission-subtask-check");
          subtaskCheck.addEventListener("change", async () => {
            const mission = appState.missions[activeDateKey];
            const activeItem = mission.items[index];
            activeItem.subtasks[subtaskIndex].completed = subtaskCheck.checked;
            activeItem.completed = activeItem.subtasks.every((entry) => entry.completed);
            saveState();
            syncDailyPerformanceFromMission();
            if (subtaskCheck.checked) {
              triggerTaskCompletionFeedback(wrapper, encouragement);
            }
            if (await maybeAutoCompleteMilestoneFromMission(activeItem)) {
              return;
            }
            renderMissionItems(mission.items);
            renderMissionCompletionState(mission);
          });

          list.appendChild(subtaskRow);
        });
      }

      elements.missionList.appendChild(wrapper);
    });
  }

  function renderMissionCompletionState(mission) {
    const items = (mission?.items || []).map((item, index) => normalizeMissionItem(item, `${activeDateKey}-${index + 1}`));
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

  async function maybeAutoCompleteMilestoneFromMission(item) {
    if (!item?.completed || !item?.completesMilestone) {
      return false;
    }

    await applyCurrentMilestoneCompletion({
      skipConfirm: true,
      feedbackTitle: "Milestone complete.",
      feedbackBody: "AI marked this mission as a valid milestone finish."
    });
    return true;
  }

  function getMissionCategoryKey(item) {
    if ((item?.goalType || item?.goal_type) === "reset") {
      return "reset";
    }
    if (item?.category) {
      const raw = item.category.toString().trim().toLowerCase();
      if (raw.includes("health")) return "health";
      if (raw.includes("family")) return "family";
      if (raw.includes("money") || raw.includes("finance") || raw.includes("work")) return "money";
      if (raw.includes("growth") || raw.includes("personal")) return "growth";
      if (raw.includes("reset")) return "reset";
      return raw;
    }
    return inferGoalCategory({ title: item?.goalTitle || item?.goal_title || item?.title || item?.text || "" });
  }

  function formatMissionTag(item) {
    const category = getMissionCategoryKey(item);
    if (category === "reset") {
      return "Reset";
    }
    return formatGoalCategory(category);
  }

  function formatMissionLoadLabel(value) {
    const labels = {
      light: "Light",
      standard: "Standard",
      heavy: "Heavy",
      peak: "Heavy"
    };
    return labels[(value || "").toString().trim().toLowerCase()] || "Standard";
  }

  function getMissionEstimateLabel(mission) {
    const estimate = mission?.milestoneEstimate || "";
    if (estimate) {
      return `Milestone estimate: ${estimate}`;
    }
    if (Number.isFinite(mission?.milestoneEstimateDays)) {
      return `Milestone estimate: ${mission.milestoneEstimateDays} days`;
    }
    return "";
  }

  function getFallbackMilestoneEstimate(profile) {
    if (profile?.timeline) {
      return profile.timeline;
    }
    const milestoneCount = getMilestones(profile).length || 1;
    return `${Math.max(milestoneCount * 7, 7)} to ${Math.max(milestoneCount * 14, 14)} days`;
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
    if (id === "completed-goals-modal") {
      renderCompletedGoalsArchive();
    }
    if (id === "goal-celebration-modal") {
      renderGoalCelebration();
    }
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    if (id === "goal-celebration-modal") {
      restartCelebrationSequence();
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    if (id === "milestone-next-modal") {
      resetMilestoneAdvanceModal();
      flowState.pendingMilestoneAdvance = null;
      flowState.pendingRoadmapApproval = null;
    }
    if (id === "goal-celebration-modal") {
      modal.classList.remove("is-entering");
    }
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

