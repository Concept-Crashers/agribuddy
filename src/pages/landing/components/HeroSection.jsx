import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
	const navigate = useNavigate();

	return (
		<section
			className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden pt-20"
			style={{
				backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 100%), url('https://images.pexels.com/photos/31374544/pexels-photo-31374544.jpeg?auto=compress&cs=tinysrgb&w=2400&dpr=2&fit=max')`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundAttachment: 'fixed',
			}}
		>
			<div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center max-w-7xl mx-auto w-full">
				<div className="space-y-6">
					<div className="inline-flex items-center gap-2 bg-emerald-900/50 px-4 py-2 rounded-full backdrop-blur-sm">
						<Leaf className="text-emerald-300" size={16} />
						<span className="text-sm font-semibold text-emerald-100">Smart Farming for the Future</span>
					</div>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
						Empower Your Farm with <span className="text-emerald-300">AI Intelligence</span>
					</h1>

					<p className="text-lg text-gray-100 max-w-lg">
						AgriBuddy brings cutting-edge AI, real-time weather forecasts, and community wisdom to transform how you farm. Increase yields, reduce costs, and grow smarter.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 pt-6">
						<button
							onClick={() => navigate('/signup')}
							className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl"
						>
							Get Started Free
							<ArrowRight size={20} />
						</button>
						<button
							onClick={() => navigate('/login')}
							className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white font-semibold rounded-lg border-2 border-white/40 hover:bg-white/30 transition-colors backdrop-blur-sm"
						>
							Sign In
						</button>
					</div>

					<div className="pt-8 grid grid-cols-3 gap-4">
						<div>
							<p className="text-2xl font-bold text-white">10K+</p>
							<p className="text-sm text-gray-200">Active Farmers</p>
						</div>
						<div>
							<p className="text-2xl font-bold text-white">98%</p>
							<p className="text-sm text-gray-200">Satisfaction</p>
						</div>
						<div>
							<p className="text-2xl font-bold text-white">24/7</p>
							<p className="text-sm text-gray-200">Support</p>
						</div>
					</div>
				</div>

				<div className="relative hidden md:block">
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-yellow-300/20 rounded-3xl blur-2xl"></div>
					<div className="relative bg-white rounded-3xl p-2 shadow-2xl border border-white/20 overflow-hidden">
						<img
							src="/assets/images/dashboard-user.png"
							alt="AgriBuddy Dashboard"
							className="w-full h-auto rounded-2xl object-contain bg-white"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
