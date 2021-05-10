import { FlexFactConfig } from '../domain/models/flex-fact-config';
import { FlexFactConfigRepository } from '../domain/repositories/flex-fact-config-repository';

export class FlexFactConfigInMemoryRepository
  implements FlexFactConfigRepository {
  private config?: FlexFactConfig;

  public setConfig(config: FlexFactConfig): void {
    this.config = config;
  }

  public getConfig(): FlexFactConfig | undefined {
    return this.config;
  }
}
