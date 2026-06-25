import React from 'react';

// Données mockées pour les stagiaires
const traineesData = [
  { id: 1, name: 'Abigail', type: 'Warm', email: 'abigail@hyperloop.co', followUp: 'In 1 day', status: 'Closed', score: 89, source: 'LinkedIn', website: 'hyperloop.co', color: 'bg-rose-500' },
  { id: 2, name: 'Alexander', type: 'Cold', email: 'alex@fusiontech.co', followUp: 'In 1 week', status: 'Lost', score: 51, source: 'Referral', website: 'fusiontech.co', color: 'bg-purple-500' },
  { id: 3, name: 'Amelia', type: 'Warm', email: 'amelia@quantumleap.io', followUp: 'In 1 day', status: 'Closed', score: 92, source: 'Website', website: 'quantumleap.io', color: 'bg-emerald-400' },
  { id: 4, name: 'Aria', type: 'Warm', email: 'aria@chronotech.io', followUp: 'In 2 days', status: 'Closed', score: 78, source: 'LinkedIn', website: 'chronotech.io', color: 'bg-pink-500' },
  { id: 5, name: 'Ava', type: 'Warm', email: 'ava@synthwave.io', followUp: 'In 3 days', status: 'Closed', score: 88, source: 'Referral', website: 'synthwave.io', color: 'bg-green-400' },
  { id: 6, name: 'Benjamin', type: 'Cold', email: 'ben@yahoo.com', followUp: 'In 5 days', status: 'Lost', score: 31, source: 'Google', website: '-', color: 'bg-red-500' },
  { id: 7, name: 'Carter', type: 'Cold', email: 'carter@outlook.com', followUp: 'In 6 days', status: 'Lost', score: 24, source: 'LinkedIn', website: '-', color: 'bg-blue-500' },
  { id: 8, name: 'Charlotte', type: 'Warm', email: 'charlotte@novawave.io', followUp: 'In 3 days', status: 'Closed', score: 84, source: 'LinkedIn', website: 'novawave.io', color: 'bg-lime-400' },
  { id: 9, name: 'Chloe', type: 'Warm', email: 'chloe@pulsewave.io', followUp: 'In 1 day', status: 'Closed', score: 90, source: 'Cold Call', website: 'pulsewave.io', color: 'bg-yellow-200' },
  { id: 10, name: 'Daniel', type: 'Cold', email: 'daniel@infracloud.io', followUp: 'In 3 days', status: 'Lost', score: 41, source: 'Website', website: 'infracloud.io', color: 'bg-amber-500' },
];

