<template>
  <div class="home">
    <el-container>
      <el-header>
        <h1>GIS Application</h1>
      </el-header>
      <el-main>
        <p>欢迎使用GIS应用框架</p>
        <p>前端技术栈：Vue 3 + TypeScript + Element Plus + Pinia + Webpack 的</p>
        <p>地图库：OpenLayers + Cesium</p>
        <p>图表库：ECharts</p>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// Home component
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;

  .el-header {
    background-color: #409eff;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;

    h1 {
      margin: 0;
    }
  }

  .el-main {
    padding: 20px;

    p {
      margin: 10px 0;
      font-size: 16px;
    }
  }
}
</style>
