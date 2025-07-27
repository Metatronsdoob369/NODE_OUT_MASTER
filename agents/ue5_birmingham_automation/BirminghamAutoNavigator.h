// UE5 Birmingham Auto-Navigator Header
// Generated: 2025-07-27T00:12:25.752669


// Blueprint: BP_BirminghamAutoNavigator
// Class: ABirminghamAutoNavigator : public AActor

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CesiumGeoreference.h"
#include "Cesium3DTileset.h"
#include "CesiumRasterOverlay.h"
#include "CesiumSunSky.h"
#include "CesiumCameraManager.h"
#include "Engine/Engine.h"
#include "BirminghamAutoNavigator.generated.h"

UCLASS(BlueprintType, Blueprintable)
class STORMCOMMAND_API ABirminghamAutoNavigator : public AActor
{
    GENERATED_BODY()

public:
    ABirminghamAutoNavigator();

protected:
    virtual void BeginPlay() override;

    // Birmingham coordinates
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham Config")
    double BirminghamLatitude = 33.5186;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham Config")
    double BirminghamLongitude = -86.8104;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Birmingham Config")
    double BirminghamHeight = 500;

    // Cesium components
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Cesium")
    class ACesiumGeoreference* Georeference;
    
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Cesium")
    class ACesium3DTileset* WorldTerrain;
    
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Cesium")
    class ACesiumSunSky* SunSky;

public:
    // Main automation function - call this for instant Birmingham setup
    UFUNCTION(BlueprintCallable, CallInEditor = true, Category = "Birmingham Automation")
    void AutoNavigateToBirmingham();
    
    UFUNCTION(BlueprintCallable, Category = "Birmingham Automation")
    void SetupCesiumGeoreference();
    
    UFUNCTION(BlueprintCallable, Category = "Birmingham Automation")
    void LoadPhotorealisticTiles();
    
    UFUNCTION(BlueprintCallable, Category = "Birmingham Automation")
    void ConfigureOptimalCamera();
    
    UFUNCTION(BlueprintCallable, Category = "Birmingham Automation")
    void SetupStormLighting();
    
    UFUNCTION(BlueprintCallable, Category = "Birmingham Automation")
    void ValidateSetup();

private:
    void LogSetupProgress(const FString& StepName, bool bSuccess);
};

// Implementation (.cpp file)
ABirminghamAutoNavigator::ABirminghamAutoNavigator()
{
    PrimaryActorTick.bCanEverTick = false;
    
    // Create default components
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("RootComponent"));
}

void ABirminghamAutoNavigator::BeginPlay()
{
    Super::BeginPlay();
    
    // Auto-execute Birmingham setup on game start
    AutoNavigateToBirmingham();
}

void ABirminghamAutoNavigator::AutoNavigateToBirmingham()
{
    UE_LOG(LogTemp, Warning, TEXT("🚀 STARTING AUTOMATIC BIRMINGHAM NAVIGATION"));
    UE_LOG(LogTemp, Warning, TEXT("📍 Target: %f, %f"), BirminghamLatitude, BirminghamLongitude);
    
    // Step 1: Setup Cesium Georeference
    SetupCesiumGeoreference();
    
    // Step 2: Load photorealistic tiles
    LoadPhotorealisticTiles();
    
    // Step 3: Configure camera for optimal viewing
    ConfigureOptimalCamera();
    
    // Step 4: Setup storm lighting
    SetupStormLighting();
    
    // Step 5: Validate complete setup
    ValidateSetup();
    
    UE_LOG(LogTemp, Warning, TEXT("✅ BIRMINGHAM AUTO-NAVIGATION COMPLETE"));
}

void ABirminghamAutoNavigator::SetupCesiumGeoreference()
{
    // Find or create Cesium Georeference
    Georeference = FindFirstObjectByClass<ACesiumGeoreference>(GetWorld());
    if (!Georeference)
    {
        Georeference = GetWorld()->SpawnActor<ACesiumGeoreference>();
        LogSetupProgress(TEXT("Created Cesium Georeference"), true);
    }
    
    // Set Birmingham as origin
    Georeference->SetOriginLatLongHeight(
        BirminghamLatitude,
        BirminghamLongitude, 
        BirminghamHeight
    );
    
    // Configure for high precision
    Georeference->SetShowLoadRadii(false);
    Georeference->SetUsePrecisionCorrection(true);
    
    LogSetupProgress(TEXT("Configured Birmingham Georeference"), true);
}

