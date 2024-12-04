import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SbbLocaleService {
  language: string;

  private _i18n = {
    de: {
      close: 'Schliessen',
      touchOverlay: {
        tip: 'Benutzen Sie 2 Finger um die Karte zu bedienen.',
      },
      a4a: {
        visualFunction: 'Visuelle Funktion, nicht für Screenreader gedacht.',
        zoomIn: 'Kartenausschnitt vergrössern.',
        zoomOut: 'Kartenausschnitt verkleinern.',
        levelSwitch: 'Stockwerk wechseln.',
        selectFloor: 'Stockwerk [0] anzeigen.',
        unselectFloor: 'Stockwerk [0] abwählen.',
        basemapSwitch: 'Kartentyp ändern.',
        homeButton: 'Default Zoom',
        compassButton: 'Auf Norden zurücksetzen',
        geolocateButton: 'Meinen Standort anzeigen',
      },
    },
    fr: {
      close: 'Fermer',
      touchOverlay: {
        tip: 'Utilisez deux doigts pour consulter la carte.',
      },
      a4a: {
        visualFunction: "Fonction visuelle, non destinée aux lecteurs d'écran.",
        zoomIn: 'Zoomer.',
        zoomOut: 'Dézoomer.',
        levelSwitch: "Changement d'étage.",
        selectFloor: "Afficher l'étage [0].",
        unselectFloor: "Désélectionner l'étage [0].",
        basemapSwitch: 'Changer le type de la carte.',
        homeButton: 'Zoom par défaut',
        compassButton: 'Réinitialiser au nord',
        geolocateButton: 'Afficher ma position',
      },
    },
    it: {
      close: 'Chiudere',
      touchOverlay: {
        tip: 'Utilizzate due dita per muovervi nella mappa.',
      },
      a4a: {
        visualFunction: 'Funzione visiva, non destinata ai lettori di schermo.',
        zoomIn: 'Ingrandire la sezione della mappa.',
        zoomOut: 'Ridurre la sezione della mappa.',
        levelSwitch: 'Cambio di piano.',
        selectFloor: 'Mostra il piano [0].',
        unselectFloor: 'Deselezionare il piano [0].',
        basemapSwitch: 'Cambiare il tipo di mappa',
        homeButton: 'Zoom di default',
        compassButton: 'Reimposta a Nord',
        geolocateButton: 'Mostra la mia posizione',
      },
    },
    en: {
      close: 'Close',
      touchOverlay: {
        tip: 'Use two fingers to operate the map.',
      },
      a4a: {
        visualFunction: 'Visual function, not intended for screen readers.',
        zoomIn: 'Zoom in on map.',
        zoomOut: 'Zoom out on map.',
        levelSwitch: 'Switch floor.',
        selectFloor: 'Select floor [0].',
        unselectFloor: 'Unselect floor [0].',
        basemapSwitch: 'Change the map type',
        homeButton: 'Default Zoom',
        compassButton: 'Reset to North',
        geolocateButton: 'Show my location',
      },
    },
  };

  constructor(@Inject(LOCALE_ID) private _locale: string) {
    this.language = _locale?.split('-')[0] ?? 'de';
  }

  getText(key: string): string {
    const path = `${this.language}.${key}`.split('.');
    return path.reduce((prev: any, curr) => prev && prev[curr], this._i18n);
  }

  getTextWithParams(key: string, ...params: any[]): string {
    let text = this.getText(key);
    params.forEach((value, index) => (text = text.replace(`[${index}]`, value)));
    return text;
  }
}
