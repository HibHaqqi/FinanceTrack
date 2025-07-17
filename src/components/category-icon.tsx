'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name] as LucideIcons.LucideIcon;

  if (!IconComponent) {
    // Fallback icon if the name is not found
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default CategoryIcon;