void ABirminghamAutoNavigator::LoadPhotorealisticTiles()
{
    // Create Cesium World Terrain tileset
    WorldTerrain = GetWorld()->SpawnActor<ACesium3DTileset>();
    
    if (WorldTerrain)
    {
        // Set to Cesium World Terrain
        WorldTerrain->SetUrl(TEXT("https://assets.cesium.com/1"));
        WorldTerrain->SetIonAccessToken(TEXT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWZlMjM4My1hNDEyLTQ3M2EtYTM0Yi03NGM5NTYyZjAwOTgiLCJpZCI6MzI1NjM3LCJpYXQiOjE3NTM1ODk3ODl9.VO1wNwH11krpTP0oXUCE57-9yUiqOGvoD2xNysDbfLs"));
        
        // Optimize for Birmingham area
        WorldTerrain->SetMaximumScreenSpaceError(16.0f);
        WorldTerrain->SetPreloadAncestors(true);
        WorldTerrain->SetPreloadSiblings(true);
        WorldTerrain->SetForbidHoles(true);
        
        // Set georeference
        WorldTerrain->SetGeoreference(Georeference);
        
        // Add high-resolution imagery overlay
        UCesiumIonRasterOverlay* ImageryOverlay = NewObject<UCesiumIonRasterOverlay>();
        ImageryOverlay->IonAssetID = 2; // Bing Maps Aerial
        ImageryOverlay->IonAccessToken = TEXT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWZlMjM4My1hNDEyLTQ3M2EtYTM0Yi03NGM5NTYyZjAwOTgiLCJpZCI6MzI1NjM3LCJpYXQiOjE3NTM1ODk3ODl9.VO1wNwH11krpTP0oXUCE57-9yUiqOGvoD2xNysDbfLs");
        WorldTerrain->GetRasterOverlayCollection().Add(ImageryOverlay);
        
        LogSetupProgress(TEXT("Loaded Photorealistic Tiles"), true);
    }
    else
    {
        LogSetupProgress(TEXT("Failed to create World Terrain"), false);
    }
}

void ABirminghamAutoNavigator::ConfigureOptimalCamera()
{
    // Get player controller and camera
    APlayerController* PC = GetWorld()->GetFirstPlayerController();
    if (!PC) return;
    
    APawn* PlayerPawn = PC->GetPawn();
    if (!PlayerPawn) return;
    
    // Calculate optimal camera position (1km above Birmingham)
    FVector CameraLocation = FVector(0, 0, 100000); // 1km up in cm
    FRotator CameraRotation = FRotator(-45.0f, 0.0f, 0.0f); // Look down at 45 degrees
    
    // Set camera position and rotation
    PlayerPawn->SetActorLocation(CameraLocation);
    PC->SetControlRotation(CameraRotation);
    
    // Configure camera for better visualization
    if (UCameraComponent* CameraComp = PlayerPawn->FindComponentByClass<UCameraComponent>())
    {
        CameraComp->SetFieldOfView(90.0f); // Wide field of view for overview
    }
    
    LogSetupProgress(TEXT("Configured Optimal Camera"), true);
}

void ABirminghamAutoNavigator::SetupStormLighting()
{
    // Find or create Cesium Sun Sky
    SunSky = FindFirstObjectByClass<ACesiumSunSky>(GetWorld());
    if (!SunSky)
    {
        SunSky = GetWorld()->SpawnActor<ACesiumSunSky>();
        LogSetupProgress(TEXT("Created Cesium Sun Sky"), true);
    }
    
    if (SunSky)
    {
        // Configure for storm visualization
        SunSky->SetTimeOfDay(14.0f); // 2 PM - good for storm visibility
        SunSky->SetCloudOpacity(0.7f); // Heavy cloud cover
        SunSky->SetSolarTime(true);
        SunSky->SetLatitude(BirminghamLatitude);
        SunSky->SetLongitude(BirminghamLongitude);
        
        // Set dramatic storm lighting
        SunSky->SetSunLuminance(3.0f);
        SunSky->SetSkyLuminance(0.5f);
        
        LogSetupProgress(TEXT("Configured Storm Lighting"), true);
    }
}

void ABirminghamAutoNavigator::ValidateSetup()
{
    bool bSetupValid = true;
    
    // Validate georeference
    if (!Georeference)
    {
        UE_LOG(LogTemp, Error, TEXT("❌ Georeference validation failed"));
        bSetupValid = false;
    }
    
    // Validate terrain
    if (!WorldTerrain)
    {
        UE_LOG(LogTemp, Error, TEXT("❌ World Terrain validation failed"));
        bSetupValid = false;
    }
    
    // Validate sun sky
    if (!SunSky)
    {
        UE_LOG(LogTemp, Error, TEXT("❌ Sun Sky validation failed"));
        bSetupValid = false;
    }
    
    if (bSetupValid)
    {
        UE_LOG(LogTemp, Warning, TEXT("✅ ALL SYSTEMS VALIDATED - BIRMINGHAM READY"));
        
        // Optional: Display success message in viewport
        if (GEngine)
        {
            GEngine->AddOnScreenDebugMessage(
                -1, 10.0f, FColor::Green,
                TEXT("🌪️ BIRMINGHAM STORM VISUALIZATION: READY")
            );
        }
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("❌ SETUP VALIDATION FAILED"));
        
        if (GEngine)
        {
            GEngine->AddOnScreenDebugMessage(
                -1, 15.0f, FColor::Red,
                TEXT("❌ Birmingham Setup Failed - Check Output Log")
            );
        }
    }
}

void ABirminghamAutoNavigator::LogSetupProgress(const FString& StepName, bool bSuccess)
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
