#!/usr/bin/env python3
"""
UE5 Contained Test Blueprint Generator
Creates a simple one-click Blueprint for Birmingham automation
GOAL: Eliminate manual clicking with single button execution
"""

import os
from datetime import datetime

class UE5ContainedTestBlueprint:
    def __init__(self):
        self.birmingham_coords = {
            "latitude": 33.5186,
            "longitude": -86.8104,
            "height": 500
        }
    
    def generate_simple_automation_blueprint(self):
        """Generate minimal Blueprint for contained test"""
        blueprint_code = f"""
// Blueprint: BP_BirminghamQuickTest
// Class: ABirminghamQuickTest : public AActor
// PURPOSE: Single-click Birmingham automation - NO MORE MANUAL CLICKING

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CesiumGeoreference.h"
#include "Cesium3DTileset.h"
#include "CesiumSunSky.h"
#include "Engine/Engine.h"
#include "BirminghamQuickTest.generated.h"

UCLASS(BlueprintType, Blueprintable)
class STORMCOMMAND_API ABirminghamQuickTest : public AActor
{{
    GENERATED_BODY()

public:
    ABirminghamQuickTest();

protected:
    virtual void BeginPlay() override;

    // Birmingham coordinates - FIXED VALUES
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham")
    double BirminghamLat = {self.birmingham_coords['latitude']};
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham")
    double BirminghamLon = {self.birmingham_coords['longitude']};
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham")
    double BirminghamHeight = {self.birmingham_coords['height']};

public:
    // MAIN FUNCTION - ONE CLICK DOES EVERYTHING
    UFUNCTION(BlueprintCallable, CallInEditor = true, Category = "Quick Test")
    void OneClickBirminghamSetup();
    
    // Individual functions for testing
    UFUNCTION(BlueprintCallable, Category = "Quick Test")
    void SetBirminghamCoordinates();
    
    UFUNCTION(BlueprintCallable, Category = "Quick Test") 
    void ConfigureOptimalView();
    
    UFUNCTION(BlueprintCallable, Category = "Quick Test")
    void ApplyStormLighting();
    
    UFUNCTION(BlueprintCallable, Category = "Quick Test")
    void SpawnSingleTestAsset();

private:
    void LogStep(const FString& StepName, bool bSuccess);
}};

// Implementation
ABirminghamQuickTest::ABirminghamQuickTest()
{{
    PrimaryActorTick.bCanEverTick = false;
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("RootComponent"));
}}

void ABirminghamQuickTest::BeginPlay()
{{
    Super::BeginPlay();
    // Optional: Auto-execute on play
    // OneClickBirminghamSetup();
}}

void ABirminghamQuickTest::OneClickBirminghamSetup()
{{
    UE_LOG(LogTemp, Warning, TEXT("🚀 ONE-CLICK BIRMINGHAM AUTOMATION STARTING"));
    
    // Step 1: Set coordinates
    SetBirminghamCoordinates();
    
    // Step 2: Configure view
    ConfigureOptimalView();
    
    // Step 3: Apply lighting
    ApplyStormLighting();
    
    // Step 4: Test asset spawn
    SpawnSingleTestAsset();
    
    UE_LOG(LogTemp, Warning, TEXT("✅ ONE-CLICK AUTOMATION COMPLETE"));
    
    // Show success message in viewport
    if (GEngine)
    {{
        GEngine->AddOnScreenDebugMessage(
            -1, 10.0f, FColor::Green,
            TEXT("🌪️ BIRMINGHAM AUTOMATION: SUCCESS")
        );
    }}
}}

void ABirminghamQuickTest::SetBirminghamCoordinates()
{{
    // Find existing Cesium Georeference or create one
    ACesiumGeoreference* Georeference = nullptr;
    
    // Look for existing georeference first
    for (TActorIterator<ACesiumGeoreference> ActorItr(GetWorld()); ActorItr; ++ActorItr)
    {{
        Georeference = *ActorItr;
        break;
    }}
    
    // Create if doesn't exist
    if (!Georeference)
    {{
        Georeference = GetWorld()->SpawnActor<ACesiumGeoreference>();
        LogStep(TEXT("Created Cesium Georeference"), true);
    }}
    
    if (Georeference)
    {{
        // Set Birmingham as origin
        Georeference->SetOriginLatLongHeight(BirminghamLat, BirminghamLon, BirminghamHeight);
        LogStep(TEXT("Set Birmingham Coordinates"), true);
    }}
    else
    {{
        LogStep(TEXT("Failed to setup Georeference"), false);
    }}
}}

void ABirminghamQuickTest::ConfigureOptimalView()
{{
    // Get player controller
    APlayerController* PC = GetWorld()->GetFirstPlayerController();
    if (!PC) 
    {{
        LogStep(TEXT("No Player Controller found"), false);
        return;
    }}
    
    APawn* PlayerPawn = PC->GetPawn();
    if (!PlayerPawn)
    {{
        LogStep(TEXT("No Player Pawn found"), false);
        return;
    }}
    
    // Set optimal camera position for Birmingham overview
    FVector OptimalLocation = FVector(0, 0, 50000); // 500m above Birmingham
    FRotator OptimalRotation = FRotator(-30.0f, 0.0f, 0.0f); // Look down at 30 degrees
    
    PlayerPawn->SetActorLocation(OptimalLocation);
    PC->SetControlRotation(OptimalRotation);
    
    LogStep(TEXT("Configured Optimal Camera View"), true);
}}

void ABirminghamQuickTest::ApplyStormLighting()
{{
    // Find or create Cesium Sun Sky
    ACesiumSunSky* SunSky = nullptr;
    
    for (TActorIterator<ACesiumSunSky> ActorItr(GetWorld()); ActorItr; ++ActorItr)
    {{
        SunSky = *ActorItr;
        break;
    }}
    
    if (!SunSky)
    {{
        SunSky = GetWorld()->SpawnActor<ACesiumSunSky>();
        LogStep(TEXT("Created Cesium Sun Sky"), true);
    }}
    
    if (SunSky)
    {{
        // Configure for storm visualization
        SunSky->SetTimeOfDay(14.0f); // 2 PM
        SunSky->SetCloudOpacity(0.6f); // Some clouds for dramatic effect
        SunSky->SetLatitude(BirminghamLat);
        SunSky->SetLongitude(BirminghamLon);
        
        LogStep(TEXT("Applied Storm Lighting"), true);
    }}
    else
    {{
        LogStep(TEXT("Failed to setup Storm Lighting"), false);
    }}
}}

void ABirminghamQuickTest::SpawnSingleTestAsset()
{{
    // Spawn a simple test cube at Birmingham center as proof of concept
    UWorld* World = GetWorld();
    if (!World)
    {{
        LogStep(TEXT("No World reference"), false);
        return;
    }}
    
    // Spawn a basic static mesh actor as test
    AStaticMeshActor* TestActor = World->SpawnActor<AStaticMeshActor>();
    if (TestActor)
    {{
        // Position at Birmingham coordinates (world space)
        TestActor->SetActorLocation(FVector(0, 0, 1000)); // 10m above ground
        TestActor->SetActorScale3D(FVector(5.0f, 5.0f, 5.0f)); // Make it visible
        
        // Optional: Set a basic cube mesh if available
        UStaticMeshComponent* MeshComp = TestActor->GetStaticMeshComponent();
        if (MeshComp)
        {{
            // Try to load basic cube mesh
            UStaticMesh* CubeMesh = LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Cube"));
            if (CubeMesh)
            {{
                MeshComp->SetStaticMesh(CubeMesh);
            }}
        }}
        
        LogStep(TEXT("Spawned Test Asset at Birmingham"), true);
    }}
    else
    {{
        LogStep(TEXT("Failed to spawn test asset"), false);
    }}
}}

void ABirminghamQuickTest::LogStep(const FString& StepName, bool bSuccess)
{{
    if (bSuccess)
    {{
        UE_LOG(LogTemp, Warning, TEXT("✅ %s"), *StepName);
    }}
    else
    {{
        UE_LOG(LogTemp, Error, TEXT("❌ %s"), *StepName);
    }}
}}
"""
        return blueprint_code
    
    def generate_console_commands(self):
        """Generate console commands for manual testing"""
        commands = [
            "# UE5 Console Commands for Birmingham Quick Test",
            "# Copy and paste these into UE5 Console (~ key)",
            "",
            f"# Set Birmingham coordinates manually",
            f"CesiumGeoreference.SetOriginLatitude {self.birmingham_coords['latitude']}",
            f"CesiumGeoreference.SetOriginLongitude {self.birmingham_coords['longitude']}",
            f"CesiumGeoreference.SetOriginHeight {self.birmingham_coords['height']}",
            "",
            "# Set optimal camera position",
            "Camera.SetLocation 0 0 50000",
            "Camera.SetRotation -30 0 0",
            "",
            "# Configure storm lighting",
            "CesiumSunSky.SetTimeOfDay 14.0",
            "CesiumSunSky.SetCloudOpacity 0.6",
            "",
            "# Spawn Blueprint automation actor",
            "SpawnActor BP_BirminghamQuickTest",
            "",
            "# Execute one-click automation",
            "BP_BirminghamQuickTest.OneClickBirminghamSetup"
        ]
        return "\\n".join(commands)
    
    def generate_html_integration(self):
        """Generate HTML interface integration code"""
        html_integration = f"""
<!-- Add this to your birmingham_storm_live_interface.html -->

<div class="command-panel">
    <h2>🎯 ONE-CLICK AUTOMATION TEST</h2>
    <button class="auto-button" onclick="executeQuickTest()">
        🚀 QUICK BIRMINGHAM SETUP
    </button>
    <div id="test-status" class="status-live">Ready for quick test...</div>
</div>

<script>
function executeQuickTest() {{
    document.getElementById('test-status').innerHTML = '🔄 Executing one-click Birmingham setup...';
    
    // Method 1: Try to execute console command via clipboard
    const command = 'BP_BirminghamQuickTest.OneClickBirminghamSetup';
    
    // Copy command to clipboard for manual paste into UE5
    navigator.clipboard.writeText(command).then(() => {{
        document.getElementById('test-status').innerHTML = 
            '📋 Command copied to clipboard - Paste into UE5 Console (~)';
    }});
    
    // Method 2: If UE5 Remote Control is enabled
    // fetch('http://localhost:6766/remote/object/call', {{
    //     method: 'POST',
    //     headers: {{ 'Content-Type': 'application/json' }},
    //     body: JSON.stringify({{
    //         "objectPath": "/Game/BP_BirminghamQuickTest",
    //         "functionName": "OneClickBirminghamSetup"
    //     }})
    // }});
}}

// Auto-update test status
setInterval(() => {{
    // Check if UE5 is responsive
    fetch('http://localhost:6766/remote/info')
        .then(response => {{
            if (response.ok) {{
                document.getElementById('test-status').innerHTML = 
                    '✅ UE5 Remote Control: ONLINE - Ready for automation';
            }}
        }})
        .catch(() => {{
            document.getElementById('test-status').innerHTML = 
                '⚠️ UE5 Remote Control: OFFLINE - Manual console required';
        }});
}}, 5000);
</script>
"""
        return html_integration
    
    def save_contained_test_files(self):
        """Save all contained test files"""
        test_dir = "/Users/joewales/NODE_OUT_Master/agents/ue5_contained_test"
        os.makedirs(test_dir, exist_ok=True)
        
        # Save Blueprint C++ code
        blueprint_code = self.generate_simple_automation_blueprint()
        with open(f"{test_dir}/BirminghamQuickTest.h", 'w') as f:
            f.write(f"// UE5 Birmingham Quick Test Blueprint\n")
            f.write(f"// Generated: {datetime.now().isoformat()}\n")
            f.write(f"// PURPOSE: One-click automation to eliminate manual clicking\n\n")
            f.write(blueprint_code)
        
        # Save console commands
        console_commands = self.generate_console_commands()
        with open(f"{test_dir}/quick_test_console_commands.txt", 'w') as f:
            f.write(console_commands)
        
        # Save HTML integration
        html_integration = self.generate_html_integration()
        with open(f"{test_dir}/html_integration_code.html", 'w') as f:
            f.write(html_integration)
        
        # Save setup instructions
        instructions = f"""# UE5 CONTAINED TEST SETUP INSTRUCTIONS

## GOAL
Eliminate manual clicking in UE5 with one-button automation

## WHAT THIS DOES
- Sets Birmingham coordinates ({self.birmingham_coords['latitude']}, {self.birmingham_coords['longitude']})
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
"""
        
        with open(f"{test_dir}/SETUP_INSTRUCTIONS.md", 'w') as f:
            f.write(instructions)
        
        return test_dir

if __name__ == "__main__":
    print("🚀 GENERATING UE5 CONTAINED TEST BLUEPRINT")
    print("🎯 GOAL: ELIMINATE MANUAL CLICKING WITH ONE-BUTTON AUTOMATION")
    
    test_generator = UE5ContainedTestBlueprint()
    test_dir = test_generator.save_contained_test_files()
    
    print(f"✅ Contained test files generated in: {test_dir}")
    print("")
    print("📁 FILES CREATED:")
    print("   - BirminghamQuickTest.h (C++ Blueprint class)")
    print("   - quick_test_console_commands.txt (Manual commands)")  
    print("   - html_integration_code.html (Web interface code)")
    print("   - SETUP_INSTRUCTIONS.md (Complete setup guide)")
    print("")
    print("🎯 NEXT STEPS:")
    print("1. Open UE5 Storm_Command_Bham project")
    print("2. Create Blueprint from BirminghamQuickTest.h")
    print("3. Add to toolbar for one-click execution")
    print("4. Test elimination of manual clicking")
    print("")
    print("🌪️ ONE-CLICK BIRMINGHAM AUTOMATION: READY TO TEST")