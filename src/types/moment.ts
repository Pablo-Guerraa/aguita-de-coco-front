/**
 * A single "moment" card for the "Cómo disfrutarla" section — represents an
 * occasion/context in which the product can be enjoyed (e.g. after training,
 * with meals, to share). Content is intentionally minimal/placeholder for
 * now and will be refined once final copy and photography are ready.
 */
export interface MomentCard {
  id: number;
  title: string;
  description: string;
  /** Public path to the (currently placeholder) photo for this moment. */
  image: string;
  /** Small optional tag, e.g. a subtly related presentation/flavor hint. */
  optionalLabel?: string;
}

export interface MomentsResponse {
  moments: MomentCard[];
}
