const { createStructuredResponse } = require("./openai");

const suggestionSchema = {
  name: "next_milestone_suggestion",
  definition: {
    type: "object",
    additionalProperties: false,
    required: ["next_milestone", "why_it_matters"],
    properties: {
      next_milestone: {
        type: "string",
        minLength: 1,
        maxLength: 220
      },
      why_it_matters: {
        type: "string",
        minLength: 1,
        maxLength: 280
      }
    }
  }
};

async function suggestNextMilestone(payload = {}) {
  const context = normalizePlannerPayload(payload);
  if (!context.primaryGoal) {
    throw new Error("Primary goal is required.");
  }

  const result = await createStructuredResponse({
    instructions: buildPlannerInstructions(),
    input: buildPlannerPrompt(context),
    schema: suggestionSchema,
    maxOutputTokens: 220
  });

  const nextMilestone = cleanString(result?.next_milestone);
  const whyItMatters = cleanString(result?.why_it_matters);

  if (!nextMilestone || !whyItMatters) {
    throw new Error("OpenAI returned an incomplete milestone suggestion.");
  }

  return {
    next_milestone: nextMilestone,
    why_it_matters: whyItMatters
  };
}

function buildPlannerInstructions() {
  return [
    "You are the milestone planner for Life Execution Version 5.3.",
    "When requestType is first_milestone, return the first realistic milestone for the new goal.",
    "When requestType is next_milestone, return one realistic next milestone after the completed milestone.",
    "The milestone must be a single concrete checkpoint, not a full plan.",
    "Keep it smaller than the final goal unless the user is honestly ready to move straight to the final goal.",
    "The finalGoal field is the true endpoint and must be treated as the stopping condition.",
    "If the next logical step is the final goal, return finalGoal exactly as the next_milestone.",
    "Do not create another intermediate milestone once the next step is effectively the final goal.",
    "Use the user's baseline, current state, optional context, and profile context to keep it realistic.",
    "Do not invent multiple middle milestones or fake roadmap layers.",
    "The explanation should say why this exact checkpoint matters right now."
  ].join(" ");
}

function buildPlannerPrompt(context) {
  return [
    context.requestType === "first_milestone"
      ? "Plan the first milestone for this user."
      : "Plan the next milestone for this user.",
    "",
    JSON.stringify(context, null, 2),
    "",
    "Return JSON that matches the required schema."
  ].join("\n");
}

function normalizePlannerPayload(payload) {
  const currentState = filterObject(payload.currentState);
  const profile = filterObject(payload.profile, [
    "goalTitle",
    "why",
    "baseline",
    "target",
    "timeline",
    "phaseName",
    "phaseFocus",
    "phaseMilestone",
    "phaseWhy",
    "category",
    "contextNotes"
  ]);
  const userProfile = filterObject(payload.userProfile);
  const latestLifeUpdate = filterObject(payload.supportingContext?.latestLifeUpdate, [
    "eventType",
    "emotions",
    "notes",
    "timestamp"
  ]);
  const supportingGoals = Array.isArray(payload.supportingGoals)
    ? payload.supportingGoals
      .map((goal) => filterObject(goal, ["title", "why", "baseline", "milestone", "timeline", "category"]))
      .filter((goal) => Object.keys(goal).length)
      .slice(0, 4)
    : [];

  return {
    requestType: cleanString(payload.requestType) || "next_milestone",
    primaryGoal: cleanString(payload.primaryGoal) || cleanString(payload.goalTitle) || cleanString(profile.goalTitle),
    primaryGoalWhy: cleanString(payload.primaryGoalWhy) || cleanString(profile.why),
    baseline: cleanString(payload.baseline) || cleanString(profile.baseline),
    finalGoal: cleanString(payload.finalGoal) || cleanString(payload.target) || cleanString(profile.target) || cleanString(profile.goalTitle),
    completedMilestone: cleanString(payload.completedMilestone) || cleanString(payload.currentCompletedMilestone),
    completedMilestoneWhy: cleanString(payload.completedMilestoneWhy),
    currentState,
    profile,
    userProfile,
    supportingGoals,
    supportingContext: filterObject({
      timeline: payload.supportingContext?.timeline || profile.timeline,
      phaseName: payload.supportingContext?.phaseName || profile.phaseName,
      phaseFocus: payload.supportingContext?.phaseFocus || profile.phaseFocus,
      contextNotes: payload.supportingContext?.contextNotes || profile.contextNotes,
      appDate: payload.supportingContext?.appDate,
      latestLifeUpdate
    })
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
      const cleanValues = value.map((entry) => cleanString(entry)).filter(Boolean);
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

module.exports = {
  suggestNextMilestone
};
