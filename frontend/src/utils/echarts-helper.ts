import * as echarts from 'echarts';

/**
 * ECharts helper utility class
 */
export class EChartsHelper {
  /**
   * Create an ECharts instance
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
   * Create a basic bar chart configuration
   */
  static createBarOption(data: any[]): echarts.EChartsOption {
    return {
      title: {
        text: 'Sample Chart'
      },
      tooltip: {},
      xAxis: {
        data: data.map(item => item.name)
      },
      yAxis: {},
      series: [{
        name: 'Value',
        type: 'bar',
        data: data.map(item => item.value)
      }]
    };
  }
}

