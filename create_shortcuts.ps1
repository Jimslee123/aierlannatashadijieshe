# 创建桌面快捷方式
$WshShell = New-Object -comObject WScript.Shell

# 创建网站快捷方式
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\IrishTravel.url")
$Shortcut.TargetPath = "http://aierlannatashadijieshe.com"
$Shortcut.Save()

# 创建启动服务器快捷方式
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\StartIrishTravel.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\start_server_with_ngrok.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Start Irish Travel Website Server with ngrok"
$Shortcut.Save()

# 创建访问说明文件
$accessInfo = @"
网站访问说明：

1. 局域网访问：
   - 确保手机和电脑连接到同一个WiFi网络
   - 在手机浏览器中输入电脑显示的IP地址
   - 如果无法访问，请检查：
     * 电脑防火墙是否允许80端口访问
     * 手机和电脑是否在同一网络
     * 路由器是否允许局域网设备互相访问

2. 外网访问（需要设置ngrok）：
   a. 下载并安装ngrok：
      - 访问 https://ngrok.com/download
      - 下载Windows版本并解压到网站目录
   
   b. 注册ngrok账号：
      - 访问 https://dashboard.ngrok.com/signup
      - 注册一个免费账号
   
   c. 获取authtoken：
      - 登录ngrok账号
      - 在dashboard中找到您的authtoken
      - 将authtoken替换到ngrok.yml文件中
   
   d. 启动服务器：
      - 双击"StartIrishTravel.lnk"
      - ngrok会显示一个公网地址
      - 使用这个地址可以在任何网络访问网站

注意：免费版ngrok每次启动会生成不同的地址，需要重新获取。
"@

$accessInfo | Out-File -FilePath "$env:USERPROFILE\Desktop\网站访问说明.txt" -Encoding UTF8

Write-Host "Shortcuts created successfully!" 