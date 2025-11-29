<template>
  <div class="gis-container">
    <!-- 顶部工具栏 -->
    <div class="gis-header">
      <div class="header-left">
        <h2>GIS 旅游记录系</h2>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button :type="activeTool === 'select' ? 'primary' : ''" @click="setActiveTool('select')">
            <el-icon>
              <Pointer />
            </el-icon>
            选择
          </el-button>
          <el-button :type="activeTool === 'marker' ? 'primary' : ''" @click="setActiveTool('marker')">
            <el-icon>
              <Location />
            </el-icon>
            标记
          </el-button>
          <el-button :type="activeTool === 'route' ? 'primary' : ''" @click="setActiveTool('route')">
            <el-icon>
              <Guide />
            </el-icon>
            路线
          </el-button>
          <el-button :type="activeTool === 'search' ? 'primary' : ''" @click="showSearchDialog = true">
            <el-icon>
              <Search />
            </el-icon>
            搜索
          </el-button>
        </el-button-group>
        <el-button @click="showStats = !showStats">
          <el-icon>
            <DataAnalysis />
          </el-icon>
          统计
        </el-button>
      </div>
    </div>

    <div class="gis-content">
      <!-- 左侧功能面板 -->
      <div class="gis-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <h3>功能面板</h3>
          <el-button text @click="sidebarCollapsed = !sidebarCollapsed">
            <el-icon>
              <DArrowLeft v-if="!sidebarCollapsed" />
              <DArrowRight v-else />
            </el-icon>
          </el-button>
        </div>

        <el-tabs v-model="activeTab" class="sidebar-tabs">
          <!-- 旅游记录 -->
          <el-tab-pane label="旅游记录" name="travel">
            <div class="tab-content">
              <el-button type="primary" style="width: 100%; margin-bottom: 10px;" @click="showTravelDialog = true">
                <el-icon>
                  <Plus />
                </el-icon>
                添加记录
              </el-button>
              <el-scrollbar height="400px">
                <div v-if="gisStore.travelRecords.length === 0" class="empty-state">
                  <p>暂无旅游记录</p>
                  <p class="hint">点击"标记"按钮在地图上添加记录</p>
                </div>
                <div v-for="record in gisStore.travelRecords" :key="record.id" class="record-item">
                  <el-card shadow="hover" @click="focusOnLocation(record.location)">
                    <div class="record-header">
                      <h4>{{ record.title }}</h4>
                      <el-dropdown @command="(cmd: string) => handleRecordCommand(cmd, record.id)">
                        <el-icon class="more-icon">
                          <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item command="edit">编辑</el-dropdown-item>
                            <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                    <p class="record-desc">{{ record.description }}</p>
                    <div class="record-meta">
                      <el-tag size="small">{{ formatDate(record.date) }}</el-tag>
                      <el-rate v-if="record.rating" :model-value="record.rating" disabled size="small" />
                    </div>
                  </el-card>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>

          <!-- 笔记 -->
          <el-tab-pane label="笔记" name="notes">
            <div class="tab-content">
              <el-button type="primary" style="width: 100%; margin-bottom: 10px;" @click="showNoteDialog = true">
                <el-icon>
                  <Plus />
                </el-icon>
                添加笔记
              </el-button>
              <el-scrollbar height="400px">
                <div v-if="gisStore.notes.length === 0" class="empty-state">
                  <p>暂无笔记</p>
                </div>
                <div v-for="note in gisStore.notes" :key="note.id" class="note-item">
                  <el-card shadow="hover" @click="focusOnLocation(note.location)">
                    <div class="note-header">
                      <h4>{{ note.title }}</h4>
                      <el-dropdown @command="(cmd: string) => handleNoteCommand(cmd, note.id)">
                        <el-icon class="more-icon">
                          <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item command="edit">编辑</el-dropdown-item>
                            <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                    <p class="note-content">{{ note.content }}</p>
                    <el-tag size="small" :color="note.color">{{ formatDate(note.date) }}</el-tag>
                  </el-card>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>

          <!-- 路线 -->
          <el-tab-pane label="路线" name="routes">
            <div class="tab-content">
              <el-button type="primary" style="width: 100%; margin-bottom: 10px;" @click="showRouteDialog = true">
                <el-icon>
                  <Plus />
                </el-icon>
                创建路线
              </el-button>
              <el-scrollbar height="400px">
                <div v-if="gisStore.routes.length === 0" class="empty-state">
                  <p>暂无路线</p>
                </div>
                <div v-for="route in gisStore.routes" :key="route.id" class="route-item">
                  <el-card shadow="hover">
                    <div class="route-header">
                      <h4>{{ route.name }}</h4>
                      <el-dropdown @command="(cmd: string) => handleRouteCommand(cmd, route.id)">
                        <el-icon class="more-icon">
                          <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item command="view">查看</el-dropdown-item>
                            <el-dropdown-item command="edit">编辑</el-dropdown-item>
                            <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                    <p v-if="route.description" class="route-desc">{{ route.description }}</p>
                    <el-tag size="small">共 {{ route.points.length }} 个点</el-tag>
                  </el-card>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>

          <!-- 照片 -->
          <el-tab-pane label="照片" name="photos">
            <div class="tab-content">
              <el-upload class="photo-upload" action="#" :auto-upload="false" :on-change="handlePhotoChange"
                :show-file-list="false" accept="image/*" multiple>
                <el-button type="primary" style="width: 100%;">
                  <el-icon>
                    <Upload />
                  </el-icon>
                  上传照片
                </el-button>
              </el-upload>
              <el-scrollbar height="400px" style="margin-top: 10px;">
                <div v-if="photos.length === 0" class="empty-state">
                  <p>暂无照片</p>
                </div>
                <div class="photo-grid">
                  <div v-for="(photo, index) in photos" :key="index" class="photo-item">
                    <el-image :src="photo.url" :preview-src-list="photos.map(p => p.url)" fit="cover"
                      class="photo-image" />
                    <div class="photo-info">
                      <p>{{ photo.name }}</p>
                      <el-button size="small" text type="danger" @click="removePhoto(index)">
                        <el-icon>
                          <Delete />
                        </el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 地图区域 -->
      <div class="gis-map">
        <div id="map-container" ref="mapContainer"></div>

        <!-- 统计面板 -->
        <el-drawer v-model="showStats" title="旅游统计" direction="rtl" size="400px">
          <div class="stats-content">
            <el-card shadow="never" style="margin-bottom: 20px;">
              <template #header>
                <span>概览</span>
              </template>
              <div class="stat-item">
                <span>旅游记录：</span>
                <strong>{{ gisStore.travelRecords.length }}</strong>
              </div>
              <div class="stat-item">
                <span>笔记数量：</span>
                <strong>{{ gisStore.notes.length }}</strong>
              </div>
              <div class="stat-item">
                <span>路线数量：</span>
                <strong>{{ gisStore.routes.length }}</strong>
              </div>
            </el-card>

            <el-card shadow="never">
              <template #header>
                <span>旅游地点分布</span>
              </template>
              <div id="stats-chart" style="width: 100%; height: 300px;"></div>
            </el-card>
          </div>
        </el-drawer>
      </div>
    </div>

    <!-- 旅游记录对话框 -->
    <el-dialog v-model="showTravelDialog" title="添加旅游记录" width="600px" @close="resetTravelForm">
      <el-form :model="travelForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="travelForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="travelForm.description" type="textarea" :rows="4" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="travelForm.date" type="date" placeholder="选择日期" style="width: 100%;"
            format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="travelForm.rating" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input
            :value="`经度: ${travelForm.location.longitude.toFixed(6)}, 纬度: ${travelForm.location.latitude.toFixed(6)}`"
            disabled />
          <el-button style="margin-top: 10px;" @click="selectLocationOnMap('travel')">
            在地图上选择位置
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTravelDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTravelRecord">保存</el-button>
      </template>
    </el-dialog>

    <!-- 笔记对话框 -->
    <el-dialog v-model="showNoteDialog" title="添加笔记" width="600px" @close="resetNoteForm">
      <el-form :model="noteForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="noteForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="noteForm.content" type="textarea" :rows="6" placeholder="请输入笔记内容" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="noteForm.date" type="date" placeholder="选择日期" style="width: 100%;"
            format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="noteForm.color" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input
            :value="`经度: ${noteForm.location.longitude.toFixed(6)}, 纬度: ${noteForm.location.latitude.toFixed(6)}`"
            disabled />
          <el-button style="margin-top: 10px;" @click="selectLocationOnMap('note')">
            在地图上选择位置
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="saveNote">保存</el-button>
      </template>
    </el-dialog>

    <!-- 路线对话框 -->
    <el-dialog v-model="showRouteDialog" title="创建路线" width="600px" @close="resetRouteForm">
      <el-form :model="routeForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="routeForm.name" placeholder="请输入路线名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="routeForm.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="routeForm.color" />
        </el-form-item>
        <el-form-item label="路线点">
          <el-button @click="startRouteDrawing">开始绘制路线</el-button>
          <el-tag v-if="routeForm.points.length > 0" style="margin-left: 10px;">
            已添加 {{ routeForm.points.length }} 个点
          </el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRouteDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRoute">保存</el-button>
      </template>
    </el-dialog>

    <!-- 搜索对话框 -->
    <el-dialog v-model="showSearchDialog" title="搜索地点" width="500px">
      <el-input v-model="searchKeyword" placeholder="请输入地点名称" @keyup.enter="searchLocation">
        <template #append>
          <el-button @click="searchLocation">搜索</el-button>
        </template>
      </el-input>
      <div v-if="searchResults.length > 0" style="margin-top: 20px;">
        <el-scrollbar height="300px">
          <div v-for="(result, index) in searchResults" :key="index" class="search-result-item"
            @click="goToSearchResult(result)">
            <h4>{{ result.name }}</h4>
            <p>{{ result.address }}</p>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon, Circle, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Overlay } from 'ol';
