import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "main" | "concept" | "detail";
  x: number;
  y: number;
  connections: string[];
}

interface VisualConceptMapProps {
  nodes: Node[];
  onNodeClick?: (nodeId: string) => void;
}

export function VisualConceptMap({
  nodes,
  onNodeClick,
}: VisualConceptMapProps) {
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    onNodeClick?.(node.id);
  };

  const getNodeColor = (type: Node["type"]) => {
    switch (type) {
      case "main":
        return "bg-purple-600 dark:bg-purple-400";
      case "concept":
        return "bg-blue-600 dark:bg-blue-400";
      case "detail":
        return "bg-green-600 dark:bg-green-400";
      default:
        return "bg-gray-600 dark:bg-gray-400";
    }
  };

  const getNodeSize = (type: Node["type"]) => {
    switch (type) {
      case "main":
        return "w-32 h-32";
      case "concept":
        return "w-24 h-24";
      case "detail":
        return "w-20 h-20";
      default:
        return "w-16 h-16";
    }
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Concept Map */}
      <motion.div
        className="relative h-full w-full"
        drag
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          scale,
          x: position.x,
          y: position.y,
        }}
      >
        {/* Connections */}
        <svg className="absolute inset-0 h-full w-full">
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const targetNode = nodes.find((n) => n.id === targetId);
              if (!targetNode) return null;

              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-gray-300 dark:text-gray-700"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute ${getNodeSize(
              node.type
            )} -translate-x-1/2 -translate-y-1/2`}
            style={{ left: node.x, top: node.y }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`h-full w-full cursor-pointer transition-all ${getNodeColor(
                node.type
              )} ${
                selectedNode?.id === node.id
                  ? "ring-4 ring-purple-500 dark:ring-purple-400"
                  : "hover:ring-2 hover:ring-purple-500 dark:hover:ring-purple-400"
              }`}
              onClick={() => handleNodeClick(node)}
            >
              <div className="flex h-full items-center justify-center p-2 text-center text-white">
                <span className="text-sm font-medium">{node.label}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Selected Node Details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 z-10"
        >
          <Card className="p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{selectedNode.label}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Connected to:{" "}
                {selectedNode.connections
                  .map(
                    (id) => nodes.find((n) => n.id === id)?.label || "Unknown"
                  )
                  .join(", ")}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
