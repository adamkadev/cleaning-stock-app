import { db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Report } from "../models/report";

const reportsCollection = collection(db, "reports");

// Add a new report
export const addReport = async (report: Report) => {
  await addDoc(reportsCollection, { ...report, createdAt: new Date() });
};

// Listen to all reports in real-time
export const subscribeReports = (callback: (reports: Report[]) => void): (() => void) => {
  const q = query(reportsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, snapshot => {
    const data: Report[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Report),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    callback(data);
  });
};

// Update report status
export const updateReportStatus = async (id: string, status: Report["status"]) => {
  const docRef = doc(db, "reports", id);
  await updateDoc(docRef, { status });
};
