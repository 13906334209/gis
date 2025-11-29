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
    map_type: str = Query("gaode", description="Map type: gaode(Gaode Map), osm(OpenStreetMap) or tianditu(Tianditu)")
):
    """
    Proxy map tiles
    Supports Gaode Map, OpenStreetMap, and Tianditu
    """
    import logging
    logger = logging.getLogger(__name__)
    # Add handler if logger doesn't have one
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    
    try:
        if map_type == "gaode":
            # Gaode Map tile URL
            # Gaode Map uses XYZ coordinate system (Y-axis up), OpenLayers uses TMS (Y-axis down)
            # Need to convert Y coordinate: y_gaode = 2^z - 1 - y
            y_gaode = (2 ** z) - 1 - y
            # Gaode Map has multiple servers, randomly select one for better availability
            import random
            server = random.randint(0, 3)
            # Use webrd service (road network map), style=8 means standard map
            url = f"https://webrd0{server}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y_gaode}&z={z}"
            logger.info(f"Requesting Gaode Map tile: z={z}, x={x}, y={y}, y_gaode={y_gaode}, server={server}, url={url}")
        elif map_type == "osm":
            # OpenStreetMap tile service (most stable, no API key required)
            # Use multiple mirror servers for better availability
            import random
            servers = [
                f"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                f"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                f"https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                f"https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ]
            url = random.choice(servers)
            logger.info(f"Requesting OpenStreetMap tile: z={z}, x={x}, y={y}, url={url}")
        elif map_type == "tianditu":
            # Tianditu tile URL
            # Tianditu also uses XYZ coordinate system
            y_tianditu = (2 ** z) - y - 1
            import random
            server = random.randint(0, 7)
            url = f"https://t{server}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y_tianditu}&l={z}"
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported map type: {map_type}. Supported types: osm, gaode, tianditu")
        
        # Proxy request for map tiles
        # Set different headers based on map type
        if map_type == "osm":
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        else:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://www.amap.com/"
            }
        
        # Increase timeout to 30 seconds and set connection timeout
        timeout = httpx.Timeout(30.0, connect=10.0)
        async with httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True) as client:
            try:
                response = await client.get(url)
                
                if response.status_code == 200:
                    # Return image data
                    content_type = response.headers.get("content-type", "image/png")
                    # If response is not an image, it might be an error page
                    if "image" not in content_type:
                        raise HTTPException(status_code=502, detail=f"Map service returned non-image data: {content_type}")
                    
                    return Response(
                        content=response.content,
                        media_type=content_type,
                        headers={
                            "Cache-Control": "public, max-age=86400",
                            "Access-Control-Allow-Origin": "*"
                        }
                    )
                else:
                    raise HTTPException(status_code=response.status_code, detail=f"Map tile loading failed, status code: {response.status_code}")
            except httpx.ConnectError as e:
                logger.error(f"Connection error: {str(e)}, URL: {url}")
                raise HTTPException(status_code=502, detail=f"Unable to connect to map server: {str(e)}")
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP status error: {e.response.status_code}, URL: {url}")
                raise HTTPException(status_code=502, detail=f"Map service HTTP error: {e.response.status_code}")
                
    except httpx.TimeoutException as e:
        logger.error(f"Map service timeout: {str(e)}, URL: {url if 'url' in locals() else 'unknown'}")
        raise HTTPException(status_code=504, detail=f"Map service timeout, please try again later. URL: {url if 'url' in locals() else 'unknown'}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Map service request failed: {str(e)}")
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"Server error: {str(e)}\n{error_detail}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

