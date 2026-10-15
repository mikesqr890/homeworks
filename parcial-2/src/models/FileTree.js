
import { TreeNode } from "./TreeNode";

export class FileTree {
  constructor(ownerEmail, ownerUid) {
    this.ownerEmail = ownerEmail;
    this.ownerUid = ownerUid;

    this.root = new TreeNode(
      "root",
      "Mis archivos",
      "folder",
      ownerEmail,
      null,
      ownerUid
    );
  }

  findNode(nodeId, currentNode = this.root) {
    if (currentNode.id === nodeId) {
      return currentNode;
    }

    for (const child of currentNode.children) {
      const found = this.findNode(nodeId, child);

      if (found) {
        return found;
      }
    }

    return null;
  }

  addFolder(parentId, name, ownerEmail) {
    const parent = this.findNode(parentId);

    if (!parent) {
      throw new Error("La carpeta padre no existe.");
    }

    if (parent.type !== "folder") {
      throw new Error("Solo puedes crear elementos dentro de carpetas.");
    }

    const folder = new TreeNode(
      crypto.randomUUID(),
      name,
      "folder",
      ownerEmail,
      parentId,
      this.ownerUid
    );

    parent.addChild(folder);

    return folder;
  }

  addFile(parentId, name, ownerEmail) {
    const parent = this.findNode(parentId);

    if (!parent) {
      throw new Error("La carpeta padre no existe.");
    }

    if (parent.type !== "folder") {
      throw new Error("Solo puedes crear elementos dentro de carpetas.");
    }

    const file = new TreeNode(
      crypto.randomUUID(),
      name,
      "file",
      ownerEmail,
      parentId,
      this.ownerUid
    );

    parent.addChild(file);

    return file;
  }

  loadNodes(nodes) {
    this.root.children = [];

    const nodeMap = new Map();

    // Crear los nodos recuperados de Firebase.
    for (const item of nodes) {
      const node = new TreeNode(
        item.id,
        item.name,
        item.type,
        item.ownerEmail,
        item.parentId,
        item.ownerUid
      );

      nodeMap.set(node.id, node);
    }

    // Conectar cada nodo con su carpeta padre.
    for (const node of nodeMap.values()) {
      const parent =
        node.parentId === "root"
          ? this.root
          : nodeMap.get(node.parentId);

      if (!parent || parent.type !== "folder") {
        continue;
      }

      parent.addChild(node);
    }
  }

  removeNode(nodeId, currentNode = this.root) {
    const index = currentNode.children.findIndex(
      (child) => child.id === nodeId
    );

    if (index !== -1) {
      currentNode.children.splice(index, 1);
      return true;
    }

    for (const child of currentNode.children) {
      if (this.removeNode(nodeId, child)) {
        return true;
      }
    }

    return false;
  }
}
