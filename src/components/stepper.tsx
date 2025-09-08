/**
 * Stepper Component
 * 
 * Multi-step wizard interface for the legal requirements flow.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onNext?: () => void;
  onPrev?: () => void;
  onStepClick?: (stepIndex: number) => void;
  nextLabel?: string;
  prevLabel?: string;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onNext,
  onPrev,
  onStepClick,
  nextLabel = 'Next',
  prevLabel = 'Previous',
  isNextDisabled = false,
  isPrevDisabled = false,
  className
}: StepperProps) {
  const canGoNext = currentStep < steps.length - 1;
  const canGoPrev = currentStep > 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Step Indicators */}
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;
          const isClickable = onStepClick && (isPast || step.completed);

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-default",
                  isClickable && "cursor-pointer"
                )}
                onClick={isClickable ? () => onStepClick(index) : undefined}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isPast && step.completed && "border-success bg-success text-success-foreground",
                    !isCurrent && !isPast && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-foreground",
                      isPast && "text-muted-foreground",
                      !isCurrent && !isPast && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-all",
                    index < currentStep ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Step Content */}
      {steps[currentStep] && (
        <div className="stepper-step active">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step content slot - this would be filled by the parent component */}
          <div className="min-h-[200px] mb-6">
            {/* Content goes here */}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!canGoPrev || isPrevDisabled}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{prevLabel}</span>
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>

        <Button
          onClick={onNext}
          disabled={!canGoNext || isNextDisabled}
          className="flex items-center space-x-2"
        >
          <span>{nextLabel}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}