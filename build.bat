@echo off

set PathOutput=%~dp0build\PicView.air
set PathAppXML=%~dp0application.xml
set PathSrc=%~dp0src\.
set PathCert=%~dp0cert.p12
set CertPassword=picviewpass


echo Building...

::cd "%~dp0src"

adt.bat -package -storetype pkcs12 -keystore %PathCert% -storepass %CertPassword% %PathOutput% %PathAppXML% %PathSrc%

::cd "%~dp0"