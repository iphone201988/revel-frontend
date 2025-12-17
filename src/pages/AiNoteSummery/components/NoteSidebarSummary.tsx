import { Card } from "../../../components/Card";
import { Label } from "../../../components/Label";
import { Badge } from "../../../components/Badge";

interface NoteSidebarSummaryProps {
  sessionData: any;
}

export function NoteSidebarSummary({ sessionData }: NoteSidebarSummaryProps) {
  const collected = sessionData?.collectedData;
  const session = sessionData?.sessionData;

  if (!collected || !session) return null;

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-[#303630] mb-4">Session Summary</h3>

      <div className="space-y-4">
        {/* Client */}
        <div>
          <Label className="text-sm text-[#395159]">Client</Label>
          <p className="text-[#303630]">{session.client?.name}</p>
        </div>

        {/* Date */}
        <div>
          <Label className="text-sm text-[#395159]">Date</Label>
          <p className="text-[#303630]">
            {new Date(session.dateOfSession).toLocaleDateString()}
          </p>
        </div>

        {/* Duration */}
        <div>
          <Label className="text-sm text-[#395159]">Duration</Label>
          <p className="text-[#303630]">
            {Math.floor(collected.duration / 60)} minutes
          </p>
        </div>

        {/* Goals Performance */}
        <div className="pt-4 border-t border-[#ccc9c0]">
          <Label className="text-sm text-[#395159] mb-2 block">
            Goal Performance
          </Label>

          <div className="space-y-3">
            {collected.goals_dataCollection.map((goal: any, index: number) => (
              <div key={goal._id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#303630]">
                    Goal {index + 1}
                  </span>
                  <Badge className="bg-[#395159] text-white">
                    {goal.accuracy}%
                  </Badge>
                </div>

                {/* Support level breakdown */}
                {/* <div className="text-xs text-[#395159] pl-2">
                  {goal.supportLevel?.independent && (
                    <span className="mr-2">
                      Indep: {goal.supportLevel.independent.success}/
                      {goal.supportLevel.independent.count}
                    </span>
                  )}
                  {goal.supportLevel?.minimal && (
                    <span className="mr-2">
                      Min: {goal.supportLevel.minimal.success}/
                      {goal.supportLevel.minimal.count}
                    </span>
                  )}
                  {goal.supportLevel?.modrate && (
                    <span>
                      Mod: {goal.supportLevel.modrate.success}/
                      {goal.supportLevel.modrate.count}
                    </span>
                  )}
                </div> */}
              </div>
            ))}
          </div>
        </div>

      
        <div className="pt-4 border-t border-[#ccc9c0] space-y-3">
  <div>
    <Label className="text-sm text-[#395159] mb-1 block">
      Activities Engaged
    </Label>
    <p className="text-sm text-[#303630]">
      {collected.activityEngaged?.length > 0
        ? collected.activityEngaged.join(", ")
        : "None recorded"}
    </p>
  </div>

  <div>
    <Label className="text-sm text-[#395159] mb-1 block">
      Supports Observed
    </Label>
     <p className="text-sm text-[#303630]">
   {collected.activityEngaged?.length > 0
        ? collected.supportsObserved.join(", ")
        : "None recorded"}
   
     </p>
  </div>
</div>


        {/* Provider Observation */}
        {collected.providerObservation && (
          <div className="pt-4 border-t border-[#ccc9c0]">
            <Label className="text-sm text-[#395159] mb-2 block">
              Provider Observation
            </Label>
            <p className="text-sm text-[#303630]">
              {collected.providerObservation}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
