@echo off
echo Adding all files...
git add -A

echo Checking status...
git status

echo Committing changes...
git commit -m "Add complete GIS project framework: Vue3 + FastAPI with OpenLayers, Cesium, ECharts"

echo Pushing to remote repository...
git push origin main

echo Done!
pause

