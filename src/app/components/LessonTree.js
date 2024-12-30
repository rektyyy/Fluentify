import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function LessonTree({ treeData, dimensions, handleNodeClick }) {
  // Track current theme from HTML element
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  // Render the custom node, coloring the circle based on theme + node data
  const renderCustomNode = ({ nodeDatum, toggleNode, handleNodeClick }) => {
    // Decide circle color based on 'finished' attribute
    const circleClass = nodeDatum.attributes.finished
      ? "fill-success"
      : "fill-primary";

    return (
      <g
        onClick={() => {
          toggleNode();
          handleNodeClick({ data: nodeDatum });
        }}
      >
        {/* Use DaisyUI's 'text-base-content' so the color auto-adjusts with theme */}
        <text
          className="text-base-content text-center text-sm font-normal"
          x="0"
          y="-20"
          textAnchor="middle"
        >
          {nodeDatum.name}
        </text>
        {/* Use DaisyUI classes for circle fill */}
        <circle r="15" className={circleClass} />
      </g>
    );
  };

  return (
    <Tree
      data={treeData}
      translate={{ x: 50, y: dimensions.height / 4 }}
      orientation="horizontal"
      onNodeClick={handleNodeClick}
      collapsible={false}
      zoomable={false}
      scaleExtent={{ min: 0.1, max: 2 }}
      separation={{ siblings: 0.5 }}
      // Style links based on current theme
      pathFunc="diagonal" // or "step" / "straight"
      styles={{
        links: {
          stroke: theme === "dark" ? "#ffffff" : "#333333",
          strokeWidth: 5,
        },
      }}
      renderCustomNodeElement={(rd3tProps) =>
        renderCustomNode({
          ...rd3tProps,
          handleNodeClick,
        })
      }
    />
  );
}
