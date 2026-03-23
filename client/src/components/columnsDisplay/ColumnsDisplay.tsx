import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router";
import type { ITask } from "../../types/ITask";
import type { IColumn } from "../../types/Icolumn";
const API_URL = "http://localhost:3310/api";
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
                  className="bg-mist-800 rounded-lg p-3 m-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-row items-center justify-between"
                >
                  <h3 className="text-[1rem] font-semibold">
                    <span
                      className={
                        task.priority === "high"
                          ? "status status-error"
                          : task.priority === "medium"
                            ? "status status-warning"
                            : "status status-success"
                      }
                      title={task.priority}
                    />
                    &nbsp; {task.name}
                  </h3>
                  <input
                    type="checkbox"
                    id=""
                    className="checkbox checkbox-sm"
                  />
                </div>
              ))}
              <form
                hidden
                className="flex flex-row items-center gap-2 px-3 mt-3"
              >
                <input
                  type="text"
                  placeholder="Ajouter une tâche..."
                  className="input w-full mb-2 focus:outline-none"
                />
                <button type="submit">
                  <IoMdAdd size={35} />
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
