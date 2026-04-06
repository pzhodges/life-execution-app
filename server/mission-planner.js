const { OPENAI_MISSION_MODEL } = require("./config");
const { createStructuredResponseWithDebug } = require("./openai");

const missionSchema = {
  name: "daily_mission_plan",
  definition: {
    type: "object",
    additionalProperties: false,
    required: [
      "daily_focus",
      "mission_load",
      "milestone_estimate",
      "milestone_estimate_days",
      "missions"
    ],
    properties: {
      daily_focus: {
        type: "string",
        minLength: 1,
        maxLength: 160
      },
      mission_load: {
        type: "string",
        enum: ["light", "standard", "heavy"]
      },
      milestone_estimate: {
        type: "string",
        minLength: 1,
        maxLength: 60
      },
      milestone_estimate_days: {
        type: "integer",
        minimum: 1,
        maximum: 3650
      },
      missions: {
        type: "array",
        minItems: 2,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["goal_type", "goal_title", "title", "summary", "subtasks", "completes_milestone"],
          properties: {
            goal_type: {
              type: "string",
              enum: ["primary", "supporting", "reset"]
            },
            goal_title: {
              type: "string",
              minLength: 1,
              maxLength: 140
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 120
            },
            summary: {
              type: "string",
              minLength: 1,
              maxLength: 240
            },
            subtasks: {
              type: "array",
              minItems: 0,
              maxItems: 5,
              items: {
                type: "string",
                minLength: 1,
                maxLength: 120
              }
            },
            completes_milestone: {
              type: "boolean"
            }
          }
        }
      }
    }
  }
};

const executionPlanSchema = {
  name: "milestone_execution_plan",
  definition: {
    type: "object",
    additionalProperties: false,
    required: [
      "milestone_title",
      "estimated_days",
      "progression_focus",
      "required_action_categories",
      "weekly_rhythm",
      "recovery_needs",
      "completion_criteria",
      "can_complete_with_single_mission"
    ],
    properties: {
      milestone_title: { type: "string", minLength: 1, maxLength: 220 },
      estimated_days: { type: "integer", minimum: 1, maximum: 3650 },
      progression_focus: { type: "string", minLength: 1, maxLength: 220 },
      required_action_categories: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: { type: "string", minLength: 1, maxLength: 120 }
      },
      weekly_rhythm: { type: "string", minLength: 1, maxLength: 240 },
      recovery_needs: { type: "string", minLength: 1, maxLength: 220 },
      completion_criteria: {
        type: "array",
        minItems: 1,
        maxItems: 6,
        items: { type: "string", minLength: 1, maxLength: 160 }
      },
      can_complete_with_single_mission: { type: "boolean" }
    }
  }
};

async function generateDailyMissionPlan(payload = {}) {
  const context = normalizeMissionPayload(payload);
  if (!context.primary_goal?.title) {
    throw new Error("Primary goal is required.");
  }

  let executionPlan;
  let executionPlanDebug = null;
  try {
    const executionResult = await ensureMilestoneExecutionPlan(context);
    executionPlan = executionResult.plan;
    executionPlanDebug = executionResult.debug;
  } catch (error) {
    error.stage = error.stage || "execution-plan";
    throw error;
  }

  let openAIResult;
  try {
    openAIResult = await createStructuredResponseWithDebug({
      instructions: buildMissionInstructions(executionPlan),
      input: buildMissionPrompt(context, executionPlan),
      schema: missionSchema,
      maxOutputTokens: 1100,
      model: OPENAI_MISSION_MODEL
    });
  } catch (error) {
    error.stage = error.stage || "extraction";
    throw error;
  }

  let normalizedPlan;
  try {
    normalizedPlan = normalizeMissionPlan(openAIResult.parsed, context, executionPlan);
  } catch (error) {
    error.stage = error.stage || "normalization";
    error.rawResponse = openAIResult.rawResponse;
    error.extractedContent = openAIResult.extractedContent;
    error.parsedMission = openAIResult.parsed;
    throw error;
  }

  return {
    plan: normalizedPlan,
    debug: {
      executionPlan,
      executionPlanDebug,
      rawResponse: openAIResult.rawResponse,
      extractedContent: openAIResult.extractedContent,
      parsedMission: openAIResult.parsed,
      normalizedPlan
    }
  };
}

