/**
 * A single reason/attribute shown in the "Por qué elegirla" scrollytelling
 * section (e.g. "100% natural", "Sin conservantes"). Content is
 * intentionally short/placeholder for now — final copy will be provided
 * later without needing to touch the section's implementation.
 */
export interface WhyChooseItAttribute {
  id: number;
  title: string;
  description: string;
}

export interface WhyChooseItResponse {
  attributes: WhyChooseItAttribute[];
}