import { OlHelper } from '@/utils/ol-helper';
import { EChartsHelper } from '@/utils/echarts-helper';
import { useGisStore } from '@/store';
import type { TravelRecord, Note, TravelRoute } from '@/types';
import {
  Pointer, Location, Guide, Search, DataAnalysis,
  Plus, MoreFilled, Upload, Delete, DArrowLeft, DArrowRight
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const gisStore = useGisStore();

// Map related
const mapContainer = ref<HTMLElement>();
let map: Map | null = null;
let vectorLayer: VectorLayer<VectorSource> | null = null;
let vectorSource: VectorSource | null = null;
const activeTool = ref('select');
const sidebarCollapsed = ref(false);
const activeTab = ref('travel');

// Dialog states
const showTravelDialog = ref(false);
const showNoteDialog = ref(false);
const showRouteDialog = ref(false);
const showSearchDialog = ref(false);
const showStats = ref(false);

// Form data
const travelForm = ref({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  location: { longitude: 116.3974, latitude: 39.9093 }, // Default to Beijing
  rating: 0
});

const noteForm = ref({
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  location: { longitude: 116.3974, latitude: 39.9093 },
  color: '#409EFF'
});

const routeForm = ref({
  name: '',
  description: '',
  color: '#FF6B6B',
  points: [] as Array<{ longitude: number; latitude: number; order: number }>
});

// Photo management
const photos = ref<Array<{ name: string; url: string }>>([]);

// Search
const searchKeyword = ref('');
const searchResults = ref<Array<{ name: string; address: string; location: { longitude: number; latitude: number } }>>([]);

// Currently editing record IDs
const editingRecordId = ref<string | null>(null);
const editingNoteId = ref<string | null>(null);
const editingRouteId = ref<string | null>(null);
const isDrawingRoute = ref(false);

// Initialize map
onMounted(() => {
  // Delay initialization to ensure DOM is fully rendered
  setTimeout(() => {
    if (mapContainer.value) {
      console.log('Initializing map, container:', mapContainer.value);
      initMap();
      loadMapData();
    } else {
      console.error('Map container not found');
    }
  }, 100);
});

onUnmounted(() => {
  if (map) {
    map.setTarget(undefined);
    map = null;
  }
});

const initMap = () => {
  if (!mapContainer.value) {
    console.error('Map container does not exist');
    return;
  }

  console.log('Starting map creation...');

  // Create vector layer
  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: (feature) => {
      const type = feature.get('type');
      const color = feature.get('color') || '#409EFF';

      if (type === 'travel') {
        return new Style({
          image: new Icon({
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.8"/>
                <circle cx="12" cy="12" r="6" fill="white"/>
              </svg>
            `),
            scale: 1
          })
        });
      } else if (type === 'note') {
        return new Style({
          image: new Icon({
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" fill="${color}" opacity="0.8" rx="2"/>
                <path d="M8 8h8M8 12h8M8 16h4" stroke="white" stroke-width="1.5" fill="none"/>
              </svg>
            `),
            scale: 1
          })
        });
      }
      return new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      });
    }
  });

  // Create map
  try {
    // Use backend-proxied Gaode Map service
    // Gaode Map is accessible in China, backend proxy solves CORS issues
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
      }),
      visible: true
    });

    // Listen for tile load errors
    mapLayer.getSource()?.on('tileloaderror', (event) => {
      console.warn('Map tile loading failed:', event);
    });

    map = new Map({
      target: mapContainer.value,
      layers: [
        mapLayer,
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([104.0, 35.0]), // Center of China
        zoom: 4.5 // Zoom level to show entire China
      })
    });

    console.log('Map created successfully', map);
    console.log('Map container size:', mapContainer.value?.offsetWidth, mapContainer.value?.offsetHeight);
    
    // Ensure map size is updated
    setTimeout(() => {
      if (map) {
        map.updateSize();
        console.log('Map size updated, current size:', map.getSize());
        console.log('Map view center:', map.getView().getCenter());
        console.log('Map zoom level:', map.getView().getZoom());
      }
    }, 300);
  } catch (error) {
    console.error('Map creation failed:', error);
    ElMessage.error('地图初始化失败，请检查网络连接');
  }

  // Map click event
  if (map) {
    map.on('click', (event) => {
      if (activeTool.value === 'marker') {
        const coords = toLonLat(event.coordinate);
        if (activeTab.value === 'travel') {
          travelForm.value.location = { longitude: coords[0], latitude: coords[1] };
          showTravelDialog.value = true;
        } else if (activeTab.value === 'notes') {
          noteForm.value.location = { longitude: coords[0], latitude: coords[1] };
          showNoteDialog.value = true;
        }
        activeTool.value = 'select';
      }
    });
  }
};