function buildMissionInstructions(executionPlan) {
  return [
    "You are the AI Mission Engine for Life Execution Version 5.3.",
    "Your job is to generate the user's full daily mission plan like a practical real-world coach, not a generic task generator.",
    "AI is the source of truth when you succeed, so do not produce generic filler.",
    "Always include at least one mission for the primary goal.",
    "Include zero to two supporting goals total, only from the provided supporting goals list.",
    "You may include one reset mission when it realistically protects execution for today.",
    "Mission count must match the user's state: Burned Out 2 to 3, Stressed 2 to 4, Neutral 3 to 4, Good 3 to 5, Locked In 4 to 6.",
    "Every mission must be specific, actionable, realistic for one day, and clearly tied to the current milestone.",
    "Use the user's baseline, current milestone, and the provided milestone execution plan as anchors.",
    "The execution plan is the hidden source of truth for how this milestone gets completed.",
    "Only assign missions that directly advance the milestone, support the milestone in a necessary way, or protect the user's ability to keep progressing toward the milestone.",
    "Do not assign loosely related tasks that would not realistically help complete the milestone.",
    "If the user is early relative to the milestone, choose beginner or build-up actions close to baseline.",
    "If the user is closer to the milestone, choose proving or readiness actions that show progress toward the milestone.",
    "Do not act like the user has already reached the milestone if the baseline shows they have not.",
    "Progression must be gradual: early work should emphasize technique, consistency, volume, and foundation; later work can emphasize heavier loads, sharper execution, and milestone readiness.",
    "Never assume max effort daily.",
    "Use recent mission history to create daily variety instead of repeating the same stress pattern.",
    "If the primary goal is physical training, recovery must be respected.",
    "For physical goals, never assign the same muscle group hard every day.",
    "For strength goals such as bench press, chest or bench-focused work should happen at most 2 to 3 times per week.",
    "For strength goals, rotate across push, pull, legs, and rest or active recovery.",
    "For bench or upper-body strength goals, include supporting development over time for back, shoulders, triceps, and legs instead of focusing only on the main lift.",
    "For low-energy or recovery days, prefer mobility, walking, technique, nutrition, sleep, or light accessory work instead of another hard session.",
    "For strength, running, or fitness goals, milestone timelines should usually be measured in weeks to months, not a few days.",
    "For financial goals, timelines must align with actual income and savings capacity from the provided profile. Do not imply unrealistically fast savings growth.",
    "Use realistic adaptation rates: beginners usually improve faster, intermediates slower, advanced users slowest.",
    "Before finalizing, internally check: is this sustainable, is recovery included, is the timeline realistic, and would a real coach approve it. If not, adjust.",
    "The daily_focus should be a sharp single-line focus for today.",
    "The milestone estimate should estimate time from the user's current level to the current milestone, not to the final goal.",
    "Milestone estimates must be realistic for the difficulty gap and consistent between milestone_estimate text and milestone_estimate_days.",
    `Use the execution plan estimate as the stable base unless something in the request clearly invalidates it. Current stable estimated_days: ${executionPlan?.estimated_days || 0}.`,
    `Use the execution plan elapsed_days as context for where the user is inside the milestone: ${executionPlan?.elapsed_days || 0}.`,
    "You may set completes_milestone to true only when one completed mission could legitimately satisfy the milestone's completion criteria today.",
    "If completes_milestone is true, the summary and subtasks must clearly prove milestone readiness or direct milestone completion.",
    "Keep titles concrete and short, and summaries clear enough that the user knows exactly what success looks like today.",
    "Do not use vague tasks like stay disciplined, make progress, or work on your goal."
  ].join(" ");
}

function buildMissionPrompt(context, executionPlan) {
  return [
    "Generate today's mission plan for this user.",
    "Use the recent mission history to avoid repeating the same training stress on consecutive days when the goal is physical.",
    "Generate missions from the execution plan, not from the milestone title alone.",
    "",
    JSON.stringify(context, null, 2),
    "",
    "Milestone execution plan:",
    "",
    JSON.stringify(executionPlan, null, 2),
    "",
    "Return JSON that matches the required schema."
  ].join("\n");
}

function normalizeMissionPlan(result, context, executionPlan) {
  const safeLoad = cleanString(result?.mission_load).toLowerCase();
  const missionLoad = ["light", "standard", "heavy"].includes(safeLoad) ? safeLoad : "standard";
  const goalType = inferPrimaryGoalType(context);
  let milestoneEstimateDays = Number(result?.milestone_estimate_days);
  if (!Number.isFinite(milestoneEstimateDays) || milestoneEstimateDays < 1) {
    milestoneEstimateDays = Number(executionPlan?.estimated_days);
  }
  milestoneEstimateDays = applyEstimateGuardrails(milestoneEstimateDays, goalType, context);
  const missions = Array.isArray(result?.missions)
    ? result.missions.map((mission) => normalizeMissionItem(mission)).filter(Boolean)
    : [];
  const normalizedExecutionPlan = normalizeExecutionPlan(executionPlan, context, milestoneEstimateDays);

  return {
    daily_focus: cleanString(result?.daily_focus) || "Today's focus",
    mission_load: missionLoad,
    milestone_estimate: buildEstimateLabel(
      cleanString(result?.milestone_estimate) || buildEstimateLabel("", normalizedExecutionPlan.estimated_days),
      normalizedExecutionPlan.estimated_days
    ),
    milestone_estimate_days: Number.isFinite(milestoneEstimateDays) ? milestoneEstimateDays : 0,
    execution_plan: normalizedExecutionPlan,
    missions
  };
}

