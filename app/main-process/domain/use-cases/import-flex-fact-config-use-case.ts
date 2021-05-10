import { promises as fs } from 'fs';
import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';
import { ConvertFlexFactConfigUseCase } from './convert-flex-fact-config-use-case';

export interface ImportFlexFactConfigUseCase {
  invoke(filepath: string): Promise<void>;
}

export class ImportFlexFactConfigUseCaseImpl
  implements ImportFlexFactConfigUseCase {
  constructor(
    private convertFlexFactConfig: ConvertFlexFactConfigUseCase,
    private flexFactConfigRepo: FlexFactConfigRepository
  ) {
    this.convertFlexFactConfig = convertFlexFactConfig;
    this.flexFactConfigRepo = flexFactConfigRepo;
  }

  public async invoke(filepath: string): Promise<void> {
    const buffer = await fs.readFile(filepath);
    const config = this.convertFlexFactConfig.invoke(buffer.toString());
    this.flexFactConfigRepo.setConfig(config);
  }
}
