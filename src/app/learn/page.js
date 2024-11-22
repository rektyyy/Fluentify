"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

const initialTreeData = {
  name: "Lekcje",
  attributes: { id: "root" },
  children: [
    {
      name: "Lekcja 1",
      attributes: {
        id: "lesson1",
        description: "Opis lekcji 1",
      },
    },
    {
      name: "Lekcja 2",
      attributes: {
        id: "lesson2",
        description: "Opis lekcji 2",
      },
      children: [
        {
          name: "Lekcja 2.1",
          attributes: {
            id: "lesson2.1",
            description: "Opis lekcji 2.1",
          },
        },
        {
          name: "Lekcja 2.2",
          attributes: {
            id: "lesson2.2",
            description: "Opis lekcji 2.2",
          },
        },
      ],
    },
    {
      name: "Lekcja 3",
      attributes: {
        id: "lesson3",
        description: "Opis lekcji 3",
      },
    },
  ],
};

export default function Page() {
  const [treeData, setTreeData] = useState(initialTreeData);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [showForm, setShowForm] = useState(false);
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleAddLesson = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLesson = {
      name: lessonName,
      attributes: {
        id: lessonName.toLowerCase().replace(/ /g, ""),
        description: lessonDescription,
      },
    };

    const addChildToNode = (node) => {
      if (!node.attributes) node.attributes = {};
      const nodeId = node.attributes.id;
      const selectedNodeId =
        selectedNode && selectedNode.attributes
          ? selectedNode.attributes.id
          : null;

      if (nodeId === selectedNodeId) {
        return {
          ...node,
          children: node.children ? [...node.children, newLesson] : [newLesson],
        };
      } else if (node.children) {
        return {
          ...node,
          children: node.children.map(addChildToNode),
        };
      } else {
        return node;
      }
    };

    setTreeData((prevTreeData) => {
      if (selectedNode) {
        const newTreeData = addChildToNode(prevTreeData);
        return newTreeData;
      } else {
        return {
          ...prevTreeData,
          children: prevTreeData.children
            ? [...prevTreeData.children, newLesson]
            : [newLesson],
        };
      }
    });

    setLessonName("");
    setLessonDescription("");
    setShowForm(false);
    setSelectedNode(null);
  };

  const onNodeClick = (nodeData) => {
    setSelectedNode(nodeData.data);
  };
  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <text fill="black" x="0" y="-20" textAnchor="middle">
        {nodeDatum.name}
      </text>
      {/* Rysuj wierzchołek */}
      <circle r={15} fill="lightblue" onClick={toggleNode} />
    </g>
  );
  return (
    <div className="w-full h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Lekcje</h1>
      <button
        onClick={handleAddLesson}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Dodaj lekcję
      </button>

      {selectedNode && (
        <p className="mt-2">Wybrany wierzchołek: {selectedNode.name}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block mb-2">
            Nazwa lekcji:
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </label>
          <label className="block mb-2">
            Opis lekcji:
            <textarea
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              className="border p-2 w-full"
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Dodaj
          </button>
        </form>
      )}

      <div style={{ height: "100vh" }}>
        <Tree
          data={treeData}
          translate={{ x: dimensions.width / 2, y: dimensions.height / 4 }}
          orientation="vertical"
          onNodeClick={onNodeClick}
          collapsible={false}
          zoomable={true}
          scaleExtent={{ min: 0.1, max: 2 }}
          separation={{ siblings: 0.5 }}
          renderCustomNodeElement={renderCustomNode}
        />
      </div>
    </div>
  );
}
