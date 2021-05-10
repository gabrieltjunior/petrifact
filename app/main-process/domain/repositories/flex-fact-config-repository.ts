import { FlexFactConfig } from '../models/flex-fact-config';

export interface FlexFactConfigRepository {
  setConfig(config: FlexFactConfig): void;
  getConfig(): FlexFactConfig | undefined;
}
