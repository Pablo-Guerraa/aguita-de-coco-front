export interface IntroductionSlide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface IntroductionResponse {
  slides: IntroductionSlide[];
}
