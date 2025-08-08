document.addEventListener('DOMContentLoaded', () => {
    const triggerTab = document.getElementById('magic-show-trigger');
    const controlPanel = document.getElementById('control-panel');
    const actIISection = document.getElementById('act-ii');
    const distortedTexts = document.querySelectorAll('.distorted-text');

    const rampUpSound = document.getElementById('ramp-up-sound');
    const mysteryLoop = document.getElementById('mystery-loop');

    const carouselImages = document.querySelectorAll('.carousel-image');
    let currentCarouselIndex = 0;
    let carouselInterval;

    const generatedAssetPreview = document.getElementById('generated-asset-preview');
    const generateButtons = document.querySelectorAll('.generate-btn');

    const loreTiles = document.querySelectorAll('.lore-tile'); // Get all lore tiles

    // Function to show a specific carousel image
    function showCarouselImage(index) {
        carouselImages.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }

    // Function to advance carousel (e.g., every 3 seconds)
    function startCarousel() {
        carouselInterval = setInterval(() => {
            currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
            showCarouselImage(currentCarouselIndex);
        }, 3000); // Change image every 3 seconds
    }

    // Initialize carousel to show the first image
    showCarouselImage(currentCarouselIndex);
    // Start automatic cycling (optional, can be triggered by activation or left static)
    startCarousel();


    // Make the trigger tab pulse initially
    triggerTab.classList.add('pulsing');

    triggerTab.addEventListener('click', () => {
        // Prevent multiple activations
        if (triggerTab.classList.contains('activated')) {
            return;
        }
        triggerTab.classList.add('activated');


        // 1. Play "ramp up" sound effect
        if (rampUpSound) {
            rampUpSound.play().catch(e => console.error("Error playing ramp up sound:", e));
        }

        // 2. Control panel slides in
        controlPanel.classList.add('active');

        // 3. Asset carousel (and other content) slides left
        actIISection.classList.add('active'); // This class controls content translation

        // 4. All distorted text snaps into clarity
        distortedTexts.forEach(textElement => {
            textElement.textContent = textElement.dataset.originalText; // Revert to original text
            textElement.classList.add('clear'); // Apply clear styling
        });

        // 5. A faint, mysterious musical loop begins
        if (mysteryLoop) {
            mysteryLoop.volume = 0.3; // Set initial volume
            mysteryLoop.play().catch(e => console.error("Error playing mystery loop:", e));
            // You might want to add a fade-in effect for the music
        }

        // Stop pulsing animation once activated
        triggerTab.classList.remove('pulsing');
        triggerTab.style.pointerEvents = 'none'; // Make it unclickable after activation
        triggerTab.textContent = 'ACTIVATED'; // Change text to indicate state
        triggerTab.style.transform = 'translateY(-50%) rotate(-90deg) scale(0.9)'; // A subtle change
        triggerTab.style.opacity = '0.8';

        // For mobile, remove rotation and adjust position if it was adjusted
        if (window.innerWidth <= 768) {
             triggerTab.style.transform = 'none';
        }
    });

    // Mini-Generator functionality
    // UPDATE THESE PATHS TO YOUR ACTUAL GENERATED ASSET IMAGES
    const assetMap = {
        'asset-a': 'images/generator-orb.jpg',
        'asset-b': 'images/generated-gear.png',
        'asset-c': 'images/asset1.jpg',
        'asset-d': 'images/generated-gear.png',
        'asset-e': 'images/generator-orb.jpg'
    };

    // Set an initial image for the generated asset preview
    if (generatedAssetPreview && assetMap['asset-a']) {
        generatedAssetPreview.src = assetMap['asset-a'];
        generatedAssetPreview.alt = 'Initial Generated Orb Preview';
    }

    generateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const assetType = button.dataset.asset;
            generatedAssetPreview.src = assetMap[assetType];
            generatedAssetPreview.alt = `Generated ${assetType}`;
            console.log(`Generating asset: ${assetType}`);
        });
    });

    // Intersection Observer for Lore Tiles (for "animated, glowing tiles that lay down like cards as the user scrolls")
    const observerOptions = {
        root: null, // viewport as the root
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const tileObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If tile is visible, change its status to "visible"
                entry.target.dataset.status = 'visible';
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    // Observe each lore tile
    loreTiles.forEach(tile => {
        tileObserver.observe(tile);
    });

});