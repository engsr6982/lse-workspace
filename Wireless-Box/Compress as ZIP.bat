@echo off
:: 设置UTF-8编码
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 设置7zip的路径
set SEVENZIP_PATH="C:\Program Files\7-Zip\7z.exe"
echo 设置7zip路径: %SEVENZIP_PATH%
echo. 

:: 获取当前文件夹名称
set "current_dir=%cd%\"
for %%A in ("%current_dir%.") do set "folder_name=%%~nxA"

:: 打包文件名
set FILE_NAME=%folder_name%.zip
echo 设置输出包名: %FILE_NAME%
echo. 

:: 打包文件列表，注意需要保留原有的目录结构
set FILE_LIST=README.md WirelessBox.js PPOUI\WirelessBox\lib\*

echo. 
echo 执行打包命令.....

:: 执行打包命令
%SEVENZIP_PATH% a -tzip %FILE_NAME% %FILE_LIST%
echo.
echo "[SUCCES] Package $FILE_NAME completed"
echo.
pause