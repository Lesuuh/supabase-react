import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import type { Session } from "@supabase/supabase-js";

interface Task {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const TaskManager = ({ session }: { session: Session }) => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [taskImage, setTaskImage] = useState<File | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    // create a custom file path
    const filePath = `${file.name}-${Date.now()}`;
    const { error } = await supabase.storage
      .from("task-images")
      .upload(filePath, file);

    if (error) {
      console.log("Error uploading image", error.message);
      return null;
    }
    const { data } = await supabase.storage
      .from("task-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let image_url: string | null = null;
    if (taskImage) {
      image_url = await uploadImage(taskImage);
    }
    const { error } = await supabase
      .from("tasks")
      .insert({ ...newTask, email: session.user.email, image_url })
      .select()
      .single();
    if (error) {
      console.error("Error adding task:", error?.message);
    }
    setNewTask({ title: "", description: "" });
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.log("An error happened when fetching the data", error.message);
      return;
    }
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //   real time communication
  useEffect(() => {
    const channel = supabase.channel("task-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks" },
        (payload) => {
          const newTask = payload.new as Task;
          setTasks((prev) => [...prev, newTask]);
        }
      )
      .subscribe((status) => {
        console.log("Subscription:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteTask = async (id: number) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((task) => task.id !== id));
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.log("Error deleting Task");
      setTasks(previousTasks);
    }
  };

  const updateTask = async (id: number) => {
    const previousTask = tasks.find((task) => task.id === id);
    if (!previousTask) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, description: newDescription } : task
      )
    );

    setIsEdit(false);
    if (!newDescription.trim()) return;
    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id);
    if (error) {
      console.log("Error updating Task");
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id && previousTask ? previousTask : task
        )
      );
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  return (
    <>
      <div>
        <h2>Task Manager CRUD</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            name="description"
            placeholder="Task Description"
            rows={2}
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit">Add Task</button>
        </form>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks?.map((task, key) => (
            <li
              key={key}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
            >
              <h1>{task.title}</h1>
              <p>{task.description}</p>
              {isEdit && (
                <textarea
                  placeholder="Updated description..."
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              )}
              <img src={task.image_url} />
              <div
                style={{
                  display: "flex",
                  flexFlow: "row",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                {!isEdit ? (
                  <button onClick={() => setIsEdit(true)}>Edit</button>
                ) : (
                  <button onClick={() => updateTask(task.id)}>Save</button>
                )}
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TaskManager;