const loadMapData = () => {
  if (!vectorSource || !map) return;

  // Load travel records
  gisStore.travelRecords.forEach(record => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([record.location.longitude, record.location.latitude])),
      type: 'travel',
      id: record.id,
      title: record.title
    });
    if (vectorSource) {
      vectorSource.addFeature(feature);
    }
  });

  // Load notes
  gisStore.notes.forEach(note => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([note.location.longitude, note.location.latitude])),
      type: 'note',
      id: note.id,
      title: note.title,
      color: note.color || '#409EFF'
    });
    if (vectorSource) {
      vectorSource.addFeature(feature);
    }
  });

  // Load routes
  gisStore.routes.forEach(route => {
    // Can add route drawing logic here
  });
};

const setActiveTool = (tool: string) => {
  activeTool.value = tool;
};

const focusOnLocation = (location: { longitude: number; latitude: number }) => {
  if (map) {
    map.getView().animate({
      center: fromLonLat([location.longitude, location.latitude]),
      zoom: 15,
      duration: 1000
    });
  }
};

const saveTravelRecord = () => {
  if (!travelForm.value.title) {
    ElMessage.warning('请输入标题');
    return;
  }

  if (editingRecordId.value) {
    gisStore.updateTravelRecord(editingRecordId.value, travelForm.value);
    ElMessage.success('更新成功');
  } else {
    gisStore.addTravelRecord(travelForm.value);
    ElMessage.success('添加成功');
  }

  showTravelDialog.value = false;
  resetTravelForm();
  reloadMap();
};

