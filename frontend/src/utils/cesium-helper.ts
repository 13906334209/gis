import * as Cesium from 'cesium';

/**
 * Cesium helper utility class
 */
export class CesiumHelper {
  /**
   * Create a Cesium Viewer
   */
  static async createViewer(container: string | HTMLElement): Promise<Cesium.Viewer> {
    Cesium.Ion.defaultAccessToken = ''; // Need to set Cesium Ion access token
    
    const element = typeof container === 'string' 
      ? document.getElementById(container) || document.querySelector(container) as HTMLElement
      : container;
    
    if (!element) {
      throw new Error('Container element not found');
    }
    
    const terrainProvider = await Cesium.createWorldTerrainAsync();
    
    return new Cesium.Viewer(element, {
      terrainProvider: terrainProvider
    });
  }
}

