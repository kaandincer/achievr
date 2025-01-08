import { Card, CardContent } from "@/components/ui/card";
import { useGoal } from "./GoalContext";

export const GoalSummary = () => {
  const { goal } = useGoal();

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700">Your Original Goal</h3>
      <Card className="mt-2">
        <CardContent className="pt-4">
          <p className="text-gray-600">{goal}</p>
        </CardContent>
      </Card>
    </div>
  );
};