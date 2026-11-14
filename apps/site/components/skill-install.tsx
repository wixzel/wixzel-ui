"use client";

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "wixzel-ui";
import { DownloadSimpleIcon } from "wixzel-ui/icons";
import { cn } from "wixzel-ui/utils";
import { CodeBlock } from "./code-block";

/** The three ways to give Claude the skill, and the first thing to ask. */
export function SkillInstall({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Claude Code</TabsTrigger>
          <TabsTrigger value="app">Claude app</TabsTrigger>
          <TabsTrigger value="folder">Any agent</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-4 flex flex-col gap-3 text-body-sm text-fg-muted">
          <p>Add the marketplace once, then install the plugin. It updates with the repository.</p>
          <CodeBlock className="[&_pre]:rounded-lg [&_pre]:bg-card [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-body-sm [&_pre]:text-fg">
            {"/plugin marketplace add wixzel/wixzel-ui\n/plugin install wixzel-ui@wixzel"}
          </CodeBlock>
        </TabsContent>

        <TabsContent value="app" className="mt-4 flex flex-col items-start gap-3 text-body-sm text-fg-muted">
          <p>
            Download the zip, then upload it in Claude under{" "}
            <strong className="text-fg">Settings › Capabilities › Skills</strong>.
          </p>
          <Button asChild variant="primary" iconStart={<DownloadSimpleIcon />}>
            <a href="/wixzel-ui-skill.zip" download>
              Download wixzel-ui-skill.zip
            </a>
          </Button>
        </TabsContent>

        <TabsContent value="folder" className="mt-4 flex flex-col gap-3 text-body-sm text-fg-muted">
          <p>Unzip it into your skills folder. Any agent that reads SKILL.md files can use it.</p>
          <CodeBlock className="[&_pre]:rounded-lg [&_pre]:bg-card [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-body-sm [&_pre]:text-fg">
            {"curl -LO https://ui.wixzel.com/wixzel-ui-skill.zip\nunzip wixzel-ui-skill.zip -d ~/.claude/skills"}
          </CodeBlock>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-2">
        <p className="text-body-sm font-semibold text-fg">Then ask, in your project</p>
        <CodeBlock className="[&_pre]:rounded-lg [&_pre]:bg-accent-subtle [&_pre]:p-4 [&_pre]:text-body-md [&_pre]:whitespace-pre-wrap [&_pre]:text-fg">
          Convert this project to Wixzel UI. Our brand colour is #E4572E.
        </CodeBlock>
      </div>
    </div>
  );
}
