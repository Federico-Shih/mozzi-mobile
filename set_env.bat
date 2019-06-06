@echo off
setlocal 
  set ENVVAR=ANDROID_HOME && C:\Android\Sdk
  SETX ANDROID_HOME "C:\Android\Sdk"
  Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
  pause
  set PATH = %PATH%;C:\Android\Sdk\platform-tools
  setx "%PATH%;C:\Android\Sdk\platform-tools"
  set PATH = %PATH%;C:\Users\%username%\AppData\Roaming\npm
  setx "%PATH%;C:\Users\%username%\AppData\Roaming\npm"
endlocal
