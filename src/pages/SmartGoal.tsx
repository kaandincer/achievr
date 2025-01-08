import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const SmartGoal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [specificGoal, setSpecificGoal] = useState("");
  const originalGoal = location.state?.goal || "";

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto mt-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center">
            Let's Make Your Goal SMART
          </h1>
          <p className="text-gray-600 text-center">
            Your goal: "{originalGoal}"
          </p>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              Make your goal as specific as possible
            </label>
            <Input
              value={specificGoal}
              onChange={(e) => setSpecificGoal(e.target.value)}
              placeholder="Enter your specific goal here..."
              className="w-full text-lg p-4"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mr-4"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartGoal;