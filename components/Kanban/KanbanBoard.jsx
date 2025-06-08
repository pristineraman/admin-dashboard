import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import "./KanbanBoard.css";
import FileUpload from "./FileUpload";

const KanbanBoard = () => {
  const [columns, setColumns] = useState({ todo: [], doing: [], done: [] });
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDetails, setNewTaskDetails] = useState({
    assignedTo: "",
    dueDate: "",
    priority: "normal",
    labels: "",
    checklist: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks").then((res) => {
      // Group tasks by status
      const grouped = { todo: [], doing: [], done: [] };
      res.data.forEach((task) => {
        if (grouped[task.status]) grouped[task.status].push(task);
      });
      setColumns(grouped);
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data));
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    const sourceCol = Array.from(columns[source.droppableId]);
    const [removed] = sourceCol.splice(source.index, 1);
    const destCol = Array.from(columns[destination.droppableId]);
    destCol.splice(destination.index, 0, removed);
    removed.status = destination.droppableId;
    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
    // Persist change to backend
    await axios.put(`http://localhost:5000/api/tasks/${removed._id}`, removed);
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const taskData = {
      content: newTask,
      status: "todo",
      assignedTo: newTaskDetails.assignedTo,
      dueDate: newTaskDetails.dueDate || undefined,
      priority: newTaskDetails.priority,
      labels: newTaskDetails.labels
        ? newTaskDetails.labels.split(",").map((l) => l.trim())
        : [],
      checklist: newTaskDetails.checklist
        ? newTaskDetails.checklist.split(";").map((item) => ({
            text: item.trim(),
            checked: false,
          }))
        : [],
    };
    const res = await axios.post("http://localhost:5000/api/tasks", taskData);
    setColumns((prev) => ({ ...prev, todo: [...prev.todo, res.data] }));
    setNewTask("");
    setNewTaskDetails({
      assignedTo: "",
      dueDate: "",
      priority: "normal",
      labels: "",
      checklist: "",
    });
  };

  const handleAttachmentUpload = (taskId, fileUrl) => {
    setColumns((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((col) => {
        updated[col] = updated[col].map((task) =>
          task._id === taskId
            ? { ...task, attachments: [...(task.attachments || []), fileUrl] }
            : task
        );
      });
      return updated;
    });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <select
          value={newTaskDetails.assignedTo}
          onChange={(e) =>
            setNewTaskDetails((d) => ({ ...d, assignedTo: e.target.value }))
          }
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="">Assign to</option>
          {users.map((u) => (
            <option key={u._id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTaskDetails.dueDate}
          onChange={(e) =>
            setNewTaskDetails((d) => ({ ...d, dueDate: e.target.value }))
          }
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <select
          value={newTaskDetails.priority}
          onChange={(e) =>
            setNewTaskDetails((d) => ({ ...d, priority: e.target.value }))
          }
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="normal">Normal</option>
          <option value="low">Low</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          value={newTaskDetails.labels}
          onChange={(e) =>
            setNewTaskDetails((d) => ({ ...d, labels: e.target.value }))
          }
          placeholder="Labels (comma separated)"
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 120,
          }}
        />
        <input
          type="text"
          value={newTaskDetails.checklist}
          onChange={(e) =>
            setNewTaskDetails((d) => ({ ...d, checklist: e.target.value }))
          }
          placeholder="Checklist (separate with ;)"
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 120,
          }}
        />
        <button
          onClick={handleAddTask}
          style={{
            padding: "10px 18px",
            background: "#3358e4",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Add Task
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 24 }}>
          {Object.entries(columns).map(([colId, tasks]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: "#f0f4f8",
                    padding: 16,
                    width: 280,
                    minHeight: 420,
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <h3
                    style={{
                      color: "#3358e4",
                      marginBottom: 16,
                    }}
                  >
                    {colId.toUpperCase()}
                  </h3>
                  {tasks.map((task, idx) => (
                    <Draggable
                      draggableId={task._id}
                      index={idx}
                      key={task._id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 16,
                            margin: "0 0 12px 0",
                            background: "#fff",
                            borderRadius: 8,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                            fontWeight: 500,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {task.content}
                          <div
                            style={{
                              fontSize: 13,
                              margin: "8px 0",
                              color: "#888",
                            }}
                          >
                            {task.assignedTo && (
                              <span>👤 {task.assignedTo} </span>
                            )}
                            {task.dueDate && (
                              <span>
                                📅 {new Date(task.dueDate).toLocaleDateString()}{" "}
                              </span>
                            )}
                            {task.priority && (
                              <span>
                                ⭐{" "}
                                {task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)}{" "}
                              </span>
                            )}
                            {task.labels && task.labels.length > 0 && (
                              <span>🏷️ {task.labels.join(", ")} </span>
                            )}
                          </div>
                          {task.checklist && task.checklist.length > 0 && (
                            <ul
                              style={{
                                margin: "8px 0",
                                paddingLeft: 18,
                                fontSize: 13,
                              }}
                            >
                              {task.checklist.map((item, i) => (
                                <li
                                  key={i}
                                  style={{
                                    textDecoration: item.checked
                                      ? "line-through"
                                      : "none",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.checked}
                                    readOnly
                                    style={{ marginRight: 6 }}
                                  />
                                  {item.text}
                                </li>
                              ))}
                            </ul>
                          )}
                          <FileUpload
                            taskId={task._id}
                            onUpload={(fileUrl) =>
                              handleAttachmentUpload(task._id, fileUrl)
                            }
                          />
                          {task.attachments && task.attachments.length > 0 && (
                            <ul style={{ marginTop: 8, fontSize: 13 }}>
                              {task.attachments.map((file, i) => (
                                <li key={i}>
                                  <a
                                    href={`http://localhost:5000${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Attachment {i + 1}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
