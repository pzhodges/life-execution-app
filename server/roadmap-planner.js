const { createStructuredResponse } = require("./openai");

const roadmapSchema = {
  name: "goal_roadmap",
  definition: {
    type: "object",
    additionalProperties: false,
    required: ["goal_title", "final_goal", "milestones"],
    properties: {
      goal_title: { type: "string", minLength: 1, maxLength: 220 },
      final_goal: { type: "string", minLength: 1, maxLength: 220 },
      milestones: {
        type: "array",
        minItems: 1,
        maxItems: 7,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "why_it_matters", "is_final_goal"],
          properties: {
            title: { type: "string", minLength: 1, maxLength: 220 },
            why_it_matters: { type: "string", minLength: 1, maxLength: 280 },
            is_final_goal: { type: "boolean" }
          }
        }
      }
    }
  }
};

async function generateRoadmap(payload = {}) {
  const context = normalizeRoadmapPayload(payload);
  if (!context.goal_title || !context.final_goal) {
    throw new Error("Goal title and final goal are required.");
  }

  const result = await createStructuredResponse({
    instructions: buildRoadmapInstructions(),
    input: buildRoadmapPrompt(context),
    schema: roadmapSchema,
    maxOutputTokens: 700
  });

  const milestones = Array.isArray(result?.milestones)
    ? result.milestones
      .map((milestone) => ({
        title: cleanString(milestone?.title),
        why_it_matters: cleanString(milestone?.why_it_matters),
        is_final_goal: Boolean(milestone?.is_final_goal)
      }))
      .filter((milestone) => milestone.title && milestone.why_it_matters)
    : [];

  if (!milestones.length) {
    throw new Error("OpenAI returned an empty roadmap.");
  }

  const finalGoal = cleanString(result?.final_goal) || context.final_goal;
  const goalTitle = cleanString(result?.goal_title) || context.goal_title;
  const lastIndex = milestones.length - 1;
  milestones.forEach((milestone, index) => {
    milestone.is_final_goal = index === lastIndex;
  });
  milestones[lastIndex] = {
    ...milestones[lastIndex],
    title: finalGoal,
    why_it_matters: milestones[lastIndex].why_it_matters || `Reaching ${finalGoal} completes the goal.`,
    is_final_goal: true
  };

  return {
    goal_title: goalTitle,
    final_goal: finalGoal,
    milestones
  };
}

function buildRoadmapInstructions() {
  return [
    "You are the roadmap planner for Life Execution Version 5.2.",
    "Generate a full milestone roadmap from the user's real baseline to the user's real final goal.",
    "Return only meaningful milestones, usually around 3 to 7 steps.",
    "The roadmap must start from the baseline, move logically forward, and end with the actual final goal.",
    "The last milestone must be the final goal exactly.",
    "Do not go beyond the final goal.",
    "Do not create filler, vague transitions, or inconsistent math.",
    "Use the baseline, what success looks like, timeline, and context to keep the roadmap realistic."
  ].join(" ");
}

function buildRoadmapPrompt(context) {
  return [
    "Generate a complete milestone roadmap for this goal.",
    "",
    JSON.stringify(context, null, 2),
    "",
    "Return JSON that matches the required schema."
  ].join("\n");
}

function normalizeRoadmapPayload(payload) {
  return {
    goal_title: cleanString(payload.goal_title || payload.goalTitle || payload.primaryGoal),
    why: cleanString(payload.why || payload.primaryGoalWhy),
    baseline: cleanString(payload.baseline),
    final_goal: cleanString(payload.final_goal || payload.finalGoal || payload.target || payload.goal_title || payload.goalTitle),
    timeline: cleanString(payload.timeline || payload.supportingContext?.timeline || payload.profile?.timeline),
    current_state: filterObject(payload.currentState),
    profile: filterObject(payload.profile),
    user_profile: filterObject(payload.userProfile),
    supporting_context: filterObject(payload.supportingContext)
  };
}

function filterObject(record) {
  if (!record || typeof record !== "object") {
    return {};
  }

  return Object.entries(record).reduce((accumulator, [key, value]) => {
    if (Array.isArray(value)) {
      const items = value.map((entry) => cleanString(entry)).filter(Boolean);
      if (items.length) {
        accumulator[key] = items;
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
  generateRoadmap
};
