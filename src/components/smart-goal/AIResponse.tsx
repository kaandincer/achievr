type AIResponseProps = {
  response: string;
  isLoading: boolean;
};

export const AIResponse = ({ response, isLoading }: AIResponseProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
      <p className="text-sage-800">{response}</p>
    </div>
  );
};