@ECHO off
@setlocal EnableDelayedExpansion

@set LF=^


@SET command=#
@FOR /F "tokens=*" %%i in ('findstr -bv @ "%~f0"') DO SET command=!command!!LF!%%i
@powershell -command !command! & goto:eof


# *** POWERSHELL CODE STARTS HERE *** #
if (Get-Command choco) {
    Start-Process powershell -Verb RunAs -windowstyle hidden -ArgumentList '-command','choco install -y git'
    echo 'Installed git.'
} else {
    Start-Process powershell -Verb RunAs -windowstyle hidden -ArgumentList '-command','Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://community.chocolatey.org/install.ps1''))'
    sleep 10
    pause
    echo 'Please reboot your computer and run this again to complete the install.'
    exit 1
}

$uri = 'https://github.com/obsidianmd/obsidian-releases/releases/download/v0.12.15/Obsidian.0.12.15.exe'

Invoke-WebRequest -Uri $uri -OutFile obsidian-setup.exe

./obsidian-setup.exe

while (^!(Test-Path -path 'C:\Program Files\Git\bin\bash.exe'))
{
    echo 'Waiting for Git...'
    sleep 1
}

sleep 2

& 'C:\Program Files\Git\bin\bash' -c @'
read -p 'Enter your full name: ' name
read -p 'Enter your email (private or school): ' email

git config --global user.name \"$name\"
git config --global user.email \"$email\"

echo 'Please press the "Sign in with your browser" button.'

mkdir -p ~/Desktop/obsidian
git clone https://github.com/EntangledStrings/obsidian-school.git ~/Desktop/obsidian/school 

echo 'Waiting for installers.'

sleep 10
rm -f obsidian-setup.exe
echo 'Done!'
'@
