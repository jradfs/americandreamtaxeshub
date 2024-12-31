import { useMemo } from 'react';
import { Graph } from 'react-d3-graph';

interface TaskDependencyGraphProps {
  tasks: {
    id: string;
    name: string;
    dependencies: string[];
  }[];
}

export function TaskDependencyGraph({ tasks }: TaskDependencyGraphProps) {
  const graphData = useMemo(() => {
    const nodes = tasks.map(task => ({
      id: task.id,
      name: task.name
    }));

    const links = tasks.flatMap(task =>
      task.dependencies.map(dependencyId => ({
        source: task.id,
        target: dependencyId
      }))
    );

    return { nodes, links };
  }, [tasks]);

  const config = {
    nodeHighlightBehavior: true,
    node: {
      color: '#6366f1',
      size: 120,
      highlightStrokeColor: 'blue'
    },
    link: {
      highlightColor: 'lightblue'
    }
  };

  return (
    <div className="h-[500px] border rounded-lg">
      <Graph
        id="task-dependency-graph"
        data={graphData}
        config={config}
      />
    </div>
  );
}