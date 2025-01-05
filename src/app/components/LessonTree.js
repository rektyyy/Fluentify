import dynamic from "next/dynamic";
import "../styles/custom-tree.css";
const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function LessonTree({ treeData, dimensions, handleNodeClick }) {
  const renderCustomNode = ({ nodeDatum, toggleNode, handleNodeClick }) => {
    const circleClass = nodeDatum.attributes.finished
      ? "fill-success"
      : "fill-info";

    return (
      <g
        className="bg-base-100"
        onClick={() => {
          toggleNode();
          handleNodeClick({ data: nodeDatum });
        }}
      >
        <text
          strokeWidth="0"
          x="0"
          y="-25"
          textAnchor="middle"
          fill="currentColor"
          fontWeight="bold"
        >
          {nodeDatum.name}
        </text>
        <circle
          r="20"
          className={circleClass}
          strokeWidth="1"
          stroke="currentColor"
        />
      </g>
    );
  };

  return (
    <Tree
      data={treeData}
      translate={{ x: 50, y: dimensions.height / 3 }}
      orientation="horizontal"
      onNodeClick={handleNodeClick}
      collapsible={true}
      zoomable={false}
      scaleExtent={{ min: 0.1, max: 2 }}
      separation={{ siblings: 0.7 }}
      pathFunc="diagonal"
      renderCustomNodeElement={(rd3tProps) =>
        renderCustomNode({
          ...rd3tProps,
          handleNodeClick,
        })
      }
      pathClassFunc={() => "custom-link"}
    />
  );
}
