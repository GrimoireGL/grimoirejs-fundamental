npm run semantic-release
if [ "$?" = "0" ]; then
  curl https://preset-updater.herokuapp.com/?repo=preset-basic&repoURL=https://github.com/GrimoireGL/grimoirejs-preset-basic.git&buildNumber=$CIRCLE_BUILD_NUM&currentPkg=grimoirejs-fundamental
fi
exit 0
