type DrawPriortyCriteria = {
  priorty: number;
  descending?: boolean;
};
export default {
  Background: { priorty: 1000 },
  NoAlpha: { priorty: 2000 },
  UseAlpha: { priorty: 3000, descending: true },
  NoDepth: { priorty: 4000, descending: true },
  Overlay: { priorty: 5000, descending: true }
} as { [key: string]: DrawPriortyCriteria };
