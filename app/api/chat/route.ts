import { convertToModelMessages, streamText, type UIMessage } from "ai";
import Fuse from "fuse.js";

import { getAnthropicModel } from "@/lib/claude";
import type { ChatContextSnapshot } from "@/types";

function buildSnapshotText(snapshot: ChatContextSnapshot | null) {
  if (!snapshot) {
    return "No live inventory snapshot was provided.";
  }

  return `Context snapshot:
- Total SKU count: ${snapshot.totalSkuCount}
- Today's movement count: ${snapshot.todaysMovementCount}
- Low stock items: ${snapshot.lowStockItems
    .map((item) => `${item.name} (${item.currentStock}/${item.minStockLevel})`)
    .join(", ") || "none"}
- Recent movements: ${snapshot.recentMovements
    .map((movement) => `${movement.type} ${movement.quantity} on ${movement.timestamp}`)
    .join("; ") || "none"}`;
}

function buildIntentHints(message: string, snapshot: ChatContextSnapshot | null) {
  if (!snapshot) {
    return "";
  }

  const normalized = message.toLowerCase();

  if (normalized.includes("running low")) {
    return `Low stock items right now: ${snapshot.lowStockItems
      .map((item) => `${item.name} (${item.currentStock} on hand)`)
      .join(", ") || "none"}`;
  }

  if (normalized.includes("recent activity")) {
    return `Recent activity: ${snapshot.recentMovements
      .map((movement) => `${movement.type} ${movement.quantity} at ${movement.timestamp}`)
      .join("; ") || "none"}`;
  }

  if (normalized.includes("how much")) {
    const fuse = new Fuse(snapshot.inventoryLookup, {
      keys: ["name", "sku"],
      threshold: 0.4,
    });
    const match = fuse.search(message)[0]?.item;
    if (match) {
      return `Matched inventory item: ${match.name} (${match.sku}) currently has ${match.currentStock} units on hand.`;
    }
  }

  if (normalized.includes("reorder")) {
    const fuse = new Fuse(snapshot.inventoryLookup, {
      keys: ["name", "sku"],
      threshold: 0.4,
    });
    const match = fuse.search(message)[0]?.item;
    const prediction = snapshot.predictions.find((item) => item.itemId === match?.id);
    if (match && prediction) {
      return `Matched item ${match.name}. Recommended reorder quantity is ${prediction.recommendedReorderQty} with urgency ${prediction.urgency}. Reasoning: ${prediction.reasoning}`;
    }
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages: UIMessage[]; snapshot?: ChatContextSnapshot | null };
    const latestMessage = body.messages.at(-1)?.parts
      ?.filter((part) => part.type === "text")
      .map((part) => ("text" in part ? part.text : ""))
      .join(" ")
      .trim() ?? "";
    const snapshot = body.snapshot ?? null;
    const intentHints = buildIntentHints(latestMessage, snapshot);

    const result = streamText({
      model: getAnthropicModel(),
      system: `You are StockBot, an assistant for this inventory management system. You can answer questions about inventory levels, stock movements, low stock alerts, and predictions. Be concise and data-driven.

${buildSnapshotText(snapshot)}

${intentHints ? `Intent hint: ${intentHints}` : ""}`,
      messages: convertToModelMessages(body.messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unable to process chat request.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
