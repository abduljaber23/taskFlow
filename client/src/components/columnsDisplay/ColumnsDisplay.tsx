import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router";
import { API_URL } from "../../constants/api";
import type { ITask } from "../../types/ITask";
import type { IColumn } from "../../types/Icolumn";
export default function ColumnsDisplay() {
  const { uuid } = useParams();

  const [columns, setColumns] = useState<IColumn[]>([]);
  const [tasks, setTasks] = useState<Record<string, ITask[]>>({});
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await fetch(`${API_URL}/columns/project/${uuid}`, {
          credentials: "include",
        });
        const data = await res.json();
        setColumns(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchColumns();
  }, [uuid]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksByColumn: Record<string, ITask[]> = {};

        await Promise.all(
          columns.map(async (column) => {
            const res = await fetch(`${API_URL}/tasks/column/${column.uuid}`, {
              credentials: "include",
            });
            const data = await res.json();

            tasksByColumn[column.uuid] = Array.isArray(data) ? data : [];
          }),
        );

        setTasks(tasksByColumn);
      } catch (err) {
        console.error("Erreur lors du chargement des tâches :", err);
      }
    };

    if (columns.length > 0) {
      fetchTasks();
    }
  }, [columns]);

  const deleteColumn = async (uuid: string) => {
    try {
      await fetch(`${API_URL}/columns/${uuid}`, {
        method: "DELETE",
        credentials: "include",
      });

      setColumns((prev) =>
        prev.filter((column: IColumn) => column.uuid !== uuid),
      );
    } catch (err) {
      console.log(err);
    }
  };

  function showInput(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const button = e.currentTarget;
    const input = button.previousElementSibling as HTMLInputElement;
    if (input) {
      input.hidden = !input.hidden;
      if (!input.hidden) {
        input.focus();
      }
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    projectUuid: uuid || "",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name) return;

    try {
      await fetch(`${API_URL}/columns`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const res = await fetch(`${API_URL}/columns/project/${uuid}`, {
        credentials: "include",
      });
      const data = await res.json();
      setColumns(data);

      setFormData({ name: "", projectUuid: uuid || "" });
    } catch (err) {
      console.log(err);
    }
  };

  const [taskFormData, setTaskFormData] = useState({
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    columnUuid: "",
  });

  const handleTaskChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setTaskFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    columnUuid: string,
  ) => {
    event.preventDefault();
    if (!taskFormData.content) return;

    try {
      const payload = { ...taskFormData, columnUuid };

      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await fetch(`${API_URL}/tasks/column/${columnUuid}`, {
        credentials: "include",
      });
      const data = await res.json();

      setTasks((prev) => ({
        ...prev,
        [columnUuid]: Array.isArray(data) ? data : [],
      }));

      setTaskFormData({ content: "", priority: "medium", columnUuid: "" });

      (event.target as HTMLFormElement).hidden = true;
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = async (taskUuid: string) => {
    try {
      await fetch(`${API_URL}/tasks/${taskUuid}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });

      const columnUuid = Object.keys(tasks).find((key) =>
        tasks[key].some((task) => task.uuid === taskUuid),
      );

      if (columnUuid) {
        const res = await fetch(`${API_URL}/tasks/column/${columnUuid}`, {
          credentials: "include",
        });
        const data = await res.json();

        setTasks((prev) => ({
          ...prev,
          [columnUuid]: Array.isArray(data) ? data : [],
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (uuid: string) => {
    try {
      await fetch(`${API_URL}/tasks/${uuid}`, {
        method: "DELETE",
        credentials: "include",
      });

      const columnUuid = Object.keys(tasks).find((key) =>
        tasks[key].some((task) => task.uuid === uuid),
      );

      if (columnUuid) {
        setTasks((prev) => ({
          ...prev,
          [columnUuid]: prev[columnUuid].filter((t) => t.uuid !== uuid),
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-row gap-5 overflow-x-auto items-start">
      {
        <div className="flex flex-row flex-nowrap gap-5 overflow-x-auto items-start">
          {columns.map((column: IColumn) => (
            <div
              key={column.uuid}
              className="bg-mist-950 border border-base-200 rounded-2xl shadow-sm duration-200 w-75 shrink-0 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex flex-row items-center justify-between px-3 sticky top-0 bg-mist-950 z-10">
                <h2 className="py-3 pl-25 text-lg font-semibold ">
                  {column.name}
                </h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                  onClick={() => deleteColumn(column.uuid)}
                >
                  <FaTrash size={14} />
                </button>
              </div>
              {tasks[column.uuid]?.map((task: ITask) => (
                <div
                  key={task.uuid}
                  className="flex items-center justify-between p-3 m-3 rounded-lg bg-mist-800 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`status ${
                        task.priority === "high"
                          ? "status-error"
                          : task.priority === "medium"
                            ? "status-warning"
                            : "status-success"
                      }`}
                      title={`Priority: ${task.priority}`}
                    />
                    <h3 className="text-sm font-semibold">{task.content}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      onChange={() => isCompleted(task.uuid)}
                      checked={task.isCompleted}
                      aria-label="Mark task as completed"
                    />

                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      onClick={() => deleteTask(task.uuid)}
                      aria-label="Delete task"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <form
                onSubmit={(e) => handleTaskSubmit(e, column.uuid)}
                hidden
                className="flex flex-col gap-2 px-3 mt-3"
              >
                <input
                  name="content"
                  value={taskFormData.content}
                  onChange={handleTaskChange}
                  type="text"
                  placeholder="Ajouter une tâche..."
                  className="input input-sm w-full focus:outline-none"
                />

                <select
                  name="priority"
                  value={taskFormData.priority}
                  onChange={handleTaskChange}
                  className="select select-sm w-full focus:outline-none"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>

                <button
                  type="submit"
                  className="btn btn-sm btn-primary w-full flex items-center justify-center gap-1"
                >
                  <IoMdAdd size={18} />
                  Ajouter
                </button>
              </form>
              <button
                type="button"
                className="btn btn-soft btn-lg bg-mist-950 border-none w-full sticky bottom-0 text-sm py-5  hover:bg-mist-800
             focus:outline-none focus:ring-0 active:translate-x-0 active:translate-y-0 active:scale-100"
                onClick={showInput}
              >
                + Ajouter une tâche
              </button>
            </div>
          ))}
        </div>
      }
      <div className="flex flex-col">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ajouter une liste..."
            className="input w-full mb-3 focus:outline-none"
          />
          <button
            type="submit"
            className="btn btn-soft btn-lg bg-mist-950 border-none w-full sticky bottom-0 text-sm py-5  hover:bg-mist-800
             focus:outline-none focus:ring-0 active:translate-x-0 active:translate-y-0 active:scale-100"
          >
            + Ajouter une liste
          </button>
        </form>
      </div>
    </div>
  );
}
