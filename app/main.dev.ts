/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './main-process/menu';
import { ModbusConnection } from './main-process/data/modbus-connection';
import { IpcErrorResponse, IpcResponse } from './shared/ipc-response';
import { Event } from './shared/events';
import { PetriNetInMemoryRepository } from './main-process/data/petri-net-in-memory-repository';
import { PetriNet } from './shared/petrinet';
import {
  ConvertFlexFactConfigUseCase,
  ConvertFlexFactConfigUseCaseImpl,
} from './main-process/domain/use-cases/convert-flex-fact-config-use-case';
import {
  ImportFlexFactConfigUseCase,
  ImportFlexFactConfigUseCaseImpl,
} from './main-process/domain/use-cases/import-flex-fact-config-use-case';
import { FlexFactConfigRepository } from './main-process/domain/repositories/flex-fact-config-repository';
import { FlexFactConfigInMemoryRepository } from './main-process/data/flex-fact-config-in-memory-repository';
import {
  GetConfiguredEventsUseCase,
  GetConfiguredEventsUseCaseImpl,
} from './main-process/domain/use-cases/get-configured-events-use-case';
import { FlexFactConfig } from './main-process/domain/models/flex-fact-config';
import {
  CalculateConsumerMatrixUseCase,
  CalculateConsumerMatrixUseCaseImpl,
} from './main-process/domain/use-cases/calculate-consumer-matrix-use-case';
import { PetriNetRepository } from './main-process/domain/repositories/petri-net-repository';
import {
  CalculateProducerMatrixUseCase,
  CalculateProducerMatrixUseCaseImpl,
} from './main-process/domain/use-cases/calculate-producer-matrix-use-case';
import {
  StartPetriNetUseCase,
  StartPetriNetUseCaseImpl,
} from './main-process/domain/use-cases/start-petri-net-use-case';
import { SignalRepository } from './main-process/domain/repositories/signal-repository';
import { SignalInMemoryRepository } from './main-process/data/signal-in-memory-repository';
import {
  ReadSignalsFromFlexFactUseCase,
  ReadSignalsFromFlexFactUseCaseImpl,
} from './main-process/domain/use-cases/read-signals-from-flex-fact-use-case';
import {
  RunPetriNetStepUseCase,
  RunPetriNetStepUseCaseImpl,
} from './main-process/domain/use-cases/run-petri-net-step-use-case';
import {
  SendSignalsToFlexFactUseCase,
  SendSignalsToFlexFactUseCaseImpl,
} from './main-process/domain/use-cases/send-signals-to-flex-fact-use-case';
import {
  InterpretEventsFromFlexFactUseCase,
  InterpretEventsFromFlexFactUseCaseImpl,
} from './main-process/domain/use-cases/interpret-events-from-flex-fact-use-case';
import { CalculateActiveTransitionsMatrixUseCaseImpl } from './main-process/domain/use-cases/calculate-active-transitions-matrix-use-case';
import {
  CalculateTransitionMatrixUseCase,
  CalculateTransitionMatrixUseCaseImpl,
} from './main-process/domain/use-cases/calculate-transition-matrix-use-case';
import {
  CalculateMarkingsMatrixUseCase,
  CalculateMarkingsMatrixUseCaseImpl,
} from './main-process/domain/use-cases/calculate-markings-matrix-use-case';
import {
  ApplyOutputEventsToSignalsUseCase,
  ApplyOutputEventsToSignalsUseCaseImpl,
} from './main-process/domain/use-cases/apply-output-events-to-signals-use-case';
import {
  SendMarkingsToRendererUseCase,
  SendMarkingsToRendererUseCaseImpl,
} from './main-process/domain/use-cases/send-markings-to-renderer-use-case';
import { NodeIntervalScheduler } from './main-process/data/node-interval-scheduler';
import {
  StopPetriNetUseCase,
  StopPetriNetUseCaseImpl,
} from './main-process/domain/use-cases/stop-petri-net-use-case';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const setupServices = () => {
  // Repositories instantiation
  const flexFactConfigRepository: FlexFactConfigRepository = new FlexFactConfigInMemoryRepository();
  const petriNetRepository: PetriNetRepository = new PetriNetInMemoryRepository();
  const signalRepository: SignalRepository = new SignalInMemoryRepository();
  const modbusConnection = new ModbusConnection();
  const scheduler = new NodeIntervalScheduler();

  // Use cases instantiation
  const convertFlexFactConfigUseCase: ConvertFlexFactConfigUseCase = new ConvertFlexFactConfigUseCaseImpl();
  const calculateConsumerMatrixUseCase: CalculateConsumerMatrixUseCase = new CalculateConsumerMatrixUseCaseImpl();
  const calculateProducerMatrixUseCase: CalculateProducerMatrixUseCase = new CalculateProducerMatrixUseCaseImpl();
  const calculateActiveTransitionsMatrixUseCase: CalculateActiveTransitionsMatrixUseCaseImpl = new CalculateActiveTransitionsMatrixUseCaseImpl();
  const calculateTransitionMatrixUseCase: CalculateTransitionMatrixUseCase = new CalculateTransitionMatrixUseCaseImpl();
  const calculateMarkingsMatrixUseCase: CalculateMarkingsMatrixUseCase = new CalculateMarkingsMatrixUseCaseImpl();
  const importFlexFactConfigUseCase: ImportFlexFactConfigUseCase = new ImportFlexFactConfigUseCaseImpl(
    convertFlexFactConfigUseCase,
    flexFactConfigRepository
  );
  const getConfiguredEventsUseCase: GetConfiguredEventsUseCase = new GetConfiguredEventsUseCaseImpl(
    flexFactConfigRepository
  );
  const readSignalsFromFlexFactUseCase: ReadSignalsFromFlexFactUseCase = new ReadSignalsFromFlexFactUseCaseImpl(
    modbusConnection,
    flexFactConfigRepository
  );
  const sendSignalsToFlexFactUseCase: SendSignalsToFlexFactUseCase = new SendSignalsToFlexFactUseCaseImpl(
    modbusConnection,
    flexFactConfigRepository
  );
  const interpretEventsFromFlexFactUseCase: InterpretEventsFromFlexFactUseCase = new InterpretEventsFromFlexFactUseCaseImpl(
    flexFactConfigRepository
  );
  const applyOutputEventsToSignalsUseCase: ApplyOutputEventsToSignalsUseCase = new ApplyOutputEventsToSignalsUseCaseImpl();
  const sendMarkingsToRendererUseCase: SendMarkingsToRendererUseCase = new SendMarkingsToRendererUseCaseImpl(
    mainWindow as BrowserWindow
  );
  const runPetriNetStepUseCase: RunPetriNetStepUseCase = new RunPetriNetStepUseCaseImpl(
    signalRepository,
    petriNetRepository,
    flexFactConfigRepository,
    readSignalsFromFlexFactUseCase,
    sendSignalsToFlexFactUseCase,
    interpretEventsFromFlexFactUseCase,
    calculateActiveTransitionsMatrixUseCase,
    calculateTransitionMatrixUseCase,
    calculateMarkingsMatrixUseCase,
    applyOutputEventsToSignalsUseCase,
    sendMarkingsToRendererUseCase
  );
  const startPetriNetUseCase: StartPetriNetUseCase = new StartPetriNetUseCaseImpl(
    petriNetRepository,
    signalRepository,
    calculateConsumerMatrixUseCase,
    calculateProducerMatrixUseCase,
    readSignalsFromFlexFactUseCase,
    scheduler,
    runPetriNetStepUseCase
  );
  const stopPetriNetUseCase: StopPetriNetUseCase = new StopPetriNetUseCaseImpl(
    petriNetRepository,
    signalRepository,
    scheduler
  );

  ipcMain.handle(
    'import-modbus-tcp-config',
    async (
      _,
      payload: { filePath: string }
    ): Promise<IpcResponse<undefined> | IpcErrorResponse> => {
      try {
        await importFlexFactConfigUseCase.invoke(payload.filePath);
        return {
          type: 'success',
          data: undefined,
        };
      } catch (e) {
        return {
          type: 'failure',
          error:
            'The file provided is invalid. Please try again with another file.',
        };
      }
    }
  );

  ipcMain.handle(
    'get-configured-events',
    async (): Promise<IpcResponse<Event[]> | IpcErrorResponse> => {
      try {
        const events = getConfiguredEventsUseCase.invoke();
        return {
          type: 'success',
          data: events.map(({ name, type }) => ({ name, type })),
        };
      } catch (e) {
        return {
          type: 'failure',
          error:
            'Unable to retrieve FlexFact configuration. Please, retry or reupload it.',
        };
      }
    }
  );

  ipcMain.handle(
    'connect-to-flexfact',
    async (): Promise<IpcResponse<undefined> | IpcErrorResponse> => {
      try {
        const {
          ip,
          port,
        } = flexFactConfigRepository.getConfig() as FlexFactConfig;
        await modbusConnection.connect(ip, port);
        return {
          type: 'success',
          data: undefined,
        };
      } catch (e) {
        return {
          type: 'failure',
          error:
            'Unable to connect to FlexFact. Please check that FlexFact is ready to receive a connection.',
        };
      }
    }
  );

  ipcMain.handle(
    'disconnect-from-flexfact',
    async (): Promise<IpcResponse<undefined> | IpcErrorResponse> => {
      try {
        modbusConnection.disconnect();
        return {
          type: 'success',
          data: undefined,
        };
      } catch (e) {
        return {
          type: 'failure',
          error: 'Unable to disconnect from FlexFact. Please try again.',
        };
      }
    }
  );

  ipcMain.handle(
    'run-petri-net',
    async (
      _,
      petrinet: PetriNet
    ): Promise<IpcResponse<undefined> | IpcErrorResponse> => {
      try {
        startPetriNetUseCase.invoke(petrinet);
        return {
          type: 'success',
          data: undefined,
        };
      } catch (e) {
        return {
          type: 'failure',
          error: 'Unable to run Petri Net.',
        };
      }
    }
  );

  ipcMain.handle(
    'stop-petri-net',
    async (): Promise<IpcResponse<undefined> | IpcErrorResponse> => {
      try {
        stopPetriNetUseCase.invoke();
        return {
          type: 'success',
          data: undefined,
        };
      } catch (e) {
        return {
          type: 'failure',
          error: 'Unable to stop Petri Net.',
        };
      }
    }
  );
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
          },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  setupServices();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  app.quit();
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', createWindow);
}
