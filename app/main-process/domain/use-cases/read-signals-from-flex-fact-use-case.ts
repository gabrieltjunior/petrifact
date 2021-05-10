import { ModbusConnection } from '../../data/modbus-connection';
import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';

export interface ReadSignalsFromFlexFactUseCase {
  invoke(): Promise<number[]>;
}

export class ReadSignalsFromFlexFactUseCaseImpl
  implements ReadSignalsFromFlexFactUseCase {
  constructor(
    private modbusConnection: ModbusConnection,
    private flexFactConfigRepository: FlexFactConfigRepository
  ) {
    this.modbusConnection = modbusConnection;
    this.flexFactConfigRepository = flexFactConfigRepository;
  }

  public async invoke(): Promise<number[]> {
    const config = this.flexFactConfigRepository.getConfig();
    if (typeof config === 'undefined') {
      throw new Error('FlexFact config is not set');
    }
    const { data } = await this.modbusConnection.readMany(
      config.inputSignals.start,
      config.inputSignals.count
    );
    return data.map((signal) => (signal ? 1 : 0));
  }
}
