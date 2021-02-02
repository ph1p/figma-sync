import React from 'react';

export const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="https://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24">
    <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
    <circle cx="4" cy="7" r="1" />
    <circle cx="4" cy="12" r="1" />
    <circle cx="4" cy="17" r="1" />
    <rect x="7" y="11" width="14" height="2" rx=".94" ry=".94" />
    <rect x="7" y="16" width="14" height="2" rx=".94" ry=".94" />
    <rect x="7" y="6" width="14" height="2" rx=".94" ry=".94" />
  </svg>
);
