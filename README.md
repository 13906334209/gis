# GIS 应用项目

全栈GIS应用项目，包含前端和后端。

## 技术栈

### 前端
- Vue 3
- TypeScript
- Element Plus
- Pinia
- Webpack
- OpenLayers
- ECharts
- Cesium

### 后端
- Python FastAPI
- Uvicorn

## 项目结构

```
gis/
├── frontend/          # 前端项目
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   ├── dist/         # 构建输出
│   └── package.json  # 前端依赖
├── backend/          # 后端项目
│   ├── app/         # 应用代码
│   └── main.py      # 入口文件
└── README.md        # 项目说明
```

## 快速开始

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

前端服务将运行在 http://localhost:8080

### 后端开发

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

后端API将运行在 http://localhost:8000

API文档访问：http://localhost:8000/docs

## 开发说明

- 前端使用Webpack进行打包，支持热更新
- 后端使用FastAPI，支持自动API文档生成
- 前后端通过CORS进行跨域通信

