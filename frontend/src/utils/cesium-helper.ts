import * as Cesium from 'cesium';

/**
 * Cesium 辅助工具类
 */
export class CesiumHelper {
  /**
   * 创建Cesium Viewer
   */
  static async createViewer(container: string | HTMLElement): Promise<Cesium.Viewer> {
    Cesium.Ion.defaultAccessToken = ''; // 需要设置Cesium Ion访问令牌
    
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

