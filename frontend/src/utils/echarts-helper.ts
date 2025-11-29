import * as echarts from 'echarts';

/**
 * ECharts 辅助工具类
 */
export class EChartsHelper {
  /**
   * 创建ECharts实例
   */
  static createChart(container: string | HTMLElement, theme?: string): echarts.ECharts {
    const element = typeof container === 'string' 
      ? document.getElementById(container) || document.querySelector(container) as HTMLElement
      : container;
    
    if (!element) {
      throw new Error('Container element not found');
    }
    
    return echarts.init(element, theme);
  }

  /**
   * 创建基础柱状图配置
   */
  static createBarOption(data: any[]): echarts.EChartsOption {
    return {
      title: {
        text: '示例图表'
      },
      tooltip: {},
      xAxis: {
        data: data.map(item => item.name)
      },
      yAxis: {},
      series: [{
        name: '数值',
        type: 'bar',
        data: data.map(item => item.value)
      }]
    };
  }
}

