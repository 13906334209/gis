<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>GIS Application</h1>
          <div class="user-info">
            <el-dropdown @command="handleCommand">
              <span class="user-dropdown">
                <el-icon><User /></el-icon>
                <span class="username">{{ authStore.currentUser?.username }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>
                    <el-tag :type="authStore.isAdmin ? 'danger' : 'success'" size="small">
                      {{ authStore.isAdmin ? '管理员' : '使用者' }}
                    </el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎，{{ authStore.currentUser?.username }}！</span>
            </div>
          </template>
          <div class="content">
            <el-alert
              :title="authStore.isAdmin ? '管理员权限' : '普通用户权限'"
              :type="authStore.isAdmin ? 'warning' : 'info'"
              :description="authStore.isAdmin ? '您拥有系统管理权限，可以访问所有功能' : '您拥有普通用户权限，可以访问基础功能'"
              show-icon
              :closable="false"
              style="margin-bottom: 20px;"
            />
            <div class="info-section">
              <h3>系统信息</h3>
              <p>前端技术栈：Vue 3 + TypeScript + Element Plus + Pinia + Webpack</p>
              <p>地图库：OpenLayers + Cesium</p>
              <p>图表库：ECharts</p>
            </div>
            <div class="action-section" style="margin-top: 30px;">
              <el-button type="primary" size="large" @click="goToGis">
                <el-icon><Location /></el-icon>
                进入 GIS 旅游记录系统
              </el-button>
              <el-button type="info" size="large" style="margin-left: 10px;" @click="goToMapTest">
                <el-icon><Location /></el-icon>
                地图测试页面
              </el-button>
            </div>
            <div v-if="authStore.isAdmin" class="admin-section">
              <el-divider>管理员专属功能</el-divider>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card shadow="hover">
                    <h4>用户管理</h4>
                    <p>管理系统用户和权限</p>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover">
                    <h4>系统配置</h4>
                    <p>配置系统参数和设置</p>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover">
                    <h4>数据管理</h4>
                    <p>管理GIS数据和资源</p>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { User, ArrowDown, SwitchButton, Location } from '@element-plus/icons-vue';
import { useAuthStore } from '@/store';

const router = useRouter();
const authStore = useAuthStore();

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      authStore.logout();
      ElMessage.success('已退出登录');
      router.push('/login');
    }).catch(() => {
      // 取消操作
    });
  }
};

const goToGis = () => {
  router.push('/gis');
};

const goToMapTest = () => {
  router.push('/map-test');
};
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

    .header-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        margin: 0;
        font-size: 24px;
      }

      .user-info {
        .user-dropdown {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: white;
          font-size: 14px;

          .username {
            font-weight: 500;
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

  .el-main {
    padding: 20px;
    background-color: #f5f5f5;

    .welcome-card {
      .card-header {
        font-size: 18px;
        font-weight: 600;
      }

      .content {
        .info-section {
          margin-top: 20px;

          h3 {
            margin-bottom: 15px;
            color: #333;
          }

          p {
            margin: 10px 0;
            font-size: 14px;
            color: #666;
            line-height: 1.8;
          }
        }

        .admin-section {
          margin-top: 30px;

          .el-card {
            text-align: center;
            height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            h4 {
              margin: 0 0 10px 0;
              color: #333;
            }

            p {
              margin: 0;
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