export default function TraineesDashboard() {
  return (
    <div className="flex h-screen bg-[#0f0f10] text-[#e5e7eb] font-sans antialiased overflow-hidden selection:bg-emerald-500/30">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 flex-shrink-0 border-r border-[#27272a] bg-[#09090b] flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="p-4 flex items-center gap-3 border-b border-[#27272a]">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">S</div>
          <span className="font-bold tracking-tight text-lg text-white">Square UI</span>
        </div>

        <div className="p-4 space-y-6 flex-1">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#18181b] border border-[#27272a] rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-[#e5e7eb] placeholder-[#a1a1aa]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#a1a1aa] font-mono">/</span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-0.5 text-[#a1a1aa] text-sm">
            <SidebarItem icon={<InboxIcon />} label="Inbox" />
            <SidebarItem icon={<DashboardIcon />} label="Dashboard" active />
            <SidebarItem icon={<MyTasksIcon />} label="My Tasks" />
            <SidebarItem icon={<ProjectsIcon />} label="Projects" />
            <SidebarItem icon={<CalendarIcon />} label="Calendar" />
            <SidebarItem icon={<DocumentsIcon />} label="Documents" />
            <SidebarItem icon={<TeamsIcon />} label="Teams" />
            <SidebarItem icon={<CompanyIcon />} label="Company" />
          </nav>

          {/* Workgroups */}
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-semibold uppercase text-[#a1a1aa] tracking-wider">
              <span>Workgroups</span>
              <div className="flex gap-1">
                <PlusIcon className="w-3 h-3 cursor-pointer" />
                <MoreHorizontalIcon className="w-3 h-3 cursor-pointer" />
              </div>
            </div>
            <nav className="space-y-0.5 text-sm text-[#a1a1aa]">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#18181b] cursor-pointer">
                <UsersIcon className="w-4 h-4" /> <span>All Work</span>
              </div>
              <div className="pl-6 space-y-0.5 border-l border-[#27272a] ml-1.5">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#18181b] cursor-pointer relative">
                  <div className="absolute -left-[1.2rem] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-[#27272a]"></div>
                  <FolderIcon className="w-4 h-4" /> <span>Website Copy</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#18181b] cursor-pointer relative">
                  <div className="absolute -left-[1.2rem] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-[#27272a]"></div>
                  <FileIcon className="w-4 h-4" /> <span>Client website</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#18181b] cursor-pointer relative">
                  <div className="absolute -left-[1.2rem] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-[#27272a]"></div>
                  <FileIcon className="w-4 h-4" /> <span>Personal project</span>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Promo Card */}
        <div className="p-4 border-t border-[#27272a] bg-[#09090b]">
          <div className="bg-[#18181b] rounded-lg p-4 border border-[#27272a] flex flex-col items-center text-center gap-3">
            <h3 className="font-bold text-sm">Open-source layouts by Indev-ui</h3>
            <p className="text-xs text-[#a1a1aa]">Collection of beautifully crafted open-source layouts UI built with shadcn/ui.</p>
            <button className="w-full bg-white text-black text-xs font-medium py-1.5 rounded-md hover:bg-gray-200 transition-colors">
              square.indevui.com
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col h-full bg-[#0f0f10] p-6 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="p-1.5 rounded-md hover:bg-[#18181b] text-[#a1a1aa]">
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-[#a1a1aa]">
              <span className="text-white font-medium">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-[#2dd4bf] border-2 border-[#0f0f10]"></div>
              <div className="w-6 h-6 rounded-full bg-[#f472b6] border-2 border-[#0f0f10]"></div>
              <div className="w-6 h-6 rounded-full bg-[#a78bfa] border-2 border-[#0f0f10]"></div>
            </div>
            <div className="h-4 w-[1px] bg-[#27272a]"></div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs transition-colors">
              <SparklesIcon className="w-3.5 h-3.5" /> Ask AI
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs transition-colors">
              <ShareIcon className="w-3.5 h-3.5" /> Share
            </button>
            <button className="p-1.5 rounded-full hover:bg-[#18181b] text-[#a1a1aa]">
              <HistoryIcon className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded-full bg-[#27272a] flex items-center justify-center text-xs border border-[#3f3f46]">
              P
            </div>
          </div>
        </header>

        {/* Table Container */}
        <div className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg flex flex-col overflow-hidden shadow-xl">
          
          {/* Table Header Controls */}
          <div className="p-4 border-b border-[#27272a] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="font-medium text-base mr-2">Lead Management</h2>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a1a1aa]" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-40 bg-[#18181b] border border-[#27272a] rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-[#e5e7eb] placeholder-[#a1a1aa]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs transition-colors">
                <FilterIcon className="w-3.5 h-3.5" /> Filter
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs transition-colors">
                <ArrowUpDownIcon className="w-3.5 h-3.5" /> Sort
              </button>
              <div className="h-4 w-[1px] bg-[#27272a] mx-2"></div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs transition-colors">
                <DownloadIcon className="w-3.5 h-3.5" /> Export/Import
              </button>
              <button className="p-1.5 rounded-md hover:bg-[#18181b] text-[#a1a1aa]">
                <RefreshCcwIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table Header (Columns) */}
          <div className="grid grid-cols-[auto_1fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr] gap-4 px-4 py-2.5 bg-[#0f0f10] border-b border-[#27272a] text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
            <div className="w-6 flex items-center"><input type="checkbox" className="accent-emerald-500 bg-[#27272a] border-[#3f3f46] rounded-sm w-3.5 h-3.5 cursor-pointer" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Name <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Type <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Email <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Follow-up <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Status <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Score <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Source <ChevronDownIcon className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">Website <ChevronDownIcon className="w-3 h-3" /></div>
          </div>

          {/* Table Rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {traineesData.map((trainee) => (
              <div key={trainee.id} className="grid grid-cols-[auto_1fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr] gap-4 px-4 py-2.5 border-b border-[#27272a]/50 hover:bg-[#18181b] transition-colors items-center group">
                <div className="w-6 flex items-center"><input type="checkbox" className="accent-emerald-500 bg-[#27272a] border-[#3f3f46] rounded-sm w-3.5 h-3.5 cursor-pointer" /></div>
                
                {/* Name */}
                <div className="flex items-center gap-2.5 text-sm font-medium">
                  <div className={`w-5 h-5 rounded-full ${trainee.color} flex-shrink-0`}></div>
                  <span>{trainee.name}</span>
                </div>

                {/* Type */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    trainee.type === 'Warm' 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                    : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  }`}>
                    {trainee.type === 'Warm' ? <WarmIcon /> : <ColdIcon />}
                    {trainee.type}
                  </span>
                </div>

                {/* Email */}
                <div className="text-sm text-[#a1a1aa] hover:text-white truncate">{trainee.email}</div>

                {/* Follow-up */}
                <div className="text-sm text-[#a1a1aa]">{trainee.followUp}</div>

                {/* Status */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                    trainee.status === 'Closed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {trainee.status === 'Closed' ? <CheckIcon /> : <XIcon />}
                    {trainee.status}
                  </span>
                </div>

                {/* Score (Bar) */}
                <div className="flex items-center gap-2 w-24">
                  <div className="flex-1 h-1 bg-[#27272a] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${trainee.score > 70 ? 'bg-emerald-400' : trainee.score > 40 ? 'bg-teal-500' : 'bg-rose-500'}`} 
                      style={{ width: `${trainee.score}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#a1a1aa] w-6 text-right">{trainee.score}</span>
                </div>

                {/* Source */}
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#a1a1aa] font-medium">
                    {trainee.source === 'LinkedIn' && <LinkedInIcon />}
                    {trainee.source === 'Referral' && <ReferralIcon />}
                    {trainee.source === 'Website' && <WebsiteIcon />}
                    {trainee.source === 'Google' && <GoogleIcon />}
                    {trainee.source === 'Cold Call' && <ColdCallIcon />}
                    {trainee.source}
                  </span>
                </div>

                {/* Website */}
                <div className="text-sm text-[#a1a1aa]">{trainee.website}</div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between text-xs text-[#a1a1aa]">
            <div className="flex items-center gap-4">
              <span>Showing 1 to 10 of 50 leads</span>
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select className="bg-[#18181b] border border-[#27272a] rounded px-2 py-0.5 text-[#e5e7eb] outline-none">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span>per page</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:text-white disabled:opacity-50"><ChevronsLeftIcon className="w-4 h-4" /></button>
              <button className="p-1 hover:text-white disabled:opacity-50"><ChevronLeftIcon className="w-4 h-4" /></button>
              <button className="w-6 h-6 rounded bg-[#27272a] text-white flex items-center justify-center text-xs font-medium">1</button>
              <button className="w-6 h-6 rounded hover:bg-[#18181b] flex items-center justify-center text-xs">2</button>
              <button className="w-6 h-6 rounded hover:bg-[#18181b] flex items-center justify-center text-xs">3</button>
              <button className="w-6 h-6 rounded hover:bg-[#18181b] flex items-center justify-center text-xs">4</button>
              <button className="w-6 h-6 rounded hover:bg-[#18181b] flex items-center justify-center text-xs">5</button>
              <button className="p-1 hover:text-white"><ChevronRightIcon className="w-4 h-4" /></button>
              <button className="p-1 hover:text-white"><ChevronsRightIcon className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- Icon Components (SVG) --- */
const SearchIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const InboxIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
const DashboardIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const MyTasksIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>;
const ProjectsIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>;
const CalendarIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
const DocumentsIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const TeamsIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CompanyIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M8 21V12a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9"/><path d="M10 9a2 2 0 1 1 4 0"/></svg>;
const PlusIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const MoreHorizontalIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const UsersIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const FolderIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>;
const FileIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const MenuIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const SparklesIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3v19"/><path d="M5 10h14"/><path d="M5 18h14"/><path d="M3 6l18 12"/><path d="M3 18l18-12"/></svg>;
const ShareIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>;
const HistoryIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
const FilterIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const ArrowUpDownIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>;
const DownloadIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const RefreshCcwIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>;
const ChevronDownIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;
const ChevronLeftIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronsLeftIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>;
const ChevronRightIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const ChevronsRightIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>;
const WarmIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>;
const ColdIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/><path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"/></svg>;
const CheckIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const XIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const LinkedInIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const ReferralIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 18.5V6.5A3.5 3.5 0 0 0 18.5 3H5.5A3.5 3.5 0 0 0 2 6.5v12A3.5 3.5 0 0 0 5.5 22h13A3.5 3.5 0 0 0 22 18.5z"/><circle cx="12" cy="12" r="4"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/></svg>;
const WebsiteIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const GoogleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;
const ColdCallIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;


/* --- Helper Sidebar Component --- */
function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${active ? 'bg-[#18181b] text-white' : 'hover:bg-[#18181b] hover:text-white'}`}>
      <div className="w-4 h-4 opacity-70">{icon}</div>
      <span>{label}</span>
    </div>
  );
}