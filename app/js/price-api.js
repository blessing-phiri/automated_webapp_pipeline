// Agricultural Price API Integration for Zimbabwe
document.addEventListener('DOMContentLoaded', function() {
    const tickerContent = document.getElementById('priceData');
    
    // Function to fetch real-time prices from Zim Agric API
    async function fetchAgriculturalPrices() {
        try {
            // This would be the actual API endpoint for Zim Agric prices
            // const response = await fetch('https://api.zimagric.gov.zw/prices');
            // const data = await response.json();
            
            // Mock data - replace with actual API call
            const mockPrices = [
                { commodity: "Maize", price: "ZWL 250,000 per tonne", variation: "+2%" },
                { commodity: "Wheat", price: "ZWL 300,000 per tonne", variation: "-1.5%" },
                { commodity: "Soybeans", price: "ZWL 180,000 per tonne", variation: "+0.5%" },
                { commodity: "Sugar Beans", price: "ZWL 220,000 per tonne", variation: "+3.2%" },
                { commodity: "Groundnuts", price: "ZWL 150,000 per tonne", variation: "-0.8%" },
                { commodity: "Sunflower", price: "ZWL 120,000 per tonne", variation: "+1.1%" },
                { commodity: "Cotton", price: "ZWL 95,000 per tonne", variation: "-2.3%" },
                { commodity: "Tobacco", price: "ZWL 450,000 per kg", variation: "+5.7%" }
            ];
            
            // Format the prices for the ticker
            let tickerHTML = '';
            mockPrices.forEach(item => {
                const variationClass = item.variation.startsWith('+') ? 'positive' : 'negative';
                tickerHTML += `
                    <span class="price-item">
                        <strong>${item.commodity}:</strong> ${item.price} 
                        <span class="variation ${variationClass}">${item.variation}</span>
                    </span>
                    <span class="ticker-separator">•</span>
                `;
            });
            
            // Duplicate content for seamless looping
            tickerHTML += tickerHTML;
            tickerContent.innerHTML = tickerHTML;
            
            // Calculate animation duration based on content length
            const priceItems = document.querySelectorAll('.price-item');
            const duration = priceItems.length * 5; // 5 seconds per item
            
            // Apply animation
            tickerContent.style.animationDuration = `${duration}s`;
            
            // If using real API, you might want to refresh periodically
            // setInterval(fetchAgriculturalPrices, 3600000); // Refresh every hour
            
        } catch (error) {
            console.error('Error fetching agricultural prices:', error);
            tickerContent.innerHTML = 'Agricultural price data currently unavailable. Please check back later.';
        }
    }
    
    // Initial fetch
    fetchAgriculturalPrices();
    
    // Add styles for price variations
    const style = document.createElement('style');
    style.textContent = `
        .price-item {
            display: inline-flex;
            align-items: center;
            margin-right: 20px;
            white-space: nowrap;
        }
        .variation {
            margin-left: 8px;
            font-size: 0.9em;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .positive {
            color: #4CAF50;
            background-color: rgba(76, 175, 80, 0.1);
        }
        .negative {
            color: #F44336;
            background-color: rgba(244, 67, 54, 0.1);
        }
        .ticker-separator {
            margin: 0 15px;
            color: rgba(255, 255, 255, 0.5);
        }
        @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
    `;
    document.head.appendChild(style);
});