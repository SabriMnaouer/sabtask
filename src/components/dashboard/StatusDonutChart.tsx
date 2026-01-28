
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusDonutChartProps } from '../../types';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ data, totalTasks }) => {
  const { state } = useApp();
  const { t } = state;

  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('statusOverview')}</h3>
           <p className="text-sm text-slate-500">{t('realTimeStats')}</p>
        </div>
      </div>
      
      <div className="h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={6}
              dataKey="value"
              cornerRadius={8}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalTasks}</span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">{t('totalTasks')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
            <div className="flex flex-col">
               {/* Note: item.name comes from useDashboardData which needs to be translated there or mapped here. For simplicity, we assume fixed status names or mapped later, but ideally logic hook handles keys. */}
               <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
               <span className="text-[10px] text-slate-400 font-medium">
                 {totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0}%
               </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
