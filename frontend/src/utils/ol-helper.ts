import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

/**
 * OpenLayers helper utility class
 */
export class OlHelper {
  /**
   * Create a basic map
   */
  static createMap(container: string | HTMLElement): Map {
    return new Map({
      target: container,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }
}

