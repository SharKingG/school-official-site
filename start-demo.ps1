Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd D:\projects\school-official-site\school-api; npm run start:dev'

Start-Sleep -Seconds 5

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd D:\projects\school-official-site\school-admin; npm run dev'

Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd D:\projects\school-official-site\school-web; npm run dev -- --host 127.0.0.1'