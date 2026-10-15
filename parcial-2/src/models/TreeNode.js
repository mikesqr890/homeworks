
export class TreeNode {
  constructor(
    id,
    name,
    type,
    ownerEmail,
    parentId = null,
    ownerUid = null
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.ownerEmail = ownerEmail;
    this.parentId = parentId;
    this.ownerUid = ownerUid;
    this.children = [];
  }

  addChild(node) {
    if (this.type === "file") {
      throw new Error("Un archivo no puede tener hijos.");
    }

    this.children.push(node);
  }

  removeChild(nodeId) {
    this.children = this.children.filter(
      (child) => child.id !== nodeId
    );
  }
}
