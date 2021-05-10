import ModbusRTU from 'modbus-serial';
import {
  ReadCoilResult,
  WriteCoilResult,
  WriteMultipleResult,
} from 'modbus-serial/ModbusRTU';

export class ModbusConnection {
  private client: ModbusRTU;

  constructor() {
    this.client = new ModbusRTU();
    this.client.setID(1);
    // this.client.setTimeout(5);
  }

  public connect(ip: string, port: number): Promise<void> {
    return this.client.connectTCP(ip, { port });
  }

  public readMany(start: number, count: number): Promise<ReadCoilResult> {
    return this.client.readCoils(start, count);
  }

  public write(address: number, value: boolean): Promise<WriteCoilResult> {
    return this.client.writeCoil(address, value);
  }

  public writeMany(
    address: number,
    values: boolean[]
  ): Promise<WriteMultipleResult> {
    return this.client.writeCoils(address, values);
  }

  public disconnect(): void {
    this.client?.close(() => {});
  }
}
