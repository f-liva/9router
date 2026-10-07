import { describe, expect, it } from "vitest";

const { shouldTreatAsNonStreaming } = await import("../../open-sse/handlers/chatCore/nonStreamingHandler.js");

function responseWithContentType(contentType) {
  return { headers: { get: (name) => (name.toLowerCase() === "content-type" ? contentType : null) } };
}

describe("shouldTreatAsNonStreaming", () => {
  it("stays on the streaming path when the client explicitly asked for SSE", () => {
    expect(shouldTreatAsNonStreaming(true, responseWithContentType("text/event-stream"))).toBe(false);
    expect(shouldTreatAsNonStreaming(true, responseWithContentType("application/json"))).toBe(false);
  });

  it("stays on the streaming path when the provider genuinely streamed", () => {
    expect(shouldTreatAsNonStreaming(false, responseWithContentType("text/event-stream; charset=utf-8"))).toBe(false);
  });

  it("reroutes to non-streaming when client never asked for SSE and the provider returned plain JSON", () => {
    expect(shouldTreatAsNonStreaming(false, responseWithContentType("application/json"))).toBe(true);
    expect(shouldTreatAsNonStreaming(false, responseWithContentType(""))).toBe(true);
  });
});
