
import { SimulationState } from '../types';
import { SANDBOX_TASKS } from '../constants';

export interface StepResult {
  completed: boolean;
  feedback?: string;
}

export interface ModuleResult {
  title: string;
  steps: StepResult[];
  score: number;
  totalSteps: number;
}

export interface AssessmentResult {
  modules: ModuleResult[];
  totalScore: number;
  totalSteps: number;
  passed: boolean;
}

/**
 * Legacy automated assessment scoring is currently disabled as the sandbox
 * transitioned to a manual checklist workflow ("Practical Workshop Roadmap").
 * 
 * Future updates may re-implement this logic to match the new tasks dynamically.
 */
export const calculateAssessmentScore = (state: SimulationState): AssessmentResult => {
  const results: ModuleResult[] = SANDBOX_TASKS.map((task, taskIndex) => {
    const completedSteps = state.completedSandboxTasks[taskIndex] || [];
    const steps: StepResult[] = task.steps.map((_, stepIndex) => ({
      completed: completedSteps[stepIndex] || false
    }));

    return {
      title: task.title,
      steps,
      score: steps.filter(s => s.completed).length,
      totalSteps: task.steps.length
    };
  });

  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const totalSteps = results.reduce((acc, r) => acc + r.totalSteps, 0);
  
  return {
    modules: results,
    totalScore,
    totalSteps,
    passed: totalSteps > 0 ? (totalScore / totalSteps) >= 0.8 : true
  };
};