const saveNote = () => {
  if (!noteForm.value.title) {
    ElMessage.warning('请输入标题');
    return;
  }

  if (editingNoteId.value) {
    gisStore.updateNote(editingNoteId.value, noteForm.value);
    ElMessage.success('更新成功');
  } else {
    gisStore.addNote(noteForm.value);
    ElMessage.success('添加成功');
  }

  showNoteDialog.value = false;
  resetNoteForm();
  reloadMap();
};

const saveRoute = () => {
  if (!routeForm.value.name) {
    ElMessage.warning('请输入路线名称');
    return;
  }

  if (routeForm.value.points.length < 2) {
    ElMessage.warning('路线至少需要2个点');
    return;
  }

  const routePoints = routeForm.value.points.map((p, index) => ({
    id: Date.now().toString() + index,
    longitude: p.longitude,
    latitude: p.latitude,
    order: index
  }));

  if (editingRouteId.value) {
    gisStore.updateRoute(editingRouteId.value, {
      ...routeForm.value,
      points: routePoints
    });
    ElMessage.success('更新成功');
  } else {
    gisStore.addRoute({
      ...routeForm.value,
      points: routePoints
    });
    ElMessage.success('创建成功');
  }

  showRouteDialog.value = false;
  resetRouteForm();
  reloadMap();
};

