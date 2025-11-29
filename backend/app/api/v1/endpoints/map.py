from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
import httpx
from typing import Optional

router = APIRouter()

@router.get("/tiles/{z}/{x}/{y}")
async def get_tile(
    z: int,
    x: int,
    y: int,
    map_type: str = Query("gaode", description="地图类型: gaode(高德), osm(OpenStreetMap) 或 tianditu(天地图)")
):
    """
    代理地图瓦片
    支持高德地图和天地图
    """
    import logging
    logger = logging.getLogger(__name__)
    # 如果logger没有handler，添加一个
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    
    try:
        if map_type == "gaode":
            # 高德地图瓦片URL
            # 高德地图使用XYZ坐标系（Y轴向上），OpenLayers使用TMS（Y轴向下）
            # 需要转换Y坐标：y_gaode = 2^z - 1 - y
            y_gaode = (2 ** z) - 1 - y
            # 高德地图有多个服务器，随机选择以提高可用性
            import random
            server = random.randint(0, 3)
            # 使用webrd服务（路网图），style=8表示标准地图
            url = f"https://webrd0{server}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y_gaode}&z={z}"
            logger.info(f"请求高德地图瓦片: z={z}, x={x}, y={y}, y_gaode={y_gaode}, server={server}, url={url}")
        elif map_type == "osm":
            # OpenStreetMap 瓦片服务（最稳定，无需API key）
            # 使用多个镜像服务器以提高可用性
            import random
            servers = [
                f"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                f"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                f"https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                f"https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ]
            url = random.choice(servers)
            logger.info(f"请求OpenStreetMap瓦片: z={z}, x={x}, y={y}, url={url}")
        elif map_type == "tianditu":
            # 天地图瓦片URL
            # 天地图也使用XYZ坐标系
            y_tianditu = (2 ** z) - y - 1
            import random
            server = random.randint(0, 7)
            url = f"https://t{server}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y_tianditu}&l={z}"
        else:
            raise HTTPException(status_code=400, detail=f"不支持的地图类型: {map_type}，支持的类型: osm, gaode, tianditu")
        
        # 代理请求地图瓦片
        # 根据地图类型设置不同的请求头
        if map_type == "osm":
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        else:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://www.amap.com/"
            }
        
        # 增加超时时间到30秒，并设置连接超时
        timeout = httpx.Timeout(30.0, connect=10.0)
        async with httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True) as client:
            try:
                response = await client.get(url)
                
                if response.status_code == 200:
                    # 返回图片数据
                    content_type = response.headers.get("content-type", "image/png")
                    # 如果返回的不是图片，可能是错误页面
                    if "image" not in content_type:
                        raise HTTPException(status_code=502, detail=f"地图服务返回非图片数据: {content_type}")
                    
                    return Response(
                        content=response.content,
                        media_type=content_type,
                        headers={
                            "Cache-Control": "public, max-age=86400",
                            "Access-Control-Allow-Origin": "*"
                        }
                    )
                else:
                    raise HTTPException(status_code=response.status_code, detail=f"地图瓦片加载失败，状态码: {response.status_code}")
            except httpx.ConnectError as e:
                logger.error(f"连接错误: {str(e)}, URL: {url}")
                raise HTTPException(status_code=502, detail=f"无法连接到地图服务器: {str(e)}")
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP状态错误: {e.response.status_code}, URL: {url}")
                raise HTTPException(status_code=502, detail=f"地图服务HTTP错误: {e.response.status_code}")
                
    except httpx.TimeoutException as e:
        logger.error(f"地图服务超时: {str(e)}, URL: {url if 'url' in locals() else 'unknown'}")
        raise HTTPException(status_code=504, detail=f"地图服务超时，请稍后重试。URL: {url if 'url' in locals() else 'unknown'}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"地图服务请求失败: {str(e)}")
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"服务器错误: {str(e)}\n{error_detail}")
        raise HTTPException(status_code=500, detail=f"服务器错误: {str(e)}")

