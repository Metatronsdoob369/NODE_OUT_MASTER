// UE5 Birmingham Quick Test Blueprint
// Generated: 2025-07-27T01:23:42.122747
// PURPOSE: One-click automation to eliminate manual clicking


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
{
    GENERATED_BODY()

public:
    ABirminghamQuickTest();

protected:
    virtual void BeginPlay() override;

    // Birmingham coordinates - FIXED VALUES
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham")
    double BirminghamLat = 33.5186;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham")
    double BirminghamLon = -86.8104;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham")
    double BirminghamHeight = 500;

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
};

// Implementation
ABirminghamQuickTest::ABirminghamQuickTest()
{
    PrimaryActorTick.bCanEverTick = false;
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("RootComponent"));
}

void ABirminghamQuickTest::BeginPlay()
{
    Super::BeginPlay();
    // Optional: Auto-execute on play
    // OneClickBirminghamSetup();
}

void ABirminghamQuickTest::OneClickBirminghamSetup()
{
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
    {
        GEngine->AddOnScreenDebugMessage(
            -1, 10.0f, FColor::Green,
            TEXT("🌪️ BIRMINGHAM AUTOMATION: SUCCESS")
        );
    }
}

void ABirminghamQuickTest::SetBirminghamCoordinates()
{
    // Find existing Cesium Georeference or create one
    ACesiumGeoreference* Georeference = nullptr;
    
    // Look for existing georeference first
    for (TActorIterator<ACesiumGeoreference> ActorItr(GetWorld()); ActorItr; ++ActorItr)
    {
        Georeference = *ActorItr;
        break;
    }
    
    // Create if doesn't exist
    if (!Georeference)
    {
        Georeference = GetWorld()->SpawnActor<ACesiumGeoreference>();
        LogStep(TEXT("Created Cesium Georeference"), true);
    }
    
    if (Georeference)
    {
        // Set Birmingham as origin
        Georeference->SetOriginLatLongHeight(BirminghamLat, BirminghamLon, BirminghamHeight);
        LogStep(TEXT("Set Birmingham Coordinates"), true);
    }
    else
    {
        LogStep(TEXT("Failed to setup Georeference"), false);
    }
}

void ABirminghamQuickTest::ConfigureOptimalView()
{
    // Get player controller
    APlayerController* PC = GetWorld()->GetFirstPlayerController();
    if (!PC) 
    {
        LogStep(TEXT("No Player Controller found"), false);
        return;
    }
    
    APawn* PlayerPawn = PC->GetPawn();
    if (!PlayerPawn)
    {
        LogStep(TEXT("No Player Pawn found"), false);
        return;
    }
    
    // Set optimal camera position for Birmingham overview
    FVector OptimalLocation = FVector(0, 0, 50000); // 500m above Birmingham
    FRotator OptimalRotation = FRotator(-30.0f, 0.0f, 0.0f); // Look down at 30 degrees
    
    PlayerPawn->SetActorLocation(OptimalLocation);
    PC->SetControlRotation(OptimalRotation);
    
    LogStep(TEXT("Configured Optimal Camera View"), true);
}

void ABirminghamQuickTest::ApplyStormLighting()
{
    // Find or create Cesium Sun Sky
    ACesiumSunSky* SunSky = nullptr;
    
    for (TActorIterator<ACesiumSunSky> ActorItr(GetWorld()); ActorItr; ++ActorItr)
    {
        SunSky = *ActorItr;
        break;
    }
    
    if (!SunSky)
    {
        SunSky = GetWorld()->SpawnActor<ACesiumSunSky>();
        LogStep(TEXT("Created Cesium Sun Sky"), true);
    }
    
    if (SunSky)
    {
        // Configure for storm visualization
        SunSky->SetTimeOfDay(14.0f); // 2 PM
        SunSky->SetCloudOpacity(0.6f); // Some clouds for dramatic effect
        SunSky->SetLatitude(BirminghamLat);
        SunSky->SetLongitude(BirminghamLon);
        
        LogStep(TEXT("Applied Storm Lighting"), true);
    }
    else
    {
        LogStep(TEXT("Failed to setup Storm Lighting"), false);
    }
}

void ABirminghamQuickTest::SpawnSingleTestAsset()
{
    // Spawn a simple test cube at Birmingham center as proof of concept
    UWorld* World = GetWorld();
    if (!World)
    {
        LogStep(TEXT("No World reference"), false);
        return;
    }
    
    // Spawn a basic static mesh actor as test
    AStaticMeshActor* TestActor = World->SpawnActor<AStaticMeshActor>();
    if (TestActor)
    {
        // Position at Birmingham coordinates (world space)
        TestActor->SetActorLocation(FVector(0, 0, 1000)); // 10m above ground
        TestActor->SetActorScale3D(FVector(5.0f, 5.0f, 5.0f)); // Make it visible
        
        // Optional: Set a basic cube mesh if available
        UStaticMeshComponent* MeshComp = TestActor->GetStaticMeshComponent();
        if (MeshComp)
        {
            // Try to load basic cube mesh
            UStaticMesh* CubeMesh = LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Cube"));
            if (CubeMesh)
            {
                MeshComp->SetStaticMesh(CubeMesh);
            }
        }
        
        LogStep(TEXT("Spawned Test Asset at Birmingham"), true);
    }
    else
    {
        LogStep(TEXT("Failed to spawn test asset"), false);
    }
}

void ABirminghamQuickTest::LogStep(const FString& StepName, bool bSuccess)
{
    if (bSuccess)
    {
        UE_LOG(LogTemp, Warning, TEXT("✅ %s"), *StepName);
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("❌ %s"), *StepName);
    }
}
