export type CocoPose = "idle" | "pouring" | "finish";

export interface SceneStep {
  fill: number;
  coco: CocoPose;
  jet: boolean;
}

/** The single source of truth for every visual in the five-step story. */
export const SCENE_STEPS: readonly SceneStep[] = [
  { fill: 0, coco: "idle", jet: false },
  { fill: 20, coco: "pouring", jet: true },
  { fill: 45, coco: "pouring", jet: true },
  { fill: 75, coco: "pouring", jet: true },
  { fill: 100, coco: "finish", jet: false },
];

export function getSceneStep(activeStep: number): SceneStep {
  const index = Math.min(SCENE_STEPS.length - 1, Math.max(0, activeStep));
  return SCENE_STEPS[index];
}
