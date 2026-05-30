import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const AboutPage = () => {
  return (
    <div className="space-y-6">
      <Card className="rounded-4xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
              About Voteria
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              A shadcn-inspired Reddit-style interface with cards, badges, and
              an adaptive app shell.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Built with
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>Tailwind</Badge>
                <Badge>shadcn</Badge>
                <Badge>Vite</Badge>
              </div>
            </div>
            <div className="space-y-2 rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Focus areas
              </p>
              <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                <li>• Feed-first layout</li>
                <li>• Sidebar navigation</li>
                <li>• Theme toggle</li>
                <li>• Reusable shadcn blocks</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button>View feed</Button>
            <Button variant="secondary">Read docs</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
