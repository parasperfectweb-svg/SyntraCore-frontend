// layout/Sidebar/navConfig.js
// Single source of truth for the main sidebar's sections, links, icons
// and badges. Sidebar.jsx / NavSection.jsx just render this data — add a
// new page to the app by adding one entry here.
//
// `icon` is raw inner-SVG markup (rendered via dangerouslySetInnerHTML on
// a fixed 24x24 viewBox <svg> in NavSection.jsx) so this file can stay
// plain data instead of JSX.

export const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', to: '/dashboard',
        icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
      { label: 'Email Inbox', to: '/inbox', badge: 12,
        icon: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>' },
      { label: 'Quotes', to: '/quotes',
        icon: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/>' },
      { label: 'Customers', to: '/customers',
        icon: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Master Jobs', to: '/master-jobs',
        icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>' },
      { label: 'House Jobs', to: '/house-jobs',
        icon: '<path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z"/>' },
      { label: 'Task Engine', to: '/task-engine',
        icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>' },
      { label: 'Transport', to: '/transport',
        icon: '<path d="M3 7h13l4 4v6H3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/>' },
      { label: 'Warehouse', to: '/warehouse',
        icon: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/>' },
      { label: 'Customs', to: '/customs',
        icon: '<circle cx="12" cy="12" r="9"/>' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Cost & Revenue', to: '/cost-revenue',
        icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10h6M9 14h4"/>' },
      { label: 'Invoices', to: '/invoices',
        icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>' },
      { label: 'Documents', to: '/documents',
        icon: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5"/>' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Sales Report', to: '/reports/sales',
        icon: '<path d="M3 17l6-6 4 4 8-9"/>' },
      { label: 'Operations Report', to: '/reports/operations',
        icon: '<rect x="3" y="10" width="4" height="10"/><rect x="10" y="6" width="4" height="14"/><rect x="17" y="3" width="4" height="17"/>' },
      { label: 'Financial Report', to: '/reports/financial',
        icon: '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 3 5-6"/>' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Roles', to: '/settings/roles',
        icon: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>' },
      { label: 'Permissions', to: '/settings/permissions',
        icon: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>' },
      { label: 'Users', to: '/settings/users',
        icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>' },
      { label: 'Configurations', to: '/settings/configurations',
        icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>' },
    ],
  },
];
