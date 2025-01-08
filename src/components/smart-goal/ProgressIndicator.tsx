import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressIndicator = ({ totalSteps, currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-3 h-3 rounded-full",
            currentStep === index + 1 ? "bg-sage-600" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;