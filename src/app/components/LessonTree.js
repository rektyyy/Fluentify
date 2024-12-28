import dynamic from "next/dynamic";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function LessonTree({ treeData, dimensions, handleNodeClick }) {
  const renderCustomNode = ({ nodeDatum, toggleNode, handleNodeClick }) => (
    <g
      onClick={() => {
        toggleNode();
        handleNodeClick({ data: nodeDatum });
      }}
    >
      <text fill="black" x="0" y="-20" textAnchor="middle">
        {nodeDatum.name}
      </text>
      <circle
        r={15}
        fill={nodeDatum.attributes.finished ? "lightgreen" : "lightblue"}
      />
    </g>
  );

  return (
    <div style={{ height: "100vh" }}>
      <Tree
        data={treeData}
        translate={{ x: dimensions.width / 2, y: dimensions.height / 4 }}
        orientation="vertical"
        onNodeClick={handleNodeClick}
        collapsible={false}
        zoomable={false}
        scaleExtent={{ min: 0.1, max: 2 }}
        separation={{ siblings: 0.5 }}
        renderCustomNodeElement={(rd3tProps) =>
          renderCustomNode({ ...rd3tProps, handleNodeClick })
        }
      />
    </div>
  );
}
