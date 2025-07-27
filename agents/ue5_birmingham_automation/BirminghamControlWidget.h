// UE5 Birmingham Control Widget Header
// Generated: 2025-07-27T00:12:25.753094


// Blueprint Widget: WBP_BirminghamControl
// Class: UBirminghamControlWidget : public UUserWidget

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "Components/Button.h"
#include "Components/TextBlock.h"
#include "Components/ProgressBar.h"
#include "BirminghamControlWidget.generated.h"

UCLASS()
class STORMCOMMAND_API UBirminghamControlWidget : public UUserWidget
{
    GENERATED_BODY()

protected:
    virtual void NativeConstruct() override;

    // UI Components (bind in UMG Designer)
    UPROPERTY(meta = (BindWidget))
    class UButton* AutoNavigateButton;
    
    UPROPERTY(meta = (BindWidget))
    class UButton* ResetViewButton;
    
    UPROPERTY(meta = (BindWidget))
    class UTextBlock* StatusText;
    
    UPROPERTY(meta = (BindWidget))
    class UTextBlock* CoordinatesText;
    
    UPROPERTY(meta = (BindWidget))
    class UProgressBar* LoadingProgress;

    // Reference to Birmingham Navigator
    UPROPERTY(BlueprintReadWrite, Category = "References")
    class ABirminghamAutoNavigator* BirminghamNavigator;

public:
    UFUNCTION(BlueprintCallable)
    void InitializeBirminghamControl();
    
    UFUNCTION()
    void OnAutoNavigateClicked();
    
    UFUNCTION()
    void OnResetViewClicked();
    
    UFUNCTION(BlueprintCallable)
    void UpdateStatus(const FString& NewStatus);
    
    UFUNCTION(BlueprintCallable)
    void UpdateCoordinates();
    
    UFUNCTION(BlueprintCallable)
    void ShowLoadingProgress(float Progress);
};

// Implementation
void UBirminghamControlWidget::NativeConstruct()
{
    Super::NativeConstruct();
    
    // Bind button events
    if (AutoNavigateButton)
    {
        AutoNavigateButton->OnClicked.AddDynamic(this, &UBirminghamControlWidget::OnAutoNavigateClicked);
    }
    
    if (ResetViewButton)
    {
        ResetViewButton->OnClicked.AddDynamic(this, &UBirminghamControlWidget::OnResetViewClicked);
    }
    
    // Initialize with Birmingham coordinates
    UpdateCoordinates();
    UpdateStatus(TEXT("Ready for Birmingham Navigation"));
}

void UBirminghamControlWidget::InitializeBirminghamControl()
{
    // Find Birmingham Navigator in the world
    UWorld* World = GetWorld();
    if (World)
    {
        BirminghamNavigator = World->GetFirstActorByClass<ABirminghamAutoNavigator>();
        
        if (!BirminghamNavigator)
        {
            // Create navigator if it doesn't exist
            BirminghamNavigator = World->SpawnActor<ABirminghamAutoNavigator>();
        }
    }
}

void UBirminghamControlWidget::OnAutoNavigateClicked()
{
    if (BirminghamNavigator)
    {
        UpdateStatus(TEXT("🚀 Navigating to Birmingham..."));
        ShowLoadingProgress(0.1f);
        
        // Execute automatic navigation
        BirminghamNavigator->AutoNavigateToBirmingham();
        
        // Update UI after navigation
        FTimerHandle TimerHandle;
        GetWorld()->GetTimerManager().SetTimer(TimerHandle, [this]()
        {
            UpdateStatus(TEXT("✅ Birmingham Navigation Complete"));
            ShowLoadingProgress(1.0f);
        }, 3.0f, false);
    }
    else
    {
        UpdateStatus(TEXT("❌ Birmingham Navigator not found"));
    }
}

void UBirminghamControlWidget::OnResetViewClicked()
{
    if (BirminghamNavigator)
    {
        UpdateStatus(TEXT("🔄 Resetting view..."));
        BirminghamNavigator->ConfigureOptimalCamera();
        UpdateStatus(TEXT("✅ View reset to optimal position"));
    }
}

void UBirminghamControlWidget::UpdateStatus(const FString& NewStatus)
{
    if (StatusText)
    {
        StatusText->SetText(FText::FromString(NewStatus));
    }
}

void UBirminghamControlWidget::UpdateCoordinates()
{
    if (CoordinatesText)
    {
        FString CoordString = FString::Printf(TEXT("📍 Birmingham, AL: %.4f°N, %.4f°W"), 
                                            33.5186, 
                                            -86.8104);
        CoordinatesText->SetText(FText::FromString(CoordString));
    }
}

void UBirminghamControlWidget::ShowLoadingProgress(float Progress)
{
    if (LoadingProgress)
    {
        LoadingProgress->SetPercent(Progress);
        LoadingProgress->SetVisibility(Progress >= 1.0f ? ESlateVisibility::Hidden : ESlateVisibility::Visible);
    }
}