function normalizeMissionItem(mission) {
  const goalType = cleanString(mission?.goal_type).toLowerCase();
  const safeGoalType = ["primary", "supporting", "reset"].includes(goalType) ? goalType : "supporting";

  const normalized = {
    goal_type: safeGoalType,
    goal_title: cleanString(mission?.goal_title) || "Untitled goal",
    title: cleanString(mission?.title) || "Untitled mission",
    summary: cleanString(mission?.summary) || "",
    subtasks: Array.isArray(mission?.subtasks)
      ? mission.subtasks.map((item) => cleanString(item)).filter(Boolean)
      : [],
    completes_milestone: Boolean(mission?.completes_milestone)
  };

  return normalized.goal_title || normalized.title ? normalized : null;
}

function normalizeMissionPayload(payload) {
  const primaryGoal = payload.primaryGoal && typeof payload.primaryGoal === "object"
    ? payload.primaryGoal
    : {};
  const currentMilestone = payload.currentMilestone && typeof payload.currentMilestone === "object"
    ? payload.currentMilestone
    : {};
  const supportingGoals = Array.isArray(payload.supportingGoals)
    ? payload.supportingGoals
      .map((goal) => filterObject(goal, ["title", "why", "baseline", "milestone", "timeline", "category"]))
      .filter((goal) => Object.keys(goal).length)
      .slice(0, 4)
    : [];

  return {
    current_date: cleanString(payload.currentDate),
    what_matters_most_today: cleanString(payload.whatMattersMostToday),
    current_state: filterObject(payload.currentState),
    recent_streak: filterObject(payload.recentStreak),
    roadmap_progress: filterObject(payload.roadmapProgress),
    current_execution_plan: filterObject(payload.currentExecutionPlan),
    recent_mission_history: Array.isArray(payload.recentMissionHistory)
      ? payload.recentMissionHistory
        .map((day) => filterObject(day))
        .filter((day) => Object.keys(day).length)
        .slice(0, 4)
      : [],
    primary_goal: filterObject({
      title: primaryGoal.title || payload.primaryGoalTitle,
      why: primaryGoal.why || payload.primaryGoalWhy,
      baseline: primaryGoal.baseline || payload.baseline,
      target: primaryGoal.target || payload.finalGoal,
      timeline: primaryGoal.timeline || payload.timeline,
      category: primaryGoal.category,
      current_milestone: currentMilestone.label || payload.currentMilestone,
      current_milestone_why: currentMilestone.detail || payload.currentMilestoneWhy,
      baseline_to_milestone_gap: payload.baselineToMilestoneGap
    }),
    supporting_goals: supportingGoals,
    profile: filterObject(payload.profile),
    user_profile: filterObject(payload.userProfile),
    latest_life_update: filterObject(payload.latestLifeUpdate)
  };
}

function filterObject(record, allowedKeys) {
  if (!record || typeof record !== "object") {
    return {};
  }

  const source = allowedKeys
    ? allowedKeys.reduce((accumulator, key) => {
      accumulator[key] = record[key];
      return accumulator;
    }, {})
    : record;

  return Object.entries(source).reduce((accumulator, [key, value]) => {
    if (Array.isArray(value)) {
      const cleanValues = value.map((entry) => {
        if (entry && typeof entry === "object") {
          return filterObject(entry);
        }
        return cleanString(entry);
      }).filter((entry) => {
        if (entry && typeof entry === "object") {
          return Object.keys(entry).length;
        }
        return Boolean(entry);
      });
      if (cleanValues.length) {
        accumulator[key] = cleanValues;
      }
      return accumulator;
    }

    if (value && typeof value === "object") {
      const nested = filterObject(value);
      if (Object.keys(nested).length) {
        accumulator[key] = nested;
      }
      return accumulator;
    }

    const cleaned = cleanString(value);
    if (cleaned) {
      accumulator[key] = cleaned;
    }
    return accumulator;
  }, {});
}

function cleanString(value) {
  return (value || "").toString().trim();
}

