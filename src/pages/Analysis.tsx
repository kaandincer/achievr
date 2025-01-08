import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { goal, analysis } = location.state || {};

  useEffect(() => {
    if (!goal) {
      navigate('/');
    }
  }, [goal]);

  if (!goal) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          ← Back to Goal Entry
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your SMART Goal Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Your Original Goal</h3>
              <p className="mt-2 text-gray-600">{goal}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">AI Analysis</h3>
              <div className="mt-2 prose prose-sage">
                <p className="whitespace-pre-wrap text-gray-600">{analysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;