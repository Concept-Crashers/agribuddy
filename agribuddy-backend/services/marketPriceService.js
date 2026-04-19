const axios = require('axios');
const MarketPrice = require('../models/MarketPrice');

/**
 * Market Price Aggregator Service
 * Primarily draws from HDX/WFP for Uganda and regional trade sources.
 */
class MarketPriceService {
    /**
     * Fetch latest prices from sources and update database
     */
    async syncAllPrices() {
        console.log('Starting market price synchronization...');
        const sources = [
            this.fetchHDXPrices(),
            this.fetchRATINPrices(),
            this.fetchAMISPrices()
        ];

        try {
            const results = await Promise.allSettled(sources);
            const pricesToSave = results
                .filter(r => r.status === 'fulfilled')
                .flatMap(r => r.value);

            if (pricesToSave.length > 0) {
                // Clear old recent prices or just upsert?
                // For simplicity, we'll keep historical data by not clearing, 
                // but only the latest per shop/commodity/source matters for current display.
                for (const priceData of pricesToSave) {
                    await MarketPrice.findOneAndUpdate(
                        { 
                            cropName: priceData.cropName, 
                            location: priceData.location, 
                            source: priceData.source 
                        },
                        { ...priceData, dateUpdated: new Date() },
                        { upsert: true, new: true }
                    );
                }
                console.log(`Successfully synced ${pricesToSave.length} market prices.`);
            }
        } catch (error) {
            console.error('Error syncing market prices:', error);
        }
    }

    /**
     * WFP / HDX Price Data for Uganda
     * Fetches real-time CSV data from HDX
     */
    async fetchHDXPrices() {
        const url = "https://data.humdata.org/dataset/883929b1-521e-4834-97f5-0ccc2df75b89/resource/e082d683-cad5-4dcd-bf54-db76ae254d33/download/wfp_food_prices_uga.csv";
        
        try {
            console.log('Fetching real prices from WFP/HDX...');
            const response = await axios.get(url);
            const content = response.data;
            const lines = content.split('\n');
            
            // Map to store latest price for each commodity + market combination
            const latestData = {};
            // Map to store previous price for trend calculation
            const previousData = {};

            // Headers: date,admin1,admin2,market,market_id,latitude,longitude,category,commodity,commodity_id,unit,priceflag,pricetype,currency,price,usdprice
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length < 15) continue;

                const date = cols[0];
                const district = cols[1];
                const market = cols[3];
                const commodity = cols[8];
                const unit = cols[10];
                const price = parseFloat(cols[14]);

                const key = `${commodity}_${market}`;

                if (!latestData[key] || date > latestData[key].date) {
                    // Update latest data and move current latest to previousData for trend calculation
                    if (latestData[key]) {
                        previousData[key] = latestData[key];
                    }
                    latestData[key] = {
                        cropName: commodity,
                        price: price,
                        unit: unit,
                        location: market,
                        district: district,
                        source: 'WFP/HDX',
                        date: date
                    };
                } else if (!previousData[key] || (date < latestData[key].date && date > previousData[key].date)) {
                    // This row is newer than our current "previous" but older than our current "latest"
                    previousData[key] = { price: price, date: date };
                }
            }

            // Convert map to array and calculate trends
            return Object.keys(latestData).map(key => {
                const latest = latestData[key];
                const prev = previousData[key];
                let trend = 0;

                if (prev && prev.price > 0) {
                    trend = ((latest.price - prev.price) / prev.price) * 100;
                }

                return {
                    ...latest,
                    trend: parseFloat(trend.toFixed(2))
                };
            });

        } catch (error) {
            console.error('Error fetching/parsing WFP price data:', error);
            return [];
        }
    }

    /**
     * RATIN (East Africa Grain Council) Data Support
     */
    async fetchRATINPrices() {
        // Simulating regional grain trade data
        return [
            { cropName: 'Maize (Wholesale)', price: 1150, unit: 'kg', location: 'Busia Border', district: 'Busia', source: 'RATIN', trend: 1.5 },
            { cropName: 'Beans (Yellow)', price: 3800, unit: 'kg', location: 'Kampala', district: 'Kampala', source: 'RATIN', trend: 5.0 }
        ];
    }

    /**
     * AMIS (Global/Regional) Data Support
     */
    async fetchAMISPrices() {
        // Simulating global price index for major commodities
        return [
            { cropName: 'Coffee (Robusta)', price: 8500, unit: 'kg', location: 'Mbarara', district: 'Mbarara', source: 'AMIS', trend: -2.1 },
            { cropName: 'Soya Beans', price: 2800, unit: 'kg', location: 'Lira', district: 'Lira', source: 'AMIS', trend: 3.3 }
        ];
    }

    /**
     * Get latest prices from DB
     */
    async getLatestPrices(filters = {}) {
        return await MarketPrice.find(filters).sort({ dateUpdated: -1 }).limit(50);
    }
}

module.exports = new MarketPriceService();