const resetTravelForm = () => {
  travelForm.value = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: { longitude: 116.3974, latitude: 39.9093 },
    rating: 0
  };
  editingRecordId.value = null;
};

const resetNoteForm = () => {
  noteForm.value = {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    location: { longitude: 116.3974, latitude: 39.9093 },
    color: '#409EFF'
  };
  editingNoteId.value = null;
};

const resetRouteForm = () => {
  routeForm.value = {
    name: '',
    description: '',
    color: '#FF6B6B',
    points: []
  };
  editingRouteId.value = null;
  isDrawingRoute.value = false;
};

const handleRecordCommand = (cmd: string, id: string) => {
  if (cmd === 'edit') {
    const record = gisStore.getTravelRecordById(id);
    if (record) {
      travelForm.value = {
        title: record.title,
        description: record.description,
        date: record.date,
        location: record.location,
        rating: record.rating || 0
      };
      editingRecordId.value = id;
      showTravelDialog.value = true;
    }
  } else if (cmd === 'delete') {
    ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      gisStore.deleteTravelRecord(id);
      ElMessage.success('删除成功');
      reloadMap();
    });
  }
};

const handleNoteCommand = (cmd: string, id: string) => {
  if (cmd === 'edit') {
    const note = gisStore.getNoteById(id);
    if (note) {
      noteForm.value = {
        title: note.title,
        content: note.content,
        date: note.date,
        location: note.location,
        color: note.color || '#409EFF'
      };
      editingNoteId.value = id;
      showNoteDialog.value = true;
    }
  } else if (cmd === 'delete') {
    ElMessageBox.confirm('确定要删除这条笔记吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      gisStore.deleteNote(id);
      ElMessage.success('删除成功');
      reloadMap();
    });
  }
};

const handleRouteCommand = (command: string, id: string) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定要删除这条路线吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      gisStore.deleteRoute(id);
      ElMessage.success('删除成功');
      reloadMap();
    });
  }
};

const reloadMap = () => {
  if (vectorSource && map) {
    vectorSource.clear();
    loadMapData();
  }
};

const selectLocationOnMap = (type: string) => {
  activeTool.value = 'marker';
  if (type === 'travel') {
    activeTab.value = 'travel';
  } else {
    activeTab.value = 'notes';
  }
  ElMessage.info('请在地图上点击选择位置');
};

