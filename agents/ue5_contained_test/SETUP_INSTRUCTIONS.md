# UE5 CONTAINED TEST SETUP INSTRUCTIONS

## GOAL
Eliminate manual clicking in UE5 with one-button automation

## WHAT THIS DOES
- Sets Birmingham coordinates (33.5186, -86.8104)
- Configures optimal camera view
- Applies storm lighting
- Spawns test asset
- ALL WITH ONE CLICK

## SETUP STEPS

### 1. Create Blueprint in UE5
1. Open UE5 Storm_Command_Bham project
2. Create new Blueprint Class > Actor > name: BP_BirminghamQuickTest
3. Copy code from BirminghamQuickTest.h into C++ class
4. Compile project

### 2. Add to Toolbar (EASIEST METHOD)
1. In UE5, go to Edit > Editor Preferences
2. Search "Quick Actions"
3. Add new action: "Birmingham Quick Setup"
4. Set command: BP_BirminghamQuickTest.OneClickBirminghamSetup
5. Now you have toolbar button for one-click automation

### 3. Test Execution
1. Click toolbar button OR
2. Place BP_BirminghamQuickTest in level and call OneClickBirminghamSetup() OR
3. Use console commands from quick_test_console_commands.txt

### 4. HTML Integration (Optional)
- Add code from html_integration_code.html to your birmingham_storm_live_interface.html
- Enables web-based triggering of automation

## SUCCESS CRITERIA
✅ No more hunting for UI buttons
✅ Birmingham coordinates set instantly  
✅ Camera positioned optimally
✅ Storm lighting applied
✅ Test asset spawned at correct location

## TROUBLESHOOTING
- If Blueprint doesn't compile: Check UE5 has Cesium plugin enabled
- If commands don't work: Enable UE5 Remote Control Web API
- If camera doesn't move: Check Player Controller is valid

This is your proof-of-concept for eliminating UE5 clicking bottlenecks.
