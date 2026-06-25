
// components/ui/StatCard.tsx
"use client";
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function StatCard({ label, value, trend, icon, size = 'md' }: StatCardProps) {
  
  const sizeClasses = {
    sm: {
      card: 'rounded-xl p-4',
      label: 'text-xs mb-1',
      value: 'text-xl',
      trend: 'text-xs',
      trendIcon: 12,
      iconContainer: 'w-8 h-8 rounded-md',
      iconColor: 'text-gray-500',
      gap: 'gap-2',
    },
    md: {
      card: 'rounded-2xl p-6',
      label: 'text-sm mb-2',
      value: 'text-3xl',
      trend: 'text-sm',
      trendIcon: 16,
      iconContainer: 'w-10 h-10 rounded-lg',
      iconColor: 'text-gray-500',
      gap: 'gap-3',
    },
    lg: {
      card: 'rounded-2xl p-8',
      label: 'text-base mb-3',
      value: 'text-4xl',
      trend: 'text-base',
      trendIcon: 20,
      iconContainer: 'w-12 h-12 rounded-lg',
      iconColor: 'text-gray-500',
      gap: 'gap-4',
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className={`bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm ${styles.card}`}>
      {/* En-tête avec icône et label */}
      <div className={`flex items-center justify-between ${styles.label}`}>
        <p className="text-gray-500">{label}</p>
        {icon && (
          <div className={`${styles.iconContainer} bg-gray-5 flex items-center justify-center`}>
            {/* ✅ On n'utilise plus cloneElement, on affiche l'icône telle quelle */}
            <span className={styles.iconColor}>
              {icon}
            </span>
          </div>
        )}
      </div>
      
      {/* Valeur et tendance */}
      <div className={`flex items-end ${styles.gap}`}>
        <span className={`font-bold text-gray-900 tracking-tight ${styles.value}`}>
          {value}
        </span>
        {trend && (
          <span className={`flex items-center gap-1 font-medium pb-0.5 ${
            trend.isPositive ? 'text-emerald-600' : 'text-red-500'
          } ${styles.trend}`}>
            {trend.isPositive ? (
              <TrendingUp size={styles.trendIcon} />
            ) : (
              <TrendingDown size={styles.trendIcon} />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}