// components/AuditStatsSection.tsx
import { Activity, TrendingUp, User } from 'lucide-react';
import { Card } from '../../../../../components/Card';
import { Badge } from '../../../../../components/Badge';


type Props = {
  stats: any;
 

};
export function AuditStatsSection({ stats }: Props) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="p-6 bg-white">
        <h3 className="text-[#303630] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Top Actions
        </h3>
        <div className="space-y-3">
          {stats && stats?.topActions?.map((item:any, index:number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-[#395159]">{item._id}</span>
              <Badge className="bg-[#395159] text-white">{item.count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-[#303630] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          By Resource
        </h3>
        <div className="space-y-3">
          {stats?.topResources?.map((item:any, index:number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-[#395159]">{item._id}</span>
              <Badge className="bg-[#395159] text-white">{item.count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white md:col-span-2">
        <h3 className="text-[#303630] mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Top Users
        </h3>
        <div className="space-y-3">
          {stats.mostActiveUsers.map((item:any, index:number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-[#395159]">{item?.userName}</span>
              <Badge className="bg-[#395159] text-white">{item.count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white md:col-span-2">
        <h3 className="text-[#303630] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Recent Activity Timeline
        </h3>
        <div className="space-y-3">
          {stats.activityTimeline.slice(0, 5).map((item:any, index:number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-[#395159]">{item?._id?.day}</span>
              <Badge className="bg-[#395159] text-white">{item.count}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
