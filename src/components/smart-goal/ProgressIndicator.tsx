import { cn } from "@/lib/utils";

type ProgressIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

export const ProgressIndicator = ({ totalSteps, currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i + 1}
          className={cn(
            "w-3 h-3 rounded-full",
            currentStep === i + 1 ? "bg-sage-600" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
};