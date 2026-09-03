import { TrendingUp, MoreVertical } from 'lucide-react';

export const AdminDashboardView = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - Analytics Card + Sales Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Website Analytics - Large Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute top-4 right-4 flex gap-1">
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/70 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-1">Website Analytics</h3>
            <p className="text-white/80 text-sm mb-6">Total 28.5% Conversion Rate</p>

            <div className="flex items-center gap-8 mb-6">
              <div>
                <div className="text-3xl font-bold mb-1">Traffic</div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-semibold">28%</span>
                    <div className="text-white/70">Sessions</div>
                  </div>
                  <div>
                    <span className="font-semibold">3.1k</span>
                    <div className="text-white/70">Page Views</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 text-sm mt-8">
                  <div>
                    <span className="font-semibold">1.2k</span>
                    <div className="text-white/70">Leads</div>
                  </div>
                  <div>
                    <span className="font-semibold">12%</span>
                    <div className="text-white/70">Conversions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Sphere Illustration */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-blue-300 rounded-full opacity-90 blur-2xl"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-indigo-300 to-violet-400 rounded-full opacity-80 blur-xl"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-white/40 to-violet-200/40 rounded-full backdrop-blur-sm"></div>
                {/* Layered rings effect */}
                <div className="absolute inset-6 border-2 border-white/20 rounded-full"></div>
                <div className="absolute inset-10 border-2 border-white/30 rounded-full"></div>
                <div className="absolute inset-14 border-2 border-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Overview Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-emerald-600 text-sm font-medium mb-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +18.2%
              </div>
              <div className="text-3xl font-bold text-slate-800">$42.5k</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="2" y="2" width="16" height="16" rx="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">Order</div>
                  <div className="text-xs text-slate-500">62,440</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">62.2%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="2" y="2" width="16" height="16" rx="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">Visits</div>
                  <div className="text-xs text-slate-500">vs</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">25.5%</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[62%] bg-blue-500 rounded-full"></div>
            <div className="absolute left-[62%] top-0 h-full w-[25%] bg-violet-500 rounded-full"></div>
          </div>

          {/* Revenue Chart Area */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Revenue Generated</div>
              <div className="text-2xl font-bold text-slate-800">97.5k</div>
            </div>
            
            {/* Mini Area Chart */}
            <svg className="w-full h-20" viewBox="0 0 300 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 L30,45 L60,50 L90,30 L120,35 L150,25 L180,40 L210,20 L240,30 L270,15 L300,25 L300,80 L0,80 Z"
                fill="url(#areaGradient)"
              />
              <path
                d="M0,60 L30,45 L60,50 L90,30 L120,35 L150,25 L180,40 L210,20 L240,30 L270,15 L300,25"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Second Row - Earning Reports + Support Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earning Reports */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Earning Reports</h3>
              <p className="text-sm text-slate-500">Weekly Earnings Overview</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Amount Display */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-slate-800 mb-2">$468</div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-sm font-medium">
              <TrendingUp className="w-3 h-3" />
              +4.2%
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            You informed of this week compared to last week
          </p>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-32 gap-2 mb-6">
            {[35, 45, 60, 85, 70, 65, 55].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    i === 3 ? 'bg-violet-600' : 'bg-violet-200'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>

          {/* Tech Stack Icons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2">
              {/* Vue */}
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#41B883" d="M2,3H5.5L12,15L18.5,3H22L12,21L2,3M6.5,3H9.5L12,7.58L14.5,3H17.5L12,13.08L6.5,3Z"/>
                </svg>
              </div>
              {/* Nuxt */}
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#00C58E" d="M19.2,17.41L14.9,9.66L13.45,12.18L16.23,17.41H19.2M11.53,17.41L6.5,8.58L1.47,17.41H11.53M8.77,3L3.74,11.83L2.29,9.31L6.5,2L15.66,17.41H12.69L8.77,10.25L4.85,17.41H8.77L12.69,10.25L16.61,17.41H20.53L11.37,2L8.77,3Z"/>
                </svg>
              </div>
              {/* React */}
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#61DAFB" d="M12,10.11C13.03,10.11 13.87,10.95 13.87,12C13.87,13 13.03,13.85 12,13.85C10.97,13.85 10.13,13 10.13,12C10.13,10.95 10.97,10.11 12,10.11M7.37,20C8,20.38 9.38,19.8 10.97,18.3C9.54,16.87 8.15,15.27 6.89,13.58C4.59,13.35 2.69,13.14 2.69,12.06C2.69,11.31 4.56,10.39 6.88,10.13C8.15,8.45 9.54,6.85 10.97,5.42C9.38,3.92 8,3.34 7.37,3.72C6.45,4.27 6.41,6.52 7.36,9.33C6.84,9.46 6.34,9.6 5.87,9.77C3.5,10.6 2,11.84 2,12.06C2,13.82 5.03,14.81 6.89,15.17C6.34,16.18 5.91,17.21 5.65,18.16C5.11,20 5.27,21.46 6.19,22C7.1,22.53 8.5,21.94 10.1,20.43C11.16,21.5 12.22,22.32 13.19,22.32C14.14,22.32 15.2,21.5 16.26,20.43C17.86,21.94 19.26,22.53 20.17,22C21.09,21.46 21.25,20 20.71,18.16C20.45,17.21 20,16.18 19.47,15.17C21.33,14.81 24.36,13.82 24.36,12.06C24.36,11.84 22.86,10.6 20.49,9.77C20,9.6 19.5,9.46 19,9.33C19.93,6.52 19.89,4.27 18.97,3.72C18.34,3.34 16.96,3.92 15.37,5.42C13.94,6.85 12.55,8.45 11.28,10.13C13.6,10.39 15.47,11.31 15.47,12.06C15.47,13.14 13.57,13.35 11.27,13.58C10.01,15.27 8.62,16.87 7.19,18.3C8.78,19.8 10.16,20.38 10.79,20C11.71,19.45 11.75,17.2 10.8,14.39C11.32,14.26 11.82,14.12 12.29,13.95C14.66,13.12 16.16,11.88 16.16,11.66C16.16,9.9 13.13,8.91 11.27,8.55C11.82,7.54 12.25,6.51 12.51,5.56C13.05,3.72 12.89,2.26 11.97,1.72C11.06,1.19 9.66,1.78 8.06,3.29C7,2.22 5.94,1.4 4.97,1.4C4.03,1.4 2.97,2.22 1.9,3.29C0.3,1.78 -1.1,1.19 -2.03,1.72C-2.95,2.26 -3.11,3.72 -2.57,5.56C-2.31,6.51 -1.88,7.54 -1.33,8.55C-3.19,8.91 -6.22,9.9 -6.22,11.66C-6.22,11.88 -4.72,13.12 -2.35,13.95C-1.86,14.12 -1.36,14.26 -0.86,14.39C-1.81,17.2 -1.77,19.45 -0.85,20C-0.22,20.38 1.16,19.8 2.75,18.3C4.18,16.87 5.57,15.27 6.83,13.58C4.53,13.35 2.63,13.14 2.63,12.06C2.63,11.31 4.5,10.39 6.82,10.13Z"/>
                </svg>
              </div>
              {/* Next.js */}
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              {/* HTML5 */}
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#E34F26" d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"/>
                </svg>
              </div>
              {/* Laravel */}
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#FF2D20" d="M20.72,9.54L20,9L15,6.13L10,3.25C9.63,3 9.32,3 9,3C8.68,3 8.37,3 8,3.25L3,6.13L2.28,9.54C2.1,10.37 2,11.23 2,12.13V15.88C2,16.78 2.1,17.64 2.28,18.47L3,21.88L8,24.75C8.37,25 8.68,25 9,25C9.32,25 9.63,25 10,24.75L15,21.88L20,19L20.72,15.59C20.9,14.76 21,13.9 21,13V9.25C21,9.01 20.86,8.78 20.72,9.54M7.5,11L12,8L16.5,11L12,14L7.5,11M12,16L7.5,13V18L12,21V16M16.5,13L12,16V21L16.5,18V13Z"/>
                </svg>
              </div>
              {/* .NET */}
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#512BD4" d="M2,15.5C2,14.7 2.6,14 3.5,14H4.5C5.3,14 6,14.7 6,15.5V20.5C6,21.3 5.3,22 4.5,22H3.5C2.6,22 2,21.3 2,20.5V15.5M7.5,10.5C7.5,9.7 8.1,9 9,9H10C10.8,9 11.5,9.7 11.5,10.5V20.5C11.5,21.3 10.8,22 10,22H9C8.1,22 7.5,21.3 7.5,20.5V10.5M13,5.5C13,4.7 13.6,4 14.5,4H15.5C16.3,4 17,4.7 17,5.5V20.5C17,21.3 16.3,22 15.5,22H14.5C13.6,22 13,21.3 13,20.5V5.5M18.5,2C18.5,1.2 19.1,0.5 20,0.5H21C21.8,0.5 22.5,1.2 22.5,2V20.5C22.5,21.3 21.8,22 21,22H20C19.1,22 18.5,21.3 18.5,20.5V2Z"/>
                </svg>
              </div>
              {/* Django */}
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#092E20" d="M7.533,12.249c-.011,1.985,1.445,3.168,3.768,3.168h.076V9.618h-.076C9.027,9.618,7.544,10.775,7.533,12.249z M7.533,12.249c-.011,1.985,1.445,3.168,3.768,3.168h.076V9.618h-.076C9.027,9.618,7.544,10.775,7.533,12.249z M7.533,12.249c-.011,1.985,1.445,3.168,3.768,3.168h.076V9.618h-.076C9.027,9.618,7.544,10.775,7.533,12.249z"/>
                </svg>
              </div>
            </div>

            {/* Amounts */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-slate-800">$545.69</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800">$256.34</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800">$74.19</div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Support Tracker</h3>
              <p className="text-sm text-slate-500">Last 7 Days</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs text-slate-500 mb-1">Completed Task</div>
                <div className="text-4xl font-bold text-slate-800">85%</div>
              </div>
            </div>
          </div>

          {/* Total Tickets */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-slate-800 mb-1">164</div>
            <div className="text-sm text-slate-500">Total Tickets</div>
          </div>

          {/* New Tickets */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor"/>
                  <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">New Tickets</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Response Time</div>
              <div className="text-xs text-slate-500">1 Day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
