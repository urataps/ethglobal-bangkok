// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'yield-farming',
    label: 'Yield Farming Agent',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Special agent tailored to yield optimization strategies',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'yield-farming';
