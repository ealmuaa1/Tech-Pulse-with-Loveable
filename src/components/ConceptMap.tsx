import { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";

interface ConceptNode {
  id: string;
  label: string;
  type: "main" | "sub" | "detail";
  description?: string;
}

interface ConceptMapProps {
  nodes: ConceptNode[];
  onNodeClick?: (nodeId: string) => void;
}

const nodeTypes = {
  main: {
    style: {
      background: "linear-gradient(to right, #4f46e5, #7c3aed)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: "bold",
    },
  },
  sub: {
    style: {
      background: "linear-gradient(to right, #3b82f6, #60a5fa)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "10px 16px",
      fontSize: "14px",
    },
  },
  detail: {
    style: {
      background: "white",
      color: "#1f2937",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      padding: "8px 12px",
      fontSize: "12px",
    },
  },
};

export function ConceptMap({ nodes, onNodeClick }: ConceptMapProps) {
  // Convert concept nodes to ReactFlow nodes
  const initialNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    data: { label: node.label, description: node.description },
    position: { x: 0, y: 0 }, // Will be calculated by layout
    type: node.type,
    style: nodeTypes[node.type].style,
  }));

  // Generate edges based on node hierarchy
  const initialEdges: Edge[] = nodes
    .filter((node) => node.type !== "main")
    .map((node) => {
      const parentNode = nodes.find(
        (n) =>
          n.type === (node.type === "detail" ? "sub" : "main") &&
          n.id !== node.id
      );
      return {
        id: `${parentNode?.id}-${node.id}`,
        source: parentNode?.id || "",
        target: node.id,
        animated: true,
        style: { stroke: "#94a3b8" },
      };
    });

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  return (
    <Card className="h-[600px] w-full">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Card>
  );
}
