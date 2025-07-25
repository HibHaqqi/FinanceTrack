'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  icon?: string;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ name, icon, ...props }) => {
  // If icon is provided (emoji), render it
  if (icon) {
    return <span className={`text-xl ${props.className || ''}`}>{icon}</span>;
  }
  
  // Otherwise try to use Lucide icon
  // @ts-ignore
  const IconComponent = name ? (LucideIcons[name] as LucideIcons.LucideIcon) : null;

  if (!IconComponent) {
    // Fallback icon if the name is not found
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default CategoryIcon;
