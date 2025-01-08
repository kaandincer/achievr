import React, { createContext, useContext, ReactNode } from 'react';

type GoalContextType = {
  goal: string;
  setGoal: (goal: string) => void;
};

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children, initialGoal = '' }: { children: ReactNode; initialGoal?: string }) => {
  const [goal, setGoal] = React.useState(initialGoal);

  return (
    <GoalContext.Provider value={{ goal, setGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
};