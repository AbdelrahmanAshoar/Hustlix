import { ReactNode } from "react";

const steps: Array<{ title: string; description: string; number: string }> = [
  {
    number: "1",
    title: "Post a Job",
    description:
      "Tell us about your project. Hustlix connects you with top talent around the world.",
  },
  {
    number: "2",
    title: "Hire the Best",
    description:
      "Review portfolios, client ratings, and past work to choose the perfect fit for your requirements.",
  },
  {
    number: "3",
    title: "Work & Pay Securely",
    description:
      "Collaborate easily and pay securely through our milestone-based payment system.",
  },
];

function StepCard({ title, description, number }: { title: string; description: string; number: string }) {
  return (
    <div>
      <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-6">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center">How Hustlix Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
