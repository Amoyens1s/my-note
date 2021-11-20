代理一直被重置为http://127.0.0.1:86/，导致代理无法工作

解决方案：
修改注册表值 HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\CurrentVersion\Internet
Settings\ProxySettingsPerUser 。如果此值为 0，则修改为 1即可

原因未知，推测可能和kms有关