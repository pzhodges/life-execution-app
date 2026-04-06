const https = require("https");
const { OPENAI_API_KEY, OPENAI_MILESTONE_MODEL } = require("./config");

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

class OpenAIConfigError extends Error {}

async function createStructuredResponse(options) {
  const result = await createStructuredResponseWithDebug(options);
  return result.parsed;
}

async function createStructuredResponseWithDebug(options) {
  const {
    instructions,
    input,
    schema,
    maxOutputTokens = 260,
    model = OPENAI_MILESTONE_MODEL
  } = options;

  if (!OPENAI_API_KEY) {
    throw new OpenAIConfigError("Missing OPENAI_API_KEY on the server.");
  }

  const response = await postJson(OPENAI_RESPONSES_URL, {
    model,
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
    text: {
      format: {
        type: "json_schema",
        name: schema.name,
        strict: true,
        schema: schema.definition
      }
    }
  }, {
    Authorization: `Bearer ${OPENAI_API_KEY}`
  });

  let extractedContent;
  try {
    extractedContent = extractStructuredContent(response);
    const parsed = parseStructuredContent(extractedContent);

    return {
      rawResponse: response,
      extractedContent,
      parsed
    };
  } catch (error) {
    error.rawResponse = response;
    error.extractedContent = extractedContent;
    throw error;
  }
}

function postJson(urlString, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const payload = JSON.stringify(body);
    const request = https.request({
      method: "POST",
      hostname: url.hostname,
      path: `${url.pathname}${url.search}`,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        ...headers
      }
    }, (response) => {
      let raw = "";

      response.on("data", (chunk) => {
        raw += chunk;
      });

      response.on("end", () => {
        let parsed = {};

        if (raw) {
          try {
            parsed = JSON.parse(raw);
          } catch (error) {
            reject(new Error(`OpenAI returned invalid JSON (${response.statusCode || 500}).`));
            return;
          }
        }

        if ((response.statusCode || 500) >= 400) {
          const message = parsed?.error?.message || `OpenAI request failed (${response.statusCode || 500}).`;
          reject(new Error(message));
          return;
        }

        resolve(parsed);
      });
    });

    request.setTimeout(20000, () => {
      request.destroy(new Error("OpenAI request timed out."));
    });

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

function extractOutputText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const parts = [];
  const outputItems = Array.isArray(response?.output) ? response.output : [];

  outputItems.forEach((item) => {
    const content = Array.isArray(item?.content) ? item.content : [];
    content.forEach((entry) => {
      if (typeof entry?.text === "string" && entry.text.trim()) {
        parts.push(entry.text.trim());
        return;
      }
      if (typeof entry?.text?.value === "string" && entry.text.value.trim()) {
        parts.push(entry.text.value.trim());
        return;
      }
      if (typeof entry?.value === "string" && entry.value.trim()) {
        parts.push(entry.value.trim());
        return;
      }
      if (entry?.json && typeof entry.json === "object") {
        parts.push(JSON.stringify(entry.json));
      }
    });
  });

  return parts.join("\n").trim();
}

function extractStructuredContent(response) {
  if (response?.output_parsed && typeof response.output_parsed === "object") {
    return response.output_parsed;
  }

  const outputItems = Array.isArray(response?.output) ? response.output : [];

  for (const item of outputItems) {
    if (item?.parsed && typeof item.parsed === "object") {
      return item.parsed;
    }

    const content = Array.isArray(item?.content) ? item.content : [];
    for (const entry of content) {
      if (entry?.parsed && typeof entry.parsed === "object") {
        return entry.parsed;
      }
      if (entry?.json && typeof entry.json === "object") {
        return entry.json;
      }
    }
  }

  return extractOutputText(response);
}

function parseStructuredContent(extractedContent) {
  if (extractedContent && typeof extractedContent === "object") {
    return extractedContent;
  }

  const rawText = typeof extractedContent === "string" ? extractedContent.trim() : "";
  if (!rawText) {
    const error = new Error("OpenAI returned an empty structured response.");
    error.stage = "extraction";
    error.rawText = rawText;
    throw error;
  }

  try {
    return JSON.parse(rawText);
  } catch (parseError) {
    const error = new Error("OpenAI returned a non-JSON structured response.");
    error.stage = "parsing";
    error.rawText = rawText;
    error.cause = parseError;
    throw error;
  }
}

module.exports = {
  OpenAIConfigError,
  createStructuredResponse,
  createStructuredResponseWithDebug
};
