import parser from 'fast-xml-parser';
import {
  FlexFactConfig,
  FlexFactEvent,
  FlexFactEventAction,
  FlexFactEventTrigger,
} from '../models/flex-fact-config';

export interface ConvertFlexFactConfigUseCase {
  invoke(xml: string): FlexFactConfig;
}

type Actions = {
  Clr?: [
    {
      attr?: {
        address?: number;
      };
    }
  ];
  Set?: [
    {
      attr?: {
        address?: number;
      };
    }
  ];
};

type Triggers = {
  NegativeEdge?: [
    {
      attr?: {
        address?: number;
      };
    }
  ];
  PositiveEdge?: [
    {
      attr?: {
        address?: number;
      };
    }
  ];
};

type ExpectedContent = {
  ModbusDevice?: {
    SlaveAddress?: {
      attr?: {
        value?: string;
      };
    };
    RemoteImage?: {
      Inputs?: {
        attr?: {
          mbaddr?: number;
          count?: number;
        };
      };
      Outputs?: {
        attr?: {
          mbaddr?: number;
          count?: number;
        };
      };
    };
    EventConfiguration?: {
      Event?: [
        {
          attr?: {
            name?: string;
            iotype?: string;
          };
          Actions?: Actions;
          Triggers?: Triggers;
        }
      ];
    };
  };
};

export class ConvertFlexFactConfigUseCaseImpl
  implements ConvertFlexFactConfigUseCase {
  // eslint-disable-next-line class-methods-use-this
  public invoke(xml: string): FlexFactConfig {
    const options = {
      attributeNamePrefix: '',
      attrNodeName: 'attr',
      ignoreAttributes: false,
      ignoreNameSpace: false,
      parseAttributeValue: true, // TODO handle integer parse errors
      arrayMode: new RegExp(
        '^Event$|^Clr$|^Set$|^NegativeEdge$|^PositiveEdge$'
      ),
    };
    const contents: ExpectedContent = parser.parse(xml, options);

    // TODO handle try catch
    return {
      ip: this.getIp(contents),
      port: this.getPort(contents),
      inputSignals: this.getInputSignals(contents),
      outputSignals: this.getOutputSignals(contents),
      events: this.getEvents(contents),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private getIp(contents: ExpectedContent): string {
    const slaveAddress = contents?.ModbusDevice?.SlaveAddress?.attr?.value;
    if (typeof slaveAddress === 'undefined') {
      throw new Error('SlaveAddress was not set');
    }
    return slaveAddress.split(':')[0];
  }

  // eslint-disable-next-line class-methods-use-this
  private getPort(contents: ExpectedContent): number {
    const slaveAddress = contents?.ModbusDevice?.SlaveAddress?.attr?.value;
    if (typeof slaveAddress === 'undefined') {
      throw new Error('SlaveAddress was not set');
    }
    return parseInt(slaveAddress.split(':')[1], 10);
  }

  // eslint-disable-next-line class-methods-use-this
  private getInputSignals(
    contents: ExpectedContent
  ): { start: number; count: number } {
    const mbaddrInput =
      contents?.ModbusDevice?.RemoteImage?.Inputs?.attr?.mbaddr;
    if (typeof mbaddrInput === 'undefined') {
      throw new Error("Inputs' mbaddr was not set");
    }
    const countInput = contents?.ModbusDevice?.RemoteImage?.Inputs?.attr?.count;
    if (typeof countInput === 'undefined') {
      throw new Error("Inputs' count was not set");
    }
    return { start: mbaddrInput, count: countInput };
  }

  // eslint-disable-next-line class-methods-use-this
  private getOutputSignals(
    contents: ExpectedContent
  ): { start: number; count: number } {
    const mbaddrOutput =
      contents?.ModbusDevice?.RemoteImage?.Outputs?.attr?.mbaddr;
    if (typeof mbaddrOutput === 'undefined') {
      throw new Error("Outputs' mbaddr was not set");
    }
    const countOutput =
      contents?.ModbusDevice?.RemoteImage?.Outputs?.attr?.count;
    if (typeof countOutput === 'undefined') {
      throw new Error("Outputs' count was not set");
    }
    return { start: mbaddrOutput, count: countOutput };
  }

  // eslint-disable-next-line class-methods-use-this
  private getActions(actions: Actions): FlexFactEventAction[] {
    let result: FlexFactEventAction[] = [];
    const clr = actions?.Clr;
    if (typeof clr !== 'undefined') {
      result = result.concat(
        clr.map((item) => {
          const address = item?.attr?.address;
          if (typeof address === 'undefined') {
            throw new Error('Address was not set');
          }
          return {
            type: 'clr',
            address,
          };
        })
      );
    }
    const set = actions?.Set;
    if (typeof set !== 'undefined') {
      result = result.concat(
        set.map((item) => {
          const address = item?.attr?.address;
          if (typeof address === 'undefined') {
            throw new Error('Address was not set');
          }
          return {
            type: 'set',
            address,
          };
        })
      );
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private getTriggers(triggers: Triggers): FlexFactEventTrigger[] {
    let result: FlexFactEventTrigger[] = [];
    const pos = triggers?.PositiveEdge;
    if (typeof pos !== 'undefined') {
      result = result.concat(
        pos.map((item) => {
          const address = item?.attr?.address;
          if (typeof address === 'undefined') {
            throw new Error('Address was not set');
          }
          return {
            type: 'positive-edge',
            address,
          };
        })
      );
    }
    const neg = triggers?.NegativeEdge;
    if (typeof neg !== 'undefined') {
      result = result.concat(
        neg.map((item) => {
          const address = item?.attr?.address;
          if (typeof address === 'undefined') {
            throw new Error('Address was not set');
          }
          return {
            type: 'negative-edge',
            address,
          };
        })
      );
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private getEvents(contents: ExpectedContent): FlexFactEvent[] {
    const events = contents?.ModbusDevice?.EventConfiguration?.Event;
    if (typeof events === 'undefined') {
      throw new Error('Events were not set');
    }
    return events.map(
      (event): FlexFactEvent => {
        const name = event?.attr?.name;
        const iotype = event?.attr?.iotype;
        if (typeof name === 'undefined') {
          throw new Error('Event name was not set');
        }
        if (typeof iotype === 'undefined') {
          throw new Error('Event iotype was not set');
        }
        switch (iotype) {
          case 'input':
            return {
              name,
              type: iotype,
              triggers: this.getTriggers(event?.Triggers as Triggers),
            };
          case 'output':
            return {
              name,
              type: iotype,
              actions: this.getActions(event?.Actions as Actions),
            };
          default:
            throw new Error('Event iotype was not valid');
        }
      }
    );
  }
}
