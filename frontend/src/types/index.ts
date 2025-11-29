// 全局类型定义

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 旅游记录类型
export interface TravelRecord {
  id: string;
  title: string;
  description: string;
  location: {
    longitude: number;
    latitude: number;
  };
  date: string;
  photos?: string[];
  tags?: string[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// 笔记类型
export interface Note {
  id: string;
  title: string;
  content: string;
  location: {
    longitude: number;
    latitude: number;
  };
  date: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// 路线点类型
export interface RoutePoint {
  id: string;
  longitude: number;
  latitude: number;
  name?: string;
  order: number;
}

// 旅游路线类型
export interface TravelRoute {
  id: string;
  name: string;
  description?: string;
  points: RoutePoint[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

