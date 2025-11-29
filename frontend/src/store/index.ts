import { defineStore } from 'pinia';
import type { TravelRecord, Note, TravelRoute } from '@/types';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 应用状态
  }),
  getters: {
    // 计算属性
  },
  actions: {
    // 方法
  }
});

// GIS数据管理 Store
export const useGisStore = defineStore('gis', {
  state: () => {
    const savedTravelRecords = localStorage.getItem('gis-travel-records');
    const savedNotes = localStorage.getItem('gis-notes');
    const savedRoutes = localStorage.getItem('gis-routes');
    
    return {
      travelRecords: (savedTravelRecords ? JSON.parse(savedTravelRecords) : []) as TravelRecord[],
      notes: (savedNotes ? JSON.parse(savedNotes) : []) as Note[],
      routes: (savedRoutes ? JSON.parse(savedRoutes) : []) as TravelRoute[]
    };
  },
  getters: {
    getTravelRecordById: (state) => (id: string) => {
      return state.travelRecords.find(record => record.id === id);
    },
    getNoteById: (state) => (id: string) => {
      return state.notes.find(note => note.id === id);
    },
    getRouteById: (state) => (id: string) => {
      return state.routes.find(route => route.id === id);
    }
  },
  actions: {
    // 旅游记录操作
    addTravelRecord(record: Omit<TravelRecord, 'id' | 'createdAt' | 'updatedAt'>) {
      const newRecord: TravelRecord = {
        ...record,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.travelRecords.push(newRecord);
      this.saveTravelRecords();
      return newRecord;
    },
    updateTravelRecord(id: string, updates: Partial<TravelRecord>) {
      const index = this.travelRecords.findIndex(r => r.id === id);
      if (index !== -1) {
        this.travelRecords[index] = {
          ...this.travelRecords[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.saveTravelRecords();
      }
    },
    deleteTravelRecord(id: string) {
      this.travelRecords = this.travelRecords.filter(r => r.id !== id);
      this.saveTravelRecords();
    },
    
    // 笔记操作
    addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.notes.push(newNote);
      this.saveNotes();
      return newNote;
    },
    updateNote(id: string, updates: Partial<Note>) {
      const index = this.notes.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notes[index] = {
          ...this.notes[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.saveNotes();
      }
    },
    deleteNote(id: string) {
      this.notes = this.notes.filter(n => n.id !== id);
      this.saveNotes();
    },
    
    // 路线操作
    addRoute(route: Omit<TravelRoute, 'id' | 'createdAt' | 'updatedAt'>) {
      const newRoute: TravelRoute = {
        ...route,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.routes.push(newRoute);
      this.saveRoutes();
      return newRoute;
    },
    updateRoute(id: string, updates: Partial<TravelRoute>) {
      const index = this.routes.findIndex(r => r.id === id);
      if (index !== -1) {
        this.routes[index] = {
          ...this.routes[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.saveRoutes();
      }
    },
    deleteRoute(id: string) {
      this.routes = this.routes.filter(r => r.id !== id);
      this.saveRoutes();
    },
    
    // 保存到localStorage
    saveTravelRecords() {
      localStorage.setItem('gis-travel-records', JSON.stringify(this.travelRecords));
    },
    saveNotes() {
      localStorage.setItem('gis-notes', JSON.stringify(this.notes));
    },
    saveRoutes() {
      localStorage.setItem('gis-routes', JSON.stringify(this.routes));
    }
  }
});

// 用户认证 Store
export const useAuthStore = defineStore('auth', {
  state: () => {
    // 从 localStorage 恢复状态
    const savedUser = localStorage.getItem('auth-user');
    const savedAuth = localStorage.getItem('auth-isAuthenticated');
    
    return {
      user: savedUser ? JSON.parse(savedUser) : null as { username: string; role: 'admin' | 'user' } | null,
      isAuthenticated: savedAuth === 'true'
    };
  },
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user',
    currentUser: (state) => state.user
  },
  actions: {
    login(username: string, password: string): boolean {
      // 管理员账户
      if (username === 'admin' && password === '123456') {
        this.user = { username: 'admin', role: 'admin' };
        this.isAuthenticated = true;
        localStorage.setItem('auth-user', JSON.stringify(this.user));
        localStorage.setItem('auth-isAuthenticated', 'true');
        return true;
      }
      
      // 使用者账户
      if (username === 'gis123' && password === '123456') {
        this.user = { username: 'gis123', role: 'user' };
        this.isAuthenticated = true;
        localStorage.setItem('auth-user', JSON.stringify(this.user));
        localStorage.setItem('auth-isAuthenticated', 'true');
        return true;
      }
      
      return false;
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth-user');
      localStorage.removeItem('auth-isAuthenticated');
    }
  }
});

