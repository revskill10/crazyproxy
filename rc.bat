@echo off
start "redis-server" "E:\dungth\redis-2.1.5-win32\redis-server.exe"
start "redis-server2" "E:\dungth\redis-2.1.5-win32\redis-server.exe" "E:\dungth\redis-2.1.5-win32\redisdk3.conf"
start "" "node" "E:\dungth\MainApp\realtime\gateway.js"
start "Monitor" "node" "E:\dungth\MainApp\realtime\monitor.js"
