const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { ROOT_DIR, PORT } = require("./server/config");
const { suggestNextMilestone } = require("./server/milestone-planner");
const { generateRoadmap } = require("./server/roadmap-planner");
const { generateDailyMissionPlan } = require("./server/mission-planner");
const { OpenAIConfigError } = require("./server/openai");

const DEBUG = false;
const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (request.method === "POST" && url.pathname === "/api/suggest-next-milestone") {
      await handleSuggestNextMilestone(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/generate-roadmap") {
      await handleGenerateRoadmap(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/generate-daily-mission") {
      await handleGenerateDailyMission(request, response);
      return;
    }

    if (request.method === "GET" || request.method === "HEAD") {
      await serveStaticAsset(url.pathname, response, request.method === "HEAD");
      return;
    }

    sendJson(response, 405, { error: "Method not allowed." });
  } catch (error) {
    sendJson(response, 500, { error: "Server error.", details: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Life Execution V5.3 server running at http://localhost:${PORT}`);
});

async function handleSuggestNextMilestone(request, response) {
  try {
    const payload = await readJsonBody(request);
    const suggestion = await suggestNextMilestone(payload);
    sendJson(response, 200, suggestion);
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      sendJson(response, 503, {
        error: "AI suggestions are unavailable because the server is missing OPENAI_API_KEY."
      });
      return;
    }

    if (error instanceof SyntaxError) {
      sendJson(response, 400, { error: "Invalid JSON request body." });
      return;
    }

    if (error.message === "Primary goal is required.") {
      sendJson(response, 400, { error: error.message });
      return;
    }

    sendJson(response, 502, {
      error: "Unable to generate the next milestone right now.",
      details: error.message
    });
  }
}

async function handleGenerateRoadmap(request, response) {
  try {
    const payload = await readJsonBody(request);
    const roadmap = await generateRoadmap(payload);
    sendJson(response, 200, roadmap);
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      sendJson(response, 503, {
        error: "AI roadmap generation is unavailable because the server is missing OPENAI_API_KEY."
      });
      return;
    }

    if (error instanceof SyntaxError) {
      sendJson(response, 400, { error: "Invalid JSON request body." });
      return;
    }

    if (error.message === "Goal title and final goal are required.") {
      sendJson(response, 400, { error: error.message });
      return;
    }

    sendJson(response, 502, {
      error: "Unable to generate the roadmap right now.",
      details: error.message
    });
  }
}

async function handleGenerateDailyMission(request, response) {
  try {
    const payload = await readJsonBody(request);
    const { plan: missionPlan, debug } = await generateDailyMissionPlan(payload);

    debugLog("MISSION ROUTE: raw OpenAI response object");
    debugLog(debug?.rawResponse);
    debugLog("MISSION ROUTE: extracted content used");
    debugLog(debug?.extractedContent);
    debugLog("MISSION ROUTE: final parsed mission object");
    debugLog(debug?.parsedMission);
    debugLog("MISSION ROUTE: final normalized mission object");
    debugLog(debug?.normalizedPlan);
    debugLog("MISSION ROUTE SUCCESS - RETURNING TO FRONTEND");
    debugLog(missionPlan);

    try {
      sendJson(response, 200, missionPlan);
    } catch (sendError) {
      sendError.stage = "res.json";
      throw sendError;
    }
  } catch (error) {
    console.error("MISSION ROUTE FAILURE", {
      stage: error.stage || "unknown",
      message: error.message,
      stack: error.stack
    });
    if (error.rawText !== undefined) {
      console.error("MISSION ROUTE FAILURE RAW TEXT");
      console.error(error.rawText);
    }
    if (error.extractedContent !== undefined) {
      console.error("MISSION ROUTE FAILURE EXTRACTED CONTENT");
      console.error(error.extractedContent);
    }
    if (error.parsedMission !== undefined) {
      console.error("MISSION ROUTE FAILURE PARSED MISSION");
      console.error(error.parsedMission);
    }
    if (error.rawResponse !== undefined) {
      console.error("MISSION ROUTE FAILURE RAW RESPONSE");
      console.error(error.rawResponse);
    }

    if (error instanceof OpenAIConfigError) {
      sendJson(response, 503, {
        error: "AI mission planning is unavailable because the server is missing OPENAI_API_KEY."
      });
      return;
    }

    if (error instanceof SyntaxError) {
      sendJson(response, 400, { error: "Invalid JSON request body." });
      return;
    }

    if (error.message === "Primary goal is required.") {
      sendJson(response, 400, { error: error.message });
      return;
    }

    sendJson(response, 502, {
      error: "Unable to generate today's AI mission right now.",
      details: error.message
    });
  }
}

async function serveStaticAsset(requestPath, response, isHeadRequest) {
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const assetPath = path.resolve(ROOT_DIR, `.${safePath}`);

  if (!assetPath.startsWith(ROOT_DIR)) {
    sendJson(response, 403, { error: "Forbidden." });
    return;
  }

  try {
    const fileBuffer = await fs.readFile(assetPath);
    const extension = path.extname(assetPath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(isHeadRequest ? undefined : fileBuffer);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(response, 404, { error: "Not found." });
      return;
    }

    throw error;
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        request.destroy(new Error("Request body too large."));
      }
    });

    request.on("end", () => {
      resolve(raw ? JSON.parse(raw) : {});
    });

    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(body);
}