async function ensureMilestoneExecutionPlan(context) {
  if (hasReusableExecutionPlan(context.current_execution_plan, context)) {
    const normalizedExistingPlan = normalizeExecutionPlan(context.current_execution_plan, context);
    return {
      plan: normalizedExistingPlan,
      debug: {
        reused: true,
        rawResponse: null,
        extractedContent: context.current_execution_plan,
        parsedExecutionPlan: context.current_execution_plan,
        normalizedExecutionPlan: normalizedExistingPlan
      }
    };
  }

  let openAIResult;
  try {
    openAIResult = await createStructuredResponseWithDebug({
      instructions: buildExecutionPlanInstructions(),
      input: buildExecutionPlanPrompt(context),
      schema: executionPlanSchema,
      maxOutputTokens: 650,
      model: OPENAI_MISSION_MODEL
    });
  } catch (error) {
    error.stage = error.stage || "execution-plan";
    throw error;
  }

  const normalizedExecutionPlan = normalizeExecutionPlan(openAIResult.parsed, context);
  return {
    plan: normalizedExecutionPlan,
    debug: {
      reused: false,
      rawResponse: openAIResult.rawResponse,
      extractedContent: openAIResult.extractedContent,
      parsedExecutionPlan: openAIResult.parsed,
      normalizedExecutionPlan
    }
  };
}

function buildExecutionPlanInstructions() {
  return [
    "You are the hidden milestone execution planner for Life Execution Version 5.3.",
    "Create a realistic internal execution plan for the user's current active milestone.",
    "This plan is not shown in full to the user. Its purpose is to make future daily missions correct and credible.",
    "The plan must explain how the milestone is actually reached from the user's baseline.",
    "Use the user's goal, baseline, current milestone, roadmap position, state, profile, and recent context.",
    "estimated_days must be realistic and stable for the current milestone.",
    "For strength, running, or fitness, estimates should usually be weeks to months, not a few days.",
    "For finance, the estimate must align with real income and savings ability from the profile.",
    "required_action_categories should list the necessary categories of work that make the milestone realistic.",
    "weekly_rhythm should describe the cadence or rhythm a real person could sustain.",
    "recovery_needs should describe recovery, reset, or protection requirements when relevant.",
    "completion_criteria should clearly define what would prove the milestone is complete.",
    "can_complete_with_single_mission should be true only if one well-defined mission could legitimately finish the milestone."
  ].join(" ");
}

function buildExecutionPlanPrompt(context) {
  return [
    "Generate a hidden milestone execution plan for this user.",
    "",
    JSON.stringify(context, null, 2),
    "",
    "Return JSON that matches the required schema."
  ].join("\n");
}

function hasReusableExecutionPlan(plan, context) {
  if (!plan || typeof plan !== "object") {
    return false;
  }

  const milestoneTitle = cleanString(plan.milestone_title);
  const currentMilestoneTitle = cleanString(context?.primary_goal?.current_milestone);
  const estimatedDays = Number(plan.estimated_days);

  return Boolean(
    milestoneTitle &&
    currentMilestoneTitle &&
    milestoneTitle.toLowerCase() === currentMilestoneTitle.toLowerCase() &&
    Number.isFinite(estimatedDays) &&
    estimatedDays > 0
  );
}

function normalizeExecutionPlan(plan, context, fallbackEstimatedDays) {
  const goalType = inferPrimaryGoalType(context);
  let estimatedDays = Number(plan?.estimated_days);
  if (!Number.isFinite(estimatedDays) || estimatedDays < 1) {
    estimatedDays = Number(fallbackEstimatedDays);
  }
  estimatedDays = applyEstimateGuardrails(estimatedDays, goalType, context);

  const milestoneStartedAt = cleanString(plan?.milestone_started_at || context?.current_execution_plan?.milestone_started_at || context?.current_date);
  const elapsedDays = calculateElapsedDays(milestoneStartedAt, cleanString(context?.current_date));

  return {
    milestone_title: cleanString(plan?.milestone_title || context?.primary_goal?.current_milestone) || "Current milestone",
    estimated_days: estimatedDays,
    milestone_started_at: milestoneStartedAt,
    elapsed_days: elapsedDays,
    progression_focus: cleanString(plan?.progression_focus) || cleanString(context?.primary_goal?.baseline_to_milestone_gap) || "Progress the current milestone realistically.",
    required_action_categories: normalizeStringList(plan?.required_action_categories, ["Direct progress"]),
    weekly_rhythm: cleanString(plan?.weekly_rhythm) || "Use a steady weekly rhythm that a real person can sustain.",
    recovery_needs: cleanString(plan?.recovery_needs) || "Protect consistency and recovery so progress can continue.",
    completion_criteria: normalizeStringList(plan?.completion_criteria, ["A concrete result proves the milestone is complete."]),
    can_complete_with_single_mission: Boolean(plan?.can_complete_with_single_mission)
  };
}

