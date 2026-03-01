import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

const MarketPrices = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header
                onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
                sidebarExpanded={sidebarExpanded}
                userRole="farmer"
            />
            <Sidebar
                isExpanded={sidebarExpanded}
                onToggle={() => setSidebarExpanded(!sidebarExpanded)}
                userRole="farmer"
            />
            <main className={`transition-all duration-300 pt-16 ${sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'}`}>
                <div className="p-4 sm:p-6 lg:p-8 max-w-8xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Market Prices</h1>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 border border-border rounded-lg bg-card shadow-sm text-sm font-medium">Last 30 Days</button>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm text-sm font-medium">Export Data</button>
                        </div>
                    </div>

                    {/* Top Section: Line chart placeholder */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
                        <h2 className="text-lg font-semibold mb-4">Maize Price (UGX/kg) - 6 Month Trend</h2>
                        <div className="h-80 w-full bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-muted-foreground">
                            [Interactive Chart Placeholder]
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Middle Section: Current Market Rates Table */}
                        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Current Market Rates</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 rounded-tl-lg">Commodity</th>
                                            <th className="px-6 py-3">District</th>
                                            <th className="px-6 py-3">Price (UGX/kg)</th>
                                            <th className="px-6 py-3 rounded-tr-lg">24h Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-border">
                                            <td className="px-6 py-4 font-medium">Beans (Nambale)</td>
                                            <td className="px-6 py-4">Kampala</td>
                                            <td className="px-6 py-4">3,500</td>
                                            <td className="px-6 py-4 text-success">+2.4%</td>
                                        </tr>
                                        <tr className="border-b border-border">
                                            <td className="px-6 py-4 font-medium">Coffee (Robusta)</td>
                                            <td className="px-6 py-4">Mbarara</td>
                                            <td className="px-6 py-4">8,200</td>
                                            <td className="px-6 py-4 text-error">-1.2%</td>
                                        </tr>
                                        <tr className="border-b border-border">
                                            <td className="px-6 py-4 font-medium">Bananas (Matooke)</td>
                                            <td className="px-6 py-4">Gulu</td>
                                            <td className="px-6 py-4">25,000/bunch</td>
                                            <td className="px-6 py-4 text-success">+5.0%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium">Sorghum</td>
                                            <td className="px-6 py-4">Mbale</td>
                                            <td className="px-6 py-4">1,800</td>
                                            <td className="px-6 py-4 text-muted-foreground">0.0%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Sidebar: Trending Crops */}
                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-lg font-semibold mb-4">Trending Crops</h2>
                            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-base">Vanilla</span>
                                    <span className="text-sm font-medium text-success">+12%</span>
                                </div>
                                <span className="text-xs text-muted-foreground">High export demand this week.</span>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-base">Ginger</span>
                                    <span className="text-sm font-medium text-success">+8.5%</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Local market shortages reported.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MarketPrices;
