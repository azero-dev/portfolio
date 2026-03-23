'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  status: 'active' | 'archived';
  date: string;
}

interface ProjectsTabsProps {
  activeProjects: Project[];
  archivedProjects: Project[];
}

export function ProjectsTabs({ activeProjects, archivedProjects }: ProjectsTabsProps) {
  return (
    <Tabs defaultValue="active" className="max-w-5xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
        <TabsTrigger value="archived">Archived ({archivedProjects.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map((project) => (
            <Card key={project.id} className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="font-mono">{project.title}</CardTitle>
                <CardDescription>{project.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="archived">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedProjects.map((project) => (
            <Card key={project.id} className="border-border opacity-70">
              <CardHeader>
                <CardTitle className="font-mono">{project.title}</CardTitle>
                <CardDescription>{project.date} (Archived)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
