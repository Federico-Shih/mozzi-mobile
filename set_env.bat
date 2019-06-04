@echo off
setlocal 
  set ENVVAR=ANDROID_HOME && C:\Users\%username%\AppData\Local\Android\Sdk
  SETX /M ANDROID_HOME "C:\Users\%username%\AppData\Local\Android\Sdk"
  set PATH = %path%; C:\Users\%username%\AppData\Local\Android\Sdk\platform-tools
  SETX /M PATH "%path%; C:\Users\%username%\AppData\Local\Android\Sdk\platform-tools"
  set PATH = %path%; C:\\Users\%username%\\AppData\\Roaming\\npm
  SETX /M PATH "%path%; C:\\Users\\%username%\\AppData\\Roaming\\npm"
endlocal
