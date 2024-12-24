"use client";

import React, { useState, useEffect } from "react";

import LessonType1 from "../components/LessonType1";
import LessonType2 from "../components/LessonType2";
import LessonTree from "../components/LessonTree";
import LessonActions from "../components/LessonActions";
import LessonForm from "../components/LessonForm";

export default function Page() {
  const [treeData, setTreeData] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [showForm, setShowForm] = useState(false);
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonType, setLessonType] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [englishWord, setEnglishWord] = useState("");
  const [otherLanguageWord, setOtherLanguageWord] = useState("");
  const [displayLesson, setDisplayLesson] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/getTreeData")
      .then((response) => response.json())
      .then((data) => setTreeData(data));
  }, []);

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
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const treeDataCopy = JSON.parse(JSON.stringify(treeData));

    const englishWordArray = englishWord.split(",");
    const otherLanguageWordArray = otherLanguageWord.split(",");

    if (englishWordArray.length !== otherLanguageWordArray.length) {
      alert("Amount of English words must be equal to other language words.");
      return;
    }

    if (isEditing) {
      // Modyfikacja istniejącej lekcji

      const updatedLesson = {
        ...selectedNode,
        name: lessonName,
        attributes: {
          ...selectedNode.attributes,
          description: lessonDescription,
          type: lessonType,
          words: englishWordArray.map((word, index) => ({
            en: word,
            other: otherLanguageWordArray[index],
          })),
        },
      };

      const updateNodeById = (node, id, updatedNode) => {
        if (node.attributes.id === id) {
          return updatedNode;
        }

        if (node.children) {
          node.children = node.children.map((child) =>
            updateNodeById(child, id, updatedNode)
          );
        }

        return node;
      };

      const updatedTreeData = updateNodeById(
        treeDataCopy,
        selectedNode.attributes.id,
        updatedLesson
      );
      setTreeData(updatedTreeData);
      setSelectedNode(updatedLesson);
      saveTreeData(updatedTreeData);
    } else {
      // Dodanie nowej lekcji
      const newLesson = {
        name: lessonName,
        attributes: {
          id: `lesson${treeDataCopy.children.length + 1}`,
          description: lessonDescription,
          type: lessonType,
          words: englishWordArray.map((word, index) => ({
            en: word,
            other: otherLanguageWordArray[index],
          })),
        },
      };

      const updatedTreeData = {
        ...treeDataCopy,
        children: [...treeDataCopy.children, newLesson],
      };
      setTreeData(updatedTreeData);
      saveTreeData(updatedTreeData);
    }

    setShowForm(false);
    setIsEditing(false);
    setLessonName("");
    setLessonDescription("");
    setEnglishWord("");
    setOtherLanguageWord("");
  };

  const handleNodeClick = (nodeData) => {
    console.log("nodeData", nodeData);
    console.log("type", nodeData.data.attributes.type);
    setSelectedNode(nodeData.data);
  };

  const handleDeleteNode = () => {
    const deleteNodeById = (node, id) => {
      if (!node.children) return node;

      node.children = node.children
        .filter((child) => child.attributes.id !== id)
        .map((child) => deleteNodeById(child, id));

      return node;
    };

    if (!selectedNode) {
      alert("Didn't select any lesson to delete!");
      return;
    }

    if (selectedNode.attributes.id === "root") {
      alert("You cannot delete the root");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete this lesson: "${selectedNode.name}"?`
      )
    ) {
      const treeDataCopy = JSON.parse(JSON.stringify(treeData));
      const updatedTreeData = deleteNodeById(
        treeDataCopy,
        selectedNode.attributes.id
      );
      setTreeData(updatedTreeData);
      setSelectedNode(null);

      saveTreeData(updatedTreeData);
    }
  };

  const handleModifyLesson = () => {
    if (!selectedNode) {
      alert("Didn't select any lesson to modify!");
      return;
    }

    setLessonName(selectedNode.name);
    setLessonDescription(selectedNode.attributes.description || "");
    if (
      selectedNode.attributes.words &&
      selectedNode.attributes.words.length > 0
    ) {
      setEnglishWord(
        selectedNode.attributes.words.map((word) => word.en).join(",") || ""
      );
      setOtherLanguageWord(
        selectedNode.attributes.words.map((word) => word.other).join(",") || ""
      );
    } else {
      setEnglishWord("");
      setOtherLanguageWord("");
    }
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancelChanges = () => {
    setShowForm(false);
    setIsEditing(false);
    setLessonName("");
    setLessonDescription("");
    setEnglishWord("");
    setOtherLanguageWord("");
  };

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
      <circle r={15} fill="lightblue" />
    </g>
  );

  const saveTreeData = (data) => {
    fetch("/api/saveTreeData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const handleViewLesson = () => {
    setDisplayLesson(!displayLesson);
  };

  if (!treeData) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen flex flex-col">
      <LessonActions
        setIsEditing={setIsEditing}
        handleAddLesson={handleAddLesson}
        handleDeleteNode={handleDeleteNode}
        handleModifyLesson={handleModifyLesson}
      />
      {selectedNode && (
        <div>
          <p className="mt-2">Selected node: {selectedNode.name}</p>
          <p>Description: {selectedNode.attributes.description}</p>
          <button
            onClick={handleViewLesson}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Let's learn!
          </button>
        </div>
      )}
      {showForm && (
        <LessonForm
          lessonName={lessonName}
          lessonDescription={lessonDescription}
          lessonType={lessonType}
          englishWord={englishWord}
          otherLanguageWord={otherLanguageWord}
          setLessonName={setLessonName}
          setLessonDescription={setLessonDescription}
          setLessonType={setLessonType}
          setEnglishWord={setEnglishWord}
          setOtherLanguageWord={setOtherLanguageWord}
          handleSubmit={handleSubmit}
          handleCancelChanges={handleCancelChanges}
          isEditing={isEditing}
          m
        />
      )}
      {displayLesson && selectedNode.attributes.type == "1" && (
        <LessonType1 lessonData={selectedNode} onBack={handleViewLesson} />
      )}
      {displayLesson && selectedNode.attributes.type == "2" && (
        <LessonType2 lessonData={selectedNode} onBack={handleViewLesson} />
      )}
      <LessonTree
        treeData={treeData}
        dimensions={dimensions}
        handleNodeClick={handleNodeClick}
        renderCustomNode={renderCustomNode}
      />
    </div>
  );
}
