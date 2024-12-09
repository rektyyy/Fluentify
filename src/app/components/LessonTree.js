// components/LessonTree.js
import dynamic from "next/dynamic";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

const LessonTree = ({
  treeData,
  dimensions,
  handleNodeClick,
  renderCustomNode,
}) => (
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

export default LessonTree;
