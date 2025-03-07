@echo off
echo 正在启动爱尔兰娜塔莎地接社网站服务器...

:: 检查是否以管理员权限运行
net session >nul 2>&1
if %errorLevel% == 0 (
    echo 正在设置开机自启动...
    :: 创建开机自启动快捷方式
    powershell "$WS = New-Object -ComObject WScript.Shell; $SC = $WS.CreateShortcut('%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\爱尔兰娜塔莎地接社网站.lnk'); $SC.TargetPath = '%~dp0start_server.bat'; $SC.WorkingDirectory = '%~dp0'; $SC.Save()"
    echo 开机自启动设置完成！
) else (
    echo 请以管理员权限运行此脚本以设置开机自启动
)

:: 获取本机IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set "IP=%%a"
    goto :found
)
:found
set "IP=%IP:~1%"

:: 启动服务器
echo 正在启动网站服务器...
echo 您可以通过以下地址访问网站：
echo 本机访问: http://aierlannatashadijieshe.com
echo 局域网访问: http://%IP%
echo.
python -m http.server 80 --bind 0.0.0.0

:: 如果服务器意外关闭，暂停显示错误信息
pause 