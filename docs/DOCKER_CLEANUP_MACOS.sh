#!/bin/bash
# Complete Docker Desktop Removal for macOS
# Run this to fully uninstall Docker Desktop

echo "🗑️  Removing Docker Desktop from macOS..."

# Quit Docker Desktop
osascript -e 'quit app "Docker"' 2>/dev/null

# Uninstall Docker Desktop
if [ -f /Applications/Docker.app/Contents/MacOS/Docker ]; then
    /Applications/Docker.app/Contents/MacOS/Docker --uninstall
fi

# Remove Docker.app
sudo rm -rf /Applications/Docker.app

# Remove Docker CLI tools
sudo rm -f /usr/local/bin/docker
sudo rm -f /usr/local/bin/docker-compose
sudo rm -f /usr/local/bin/docker-credential-desktop
sudo rm -f /usr/local/bin/docker-credential-ecr-login
sudo rm -f /usr/local/bin/docker-credential-osxkeychain
sudo rm -f /usr/local/bin/hub-tool
sudo rm -f /usr/local/bin/kubectl
sudo rm -f /usr/local/bin/vpnkit

# Remove Docker data and configs
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
rm -rf ~/Library/Preferences/com.docker.docker.plist
rm -rf ~/Library/Saved\ Application\ State/com.electron.docker-frontend.savedState
rm -rf ~/Library/Logs/Docker\ Desktop

# Remove Kernel Extensions (older versions)
sudo rm -rf /Library/PrivilegedHelperTools/com.docker.*
sudo rm -rf /Library/LaunchDaemons/com.docker.*
sudo pkgutil --forget com.docker.pkg 2>/dev/null

echo "✅ Docker Desktop fully removed!"
echo "⚠️  You may need to restart your Mac"
