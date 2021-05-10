import { BrowserWindow } from 'electron';
import { Place } from '../../../shared/petrinet';

export interface SendMarkingsToRendererUseCase {
  invoke(places: Place[], markings: number[]): void;
}

export class SendMarkingsToRendererUseCaseImpl
  implements SendMarkingsToRendererUseCase {
  constructor(private window: BrowserWindow) {
    this.window = window;
  }

  public invoke(places: Place[], markings: number[]): void {
    this.window.webContents.send(
      'update-tokens',
      places.map<Place>((place, index) => ({
        id: place.id,
        tokens: markings[index],
      }))
    );
  }
}