const startRouteDrawing = () => {
  isDrawingRoute.value = true;
  activeTool.value = 'route';
  routeForm.value.points = [];
  ElMessage.info('请在地图上点击添加路线点，完成后点击保存');

  if (map) {
    const clickHandler = (event: any) => {
      if (isDrawingRoute.value && activeTool.value === 'route') {
        const coords = toLonLat(event.coordinate);
        routeForm.value.points.push({
          longitude: coords[0],
          latitude: coords[1],
          order: routeForm.value.points.length
        });
        ElMessage.success(`已添加第 ${routeForm.value.points.length} 个点`);
      }
    };

    map.once('click', clickHandler);
  }
};

const handlePhotoChange = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    photos.value.push({
      name: file.name,
      url: e.target?.result as string
    });
  };
  reader.readAsDataURL(file.raw);
};

const removePhoto = (index: number) => {
  photos.value.splice(index, 1);
};

const searchLocation = () => {
  if (!searchKeyword.value) {
    ElMessage.warning('请输入搜索关键词');
    return;
  }

  // Can integrate real map search API here, currently using mock data
  ElMessage.info('Search function needs to integrate map API (such as Gaode, Baidu, etc.)');
  searchResults.value = [
    {
      name: searchKeyword.value + ' (示例)',
      address: '北京市示例地址',
      location: { longitude: 116.3974, latitude: 39.9093 }
    }
  ];
};

const goToSearchResult = (result: any) => {
  focusOnLocation(result.location);
  showSearchDialog.value = false;
};

const formatDate = (date: string) => {
  return date.split('T')[0];
};

// Initialize statistics chart
const initStatsChart = () => {
  nextTick(() => {
    const chartElement = document.getElementById('stats-chart');
    if (chartElement && gisStore.travelRecords.length > 0) {
      const chart = EChartsHelper.createChart(chartElement);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'pie',
          data: [
            { value: gisStore.travelRecords.length, name: '旅游记录' },
            { value: gisStore.notes.length, name: '笔记' },
            { value: gisStore.routes.length, name: '路线' }
          ]
        }]
      };
      chart.setOption(option);
    }
  });
};

// Watch statistics panel display
watch(showStats, (val) => {
  if (val) {
    initStatsChart();
  }
});
</script>

<style lang="scss" scoped>
.gis-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.gis-header {
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;

  .header-left h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.gis-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  height: calc(100vh - 60px);
  /* 减去header高度 */
  min-height: 0;
}

.gis-sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;

  &.collapsed {
    width: 0;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 15px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 16px;
    }
  }

  .sidebar-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: hidden;
    }

    .tab-content {
      padding: 15px;
      height: 100%;
    }
  }
}

.gis-map {
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  #map-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
    position: relative;
    background-color: #e8e8e8;
    flex: 1;
  }

  /* 确保OpenLayers地图容器有正确的样式 */
  :deep(.ol-viewport) {
    width: 100% !important;
    height: 100% !important;
  }

  :deep(.ol-overlaycontainer-stopevent) {
    width: 100%;
    height: 100%;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;

  .hint {
    font-size: 12px;
    margin-top: 10px;
  }
}

.record-item,
.note-item,
.route-item {
  margin-bottom: 10px;

  .record-header,
  .note-header,
  .route-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }

    .more-icon {
      cursor: pointer;
      color: #999;
    }
  }

  .record-desc,
  .note-content,
  .route-desc {
    font-size: 12px;
    color: #666;
    margin: 8px 0;
    line-height: 1.5;
  }

  .record-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  .photo-item {
    position: relative;

    .photo-image {
      width: 100%;
      height: 120px;
      border-radius: 4px;
    }

    .photo-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;

      p {
        margin: 0;
        font-size: 12px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
    }
  }
}

.search-result-item {
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f5f7fa;
  }

  h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #999;
  }
}

.stats-content {
  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    strong {
      color: #409eff;
    }
  }
}
</style>
