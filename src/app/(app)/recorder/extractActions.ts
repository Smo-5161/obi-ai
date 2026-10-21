interface RrwebEvent {
  type: number;
  data?: {
    source?: number;
    type?: number;
    id?: number;
    x?: number;
    y?: number;
    text?: string;
    isChecked?: boolean;
    node?: { id?: number; tagName?: string; textContent?: string; attributes?: Record<string, unknown> };
    href?: string;
  };
  timestamp: number;
}

const EventType = {
  DomContentLoaded: 0,
  Load: 1,
  FullSnapshot: 2,
  IncrementalSnapshot: 3,
  Meta: 4,
  Custom: 5,
};

const IncrementalSource = {
  Mutation: 0,
  MouseMove: 1,
  MouseInteraction: 2,
  Scroll: 3,
  ViewportResize: 4,
  Input: 5,
  TouchMove: 6,
  MediaInteraction: 7,
  StyleSheetRule: 8,
  InputMacro: 9,
  ScrollIntoView: 10,
  CanvasMutation: 11,
  Font: 12,
  Log: 13,
  Drag: 14,
};

const MouseInteractionType = {
  MouseUp: 0,
  MouseDown: 1,
  Click: 2,
  ContextMenu: 3,
  DblClick: 4,
  Focus: 5,
  Blur: 6,
};

export interface ExtractedAction {
  timestamp: number;
  type: "click" | "input" | "navigate" | "shortcut";
  app?: string;
  target?: string;
  url?: string;
  text?: string;
}

export function extractActions(events: unknown[]): ExtractedAction[] {
  const actions: ExtractedAction[] = [];
  const baseTs = events.length
    ? (events[0] as RrwebEvent).timestamp
    : Date.now();

  for (const ev of events as RrwebEvent[]) {
    if (ev.type === EventType.IncrementalSnapshot && ev.data) {
      const ts = ev.timestamp - baseTs;
      if (ev.data.source === IncrementalSource.MouseInteraction) {
        if ((ev.data.type as unknown) === MouseInteractionType.Click) {
          actions.push({
            timestamp: ts,
            type: "click",
            app: "Navigateur",
            target: labelForNode(ev.data.id),
          });
        }
      } else if (ev.data.source === IncrementalSource.Input) {
        if (ev.data.text) {
          actions.push({
            timestamp: ts,
            type: "input",
            app: "Navigateur",
            target: labelForNode(ev.data.id),
            text: ev.data.text?.slice(0, 120),
          });
        }
      }
    }
  }
  return actions;
}

function labelForNode(id?: number): string | undefined {
  // Sans le DOM reconstruit, on garde un identifiant d'élément générique.
  return id !== undefined ? `élément #${id}` : undefined;
}
