
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

import app from "../firebase/config";

const db = getFirestore(app);
const filesCollection = collection(db, "files");

// Guardar un archivo o una carpeta.
export async function saveNode(node) {
  const document = {
    name: node.name,
    type: node.type,
    parentId: node.parentId,
    ownerEmail: node.ownerEmail,
    ownerUid: node.ownerUid,
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, "files", node.id), document);

  return node.id;
}

// Consultar los elementos de un usuario.
export async function getUserNodes(ownerUid) {
  const nodeQuery = query(
    filesCollection,
    where("ownerUid", "==", ownerUid)
  );

  const snapshot = await getDocs(nodeQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

// Eliminar un documento de Firebase.
export async function deleteSavedNode(nodeId) {
  await deleteDoc(doc(db, "files", nodeId));
}
