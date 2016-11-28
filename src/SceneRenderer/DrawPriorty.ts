type DrawPriortyCriteria = {
  priorty: number;
  descending?: boolean;
};
export default {
  Background: { priorty: 1000 },
  Geometry: { priorty: 2000 },
  AlphaTest: { priorty: 3000, descending: true },
  Transparent: { priorty: 4000, descending: true },
  Overlay: { priorty: 5000, descending: true }
} as { [key: string]: DrawPriortyCriteria };
