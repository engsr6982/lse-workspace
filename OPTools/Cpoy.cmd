@echo off
::插件名称
SET PLUGIN_NAME=OPTools

::目标GitHub仓库文件夹名称
SET PLUGIN_FILE_NAME=OPTools

::源服务端路径
SET Y=C:\Server\Beta
::目标Github仓库路径
SET M=C:\Users\Administrator\Repo\LLSE_Plugins\%PLUGIN_FILE_NAME%




::删除旧文件
rmdir /s/q %M%\PPOUI\%PLUGIN_NAME%
::执行文件复制
::copy %Y%\plugins\%PLUGIN_NAME%.js %M%
Xcopy %Y%\plugins\PPOUI\%PLUGIN_NAME% %M%\PPOUI\%PLUGIN_NAME% /E/H/C/I
::pause