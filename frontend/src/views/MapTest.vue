<template>
  <div class="map-test-container">
    <h2>地图测试页面</h2>
    <div id="test-map" ref="testMapContainer" style="width: 100%; height: 600px; border: 2px solid #ccc;"></div>
    <div class="test-info">
      <p>✅ 如果看到真实地图，说明后端代理工作正常</p>
      <p>✅ 当前使用后端代理的高德地图服务</p>
      <p>📍 高德地图在国内可以正常访问</p>
      <p>💡 如果看不到地图，请确保：</p>
      <ul style="text-align: left; margin: 10px 0; padding-left: 20px;">
        <li>后端服务已启动（http://localhost:8000）</li>
        <li>检查浏览器控制台是否有错误</li>
        <li>检查后端终端是否有错误日志</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

const testMapContainer = ref<HTMLElement>();

onMounted(() => {
  setTimeout(() => {
    if (testMapContainer.value) {
      console.log('Test map container:', testMapContainer.value);
      console.log('Container size:', testMapContainer.value.offsetWidth, 'x', testMapContainer.value.offsetHeight);
      
      try {
        // 使用后端代理的高德地图服务
        const mapLayer = new TileLayer({
          source: new XYZ({
            url: 'http://localhost:8000/api/v1/map/tiles/{z}/{x}/{y}?map_type=gaode',
            tileUrlFunction: (tileCoord) => {
              const z = tileCoord[0];
              const x = tileCoord[1];
              const y = tileCoord[2];
              return `http://localhost:8000/api/v1/map/tiles/${z}/${x}/${y}?map_type=gaode`;
            },
            crossOrigin: 'anonymous'
          })
        });

        const map = new Map({
          target: testMapContainer.value,
          layers: [mapLayer],
          view: new View({
            center: fromLonLat([104.0, 35.0]), // 中国中心
            zoom: 4.5
          })
        });
        
        console.log('Test map created successfully (using backend-proxied Gaode Map):', map);
        
        setTimeout(() => {
          map.updateSize();
          console.log('Test map size updated');
        }, 200);
      } catch (error) {
        console.error('Test map creation failed:', error);
      }
    } else {
      console.error('Test map container not found');
    }
  }, 100);
});
</script>

<style scoped>
.map-test-container {
  padding: 20px;
}

.test-info {
  margin-top: 20px;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 4px;
}

.test-info p {
  margin: 5px 0;
}
</style>

