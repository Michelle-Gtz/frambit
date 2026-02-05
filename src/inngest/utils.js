export function lastAssistanTextMessageContent(result) {
  const lastAssistantTextMessageIndex = result.output.findIndex(
    (message) => message.role === "assistant",
  );

  const message = result.output[lastAssistantTextMessageIndex];

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}
