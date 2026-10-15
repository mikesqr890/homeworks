
import { useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { FileTree } from "../models/FileTree";
import {
  saveNode,
  getUserNodes,
  deleteSavedNode
} from "../services/fileService";

export default function Files() {
  const { user, logout } = useAuth();

  const [tree] = useState(
    () => new FileTree(user.email, user.uid)
  );

  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [, setUpdate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = () => {
    setUpdate((value) => value + 1);
  };

  useEffect(() => {
    let active = true;

    async function loadFiles() {
      try {
        setLoading(true);
        setError("");

        const nodes = await getUserNodes(user.uid);

        if (active) {
          tree.loadNodes(nodes);
          refresh();
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setError("No se pudieron cargar los archivos.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFiles();

    return () => {
      active = false;
    };
  }, [tree, user.uid]);

  const currentFolder = tree.findNode(currentFolderId);

  const addFolder = async () => {
    const name = prompt("Nombre de la carpeta:");

    if (!name || !name.trim()) return;

    let folder;

    try {
      setError("");

      folder = tree.addFolder(
        currentFolderId,
        name.trim(),
        user.email
      );

      await saveNode(folder);
      refresh();
    } catch (error) {
      if (folder) {
        tree.removeNode(folder.id);
      }

      console.error(error);
      setError("No se pudo guardar la carpeta.");
      refresh();
    }
  };

  const addFile = async () => {
    const name = prompt("Nombre del archivo:");

    if (!name || !name.trim()) return;

    let file;

    try {
      setError("");

      file = tree.addFile(
        currentFolderId,
        name.trim(),
        user.email
      );

      await saveNode(file);
      refresh();
    } catch (error) {
      if (file) {
        tree.removeNode(file.id);
      }

      console.error(error);
      setError("No se pudo guardar el archivo.");
      refresh();
    }
  };

  const deleteNode = async (node) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este elemento y todo su contenido?"
    );

    if (!confirmed) return;

    try {
      setError("");

      // Obtener todos los elementos que se eliminarán.
      const collectIds = (item) => [
        item.id,
        ...item.children.flatMap(collectIds)
      ];

      const ids = collectIds(node);

      // Eliminar los documentos de Firebase.
      for (const id of ids) {
        await deleteSavedNode(id);
      }

      // Eliminar la rama del árbol local.
      tree.removeNode(node.id);
      refresh();
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo completar la eliminación. Recarga la página para consultar los datos guardados."
      );
    }
  };

  const goBack = () => {
    if (currentFolder?.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    }
  };

  if (loading) {
    return <p>Cargando tus archivos...</p>;
  }

  if (!currentFolder) {
    return (
      <div className="files-container">
        <p>La carpeta seleccionada ya no existe.</p>
        <button onClick={() => setCurrentFolderId("root")}>
          Ir a Mis archivos
        </button>
      </div>
    );
  }

  return (
    <div className="files-container">
      <header className="files-header">
        <div>
          <h1>Gestor de archivos</h1>
          <p>Sesión: {user.email}</p>
        </div>

        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <div className="files-actions">
        <button onClick={addFolder}>📁 Crear carpeta</button>
        <button onClick={addFile}>📄 Crear archivo</button>

        {currentFolderId !== "root" && (
          <button onClick={goBack}>⬅️ Volver</button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <section className="folder-content">
        <h2>📂 {currentFolder.name}</h2>

        {currentFolder.children.length === 0 ? (
          <p>Esta carpeta está vacía.</p>
        ) : (
          <div className="file-list">
            {currentFolder.children.map((node) => (
              <div className="file-item" key={node.id}>
                <button
                  className="file-name"
                  disabled={node.type === "file"}
                  onClick={() => {
                    if (node.type === "folder") {
                      setCurrentFolderId(node.id);
                    }
                  }}
                >
                  {node.type === "folder" ? "📁" : "📄"}{" "}
                  {node.name}
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteNode(node)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