function normalizeStringList(value, fallback) {
  const normalized = Array.isArray(value)
    ? value.map((entry) => cleanString(entry)).filter(Boolean)
    : [];
  return normalized.length ? normalized : fallback;
}

function calculateElapsedDays(startDate, currentDate) {
  const start = cleanString(startDate);
  const current = cleanString(currentDate);
  if (!start || !current) {
    return 0;
  }

  const startValue = new Date(`${start}T12:00:00`);
  const currentValue = new Date(`${current}T12:00:00`);
  if (Number.isNaN(startValue.getTime()) || Number.isNaN(currentValue.getTime())) {
    return 0;
  }

  return Math.max(0, Math.round((currentValue.getTime() - startValue.getTime()) / 86400000));
}

function inferPrimaryGoalType(context) {
  const text = [
    context?.primary_goal?.title,
    context?.primary_goal?.baseline,
    context?.primary_goal?.target,
    context?.primary_goal?.current_milestone,
    context?.primary_goal?.category
  ].join(" ").toLowerCase();

  if (/(bench|squat|deadlift|overhead press|press|pull-up|pullup|strength|lifting|barbell|gym)/.test(text)) {
    return "strength";
  }
  if (/(run|running|marathon|5k|10k|cardio|fitness|fat loss|weight loss|stamina|endurance|walk)/.test(text)) {
    return "fitness";
  }
  if (/(save|saving|savings|money|finance|financial|income|debt|budget|cash|invest)/.test(text)) {
    return "finance";
  }
  return "general";
}

function applyEstimateGuardrails(days, goalType, context) {
  let safeDays = Number.isFinite(days) && days > 0 ? Math.round(days) : 0;

  if (goalType === "strength") {
    const baseline = extractLargestNumber(context?.primary_goal?.baseline);
    const target = extractLargestNumber(context?.primary_goal?.target || context?.primary_goal?.current_milestone);
    const gap = target && baseline ? Math.abs(target - baseline) : 0;
    const minimumStrengthDays = gap >= 25 ? 84 : gap >= 10 ? 42 : 28;
    safeDays = Math.max(safeDays || 0, minimumStrengthDays);
  } else if (goalType === "fitness") {
    safeDays = Math.max(safeDays || 0, 21);
  } else if (goalType === "finance") {
    const savingsDays = estimateFinancialTimelineDays(context);
    safeDays = Math.max(safeDays || 0, savingsDays);
  }

  if (!safeDays) {
    return goalType === "general" ? 14 : 21;
  }

  return safeDays;
}

function estimateFinancialTimelineDays(context) {
  const baseline = extractLargestNumber(context?.primary_goal?.baseline);
  const target = extractLargestNumber(context?.primary_goal?.target || context?.primary_goal?.current_milestone);
  const income = extractLargestNumber(context?.user_profile?.monthlyIncome);

  if (baseline && target && income && target > baseline) {
    const monthlySavingsCapacity = Math.max(income * 0.12, 100);
    const months = Math.ceil((target - baseline) / monthlySavingsCapacity);
    return Math.max(months * 30, 30);
  }

  return 30;
}

function extractLargestNumber(value) {
  const matches = (value || "").toString().match(/-?\d+(?:,\d{3})*(?:\.\d+)?/g);
  if (!matches?.length) {
    return 0;
  }

  return matches
    .map((entry) => Number(entry.replace(/,/g, "")))
    .filter((entry) => Number.isFinite(entry))
    .reduce((largest, entry) => Math.max(largest, entry), 0);
}

function buildEstimateLabel(existingLabel, days) {
  if (existingLabel && /(week|month)/i.test(existingLabel) && days >= 14) {
    return existingLabel;
  }

  if (!Number.isFinite(days) || days <= 0) {
    return existingLabel || "";
  }

  if (days >= 60) {
    const minMonths = Math.max(1, Math.floor(days / 30));
    const maxMonths = Math.max(minMonths, Math.ceil(days / 30) + 1);
    return `${minMonths} to ${maxMonths} months`;
  }

  if (days >= 14) {
    const minWeeks = Math.max(2, Math.floor(days / 7));
    const maxWeeks = Math.max(minWeeks, Math.ceil(days / 7) + 1);
    return `${minWeeks} to ${maxWeeks} weeks`;
  }

  return existingLabel || `${days} days`;
}

module.exports = {
  generateDailyMissionPlan
};
