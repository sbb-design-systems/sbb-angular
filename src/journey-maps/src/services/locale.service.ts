import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  language = 'de';

  private i18n = {
    de: {
      close: 'Schliessen',
      touchOverlay: {
        tip: 'Benutzen Sie 2 Finger um die Karte zu bedienen.'
      },
      a4a: {
        visualFunction: 'Visuelle Funktion, nicht für Screenreader gedacht.',
        zoomIn: 'Kartenausschnitt vergrössern.',
        zoomOut: 'Kartenausschnitt verkleinern.',
        selectFloor: 'Stockwerk [0] anzeigen.',
        basemapSwitch: 'Kartentyp ändern.',
        homeButton: 'Ganze Schweiz',
      }
    },
    fr: {
      close: 'Fermer',
      touchOverlay: {
        tip: 'Utilisez deux doigts pour consulter la carte.'
      },
      a4a: {
        visualFunction: 'Fonction visuelle, non destinée aux lecteurs d\'écran.',
        zoomIn: 'Zoomer.',
        zoomOut: 'Dézoomer.',
        selectFloor: 'Afficher l\'étage [0].',
        basemapSwitch: 'Changer le type de la carte.',
        homeButton: 'La suisse entière',
      }
    },
    it: {
      close: 'Chiudere',
      touchOverlay: {
        tip: 'Utilizzate due dita per muovervi nella mappa.'
      },
      a4a: {
        visualFunction: 'Funzione visiva, non destinata ai lettori di schermo.',
        zoomIn: 'Ingrandire la sezione della mappa.',
        zoomOut: 'Ridurre la sezione della mappa.',
        selectFloor: 'Mostra il piano [0].',
        basemapSwitch: 'Cambiare il tipo di mappa',
        homeButton: 'Tutta la Svizzera',
      }
    },
    en: {
      close: 'Close',
      touchOverlay: {
        tip: 'Use two fingers to operate the map.'
      },
      a4a: {
        visualFunction: 'Visual function, not intended for screen readers.',
        zoomIn: 'Zoom in on map.',
        zoomOut: 'Zoom out on map.',
        selectFloor: 'Select floor [0].',
        basemapSwitch: 'Change the map type',
        homeButton: 'All of Switzerland',
      }
    }
  };

  constructor() {
  }

  getText(key: string): string {
    const path = (`${this.language}.${key}`).split('.');
    return path.reduce((prev, curr) => prev && prev[curr], this.i18n);
  }

  getTextWithParams(key: string, ...params: any[]): string {
    let text = this.getText(key);
    params.forEach((value, index) => text = text.replace(`[${index}]`, value));
    return text;
  }
}
