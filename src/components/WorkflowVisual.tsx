"use client";

import React, { useMemo } from "react";

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  [key: string]: unknown;
}

interface ConnectionTarget {
  node: string;
  type: string;
  index: number;
}

interface WorkflowConnections {
  [nodeName: string]: {
    main?: ConnectionTarget[][];
  };
}

interface WorkflowVisualProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
}

function getNodeIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("scheduletrigger")) return "⏰";
  if (t.includes("salesforce") || t.includes("hubspot")) return "🔗";
  if (t.includes("code")) return "💻";
  if (t.includes(".if")) return "❓";
  if (t.includes("slack")) return "💬";
  if (t.includes("emailsend") || t.includes("smtp")) return "📧";
  if (t.includes("openai")) return "🤖";
  if (t.includes("stickynote")) return "📋";
  if (t.includes("trigger") && !t.includes("scheduletrigger")) return "🔔";
  if (t.includes("merge")) return "⚡";
  return "⚙️";
}

function getNodeColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("scheduletrigger") || t.includes("trigger")) return "#1e3a5f";
  if (t.includes("salesforce")) return "#0070d2";
  if (t.includes("hubspot")) return "#ff7a59";
  if (t.includes("slack")) return "#4a154b";
  if (t.includes("code")) return "#1e4d2b";
  if (t.includes(".if")) return "#3d2b1e";
  if (t.includes("emailsend") || t.includes("smtp")) return "#1e2d4d";
  if (t.includes("openai")) return "#1a2e1a";
  if (t.includes("merge")) return "#2d1e3d";
  return "#1e2640";
}

function getShortType(type: string): string {
  const parts = type.split(".");
  const last = parts[parts.length - 1];
  // camelCase to words
  return last
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const NODE_W = 160;
const NODE_H = 64;
const PAD = 40;

export default function WorkflowVisual({ nodes, connections }: WorkflowVisualProps) {
  // Separate sticky notes from flow nodes
  const stickyNotes = useMemo(
    () => nodes.filter((n) => n.type.includes("stickyNote")),
    [nodes]
  );
  const flowNodes = useMemo(
    () => nodes.filter((n) => !n.type.includes("stickyNote")),
    [nodes]
  );

  // Build node map by name for connection lookup
  const nodeByName = useMemo(() => {
    const map: Record<string, WorkflowNode> = {};
    flowNodes.forEach((n) => {
      map[n.name] = n;
    });
    return map;
  }, [flowNodes]);

  // Compute bounding box from flow node positions
  const { minX, minY, maxX, maxY } = useMemo(() => {
    if (flowNodes.length === 0) return { minX: 0, minY: 0, maxX: 600, maxY: 200 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    flowNodes.forEach((n) => {
      minX = Math.min(minX, n.position[0]);
      minY = Math.min(minY, n.position[1]);
      maxX = Math.max(maxX, n.position[0] + NODE_W);
      maxY = Math.max(maxY, n.position[1] + NODE_H);
    });
    return { minX, minY, maxX, maxY };
  }, [flowNodes]);

  const offsetX = -minX + PAD;
  const offsetY = -minY + PAD;
  const svgWidth = maxX - minX + PAD * 2;
  const svgHeight = maxY - minY + PAD * 2;

  // Build edge list from connections
  const edges = useMemo(() => {
    const result: { from: WorkflowNode; to: WorkflowNode; branch: number }[] = [];
    Object.entries(connections).forEach(([fromName, conn]) => {
      const fromNode = nodeByName[fromName];
      if (!fromNode) return;
      const mainOutputs = conn.main || [];
      mainOutputs.forEach((outputBranch, branchIdx) => {
        if (!outputBranch) return;
        outputBranch.forEach((target) => {
          const toNode = nodeByName[target.node];
          if (!toNode) return;
          result.push({ from: fromNode, to: toNode, branch: branchIdx });
        });
      });
    });
    return result;
  }, [connections, nodeByName]);

  const branchColors = ["#38bdf8", "#a78bfa", "#f472b6", "#34d399"];

  if (flowNodes.length === 0) {
    return (
      <div className="text-muted text-sm italic py-4">
        No workflow nodes to display.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0d1526]">
      {stickyNotes.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border-b border-white/10">
          {stickyNotes.map((note) => {
            const content = (note.parameters as Record<string, unknown>)?.content as string || "";
            // Extract first line as title
            const firstLine = content.split("\n")[0].replace(/^#+\s*/, "").substring(0, 60);
            return (
              <div
                key={note.id}
                className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-300 max-w-xs"
                title={content}
              >
                <span>📋</span>
                <span>{firstLine}</span>
              </div>
            );
          })}
        </div>
      )}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="block"
        style={{ minWidth: svgWidth }}
      >
        {/* Arrow marker definitions */}
        <defs>
          {branchColors.map((color, i) => (
            <marker
              key={i}
              id={`arrow-${i}`}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const fromX = edge.from.position[0] + offsetX + NODE_W;
          const fromY = edge.from.position[1] + offsetY + NODE_H / 2;
          const toX = edge.to.position[0] + offsetX;
          const toY = edge.to.position[1] + offsetY + NODE_H / 2;
          const midX = (fromX + toX) / 2;
          const color = branchColors[edge.branch % branchColors.length];
          const markerId = `arrow-${edge.branch % branchColors.length}`;

          // Elbow connector: fromX → midX → toX
          const pathD = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

          return (
            <path
              key={i}
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity="0.8"
              markerEnd={`url(#${markerId})`}
            />
          );
        })}

        {/* Nodes */}
        {flowNodes.map((node) => {
          const x = node.position[0] + offsetX;
          const y = node.position[1] + offsetY;
          const icon = getNodeIcon(node.type);
          const bgColor = getNodeColor(node.type);
          const shortType = getShortType(node.type);
          const label = node.name.length > 22 ? node.name.substring(0, 20) + "…" : node.name;

          return (
            <g key={node.id}>
              {/* Node background */}
              <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx="8"
                ry="8"
                fill={bgColor}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              {/* Icon */}
              <text
                x={x + 14}
                y={y + NODE_H / 2 + 5}
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {icon}
              </text>
              {/* Node name */}
              <text
                x={x + 26}
                y={y + NODE_H / 2 - 7}
                fontSize="11"
                fill="rgba(255,255,255,0.95)"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {label}
              </text>
              {/* Node type */}
              <text
                x={x + 26}
                y={y + NODE_H / 2 + 9}
                fontSize="9"
                fill="rgba(255,255,255,0.45)"
                fontFamily="system-ui, sans-serif"
              >
                {shortType}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
