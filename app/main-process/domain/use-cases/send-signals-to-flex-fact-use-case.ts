import { ModbusConnection } from '../../data/modbus-connection';
import { FlexFactConfigRepository } from '../repositories/flex-fact-config-repository';

export interface SendSignalsToFlexFactUseCase {
  invoke(signals: { address: number; value: number }[]): Promise<void>;
}

export class SendSignalsToFlexFactUseCaseImpl
  implements SendSignalsToFlexFactUseCase {
  constructor(
    private modbusConnection: ModbusConnection,
    private flexFactConfigRepository: FlexFactConfigRepository
  ) {
    this.modbusConnection = modbusConnection;
    this.flexFactConfigRepository = flexFactConfigRepository;
  }

  public async invoke(
    signals: { address: number; value: number }[]
  ): Promise<void> {
    const config = this.flexFactConfigRepository.getConfig();
    if (typeof config === 'undefined') {
      throw new Error('FlexFact config is not set');
    }
    signals.forEach(async (signal) => {
      await this.modbusConnection.write(signal.address, signal.value === 1);
    });
  }
}
