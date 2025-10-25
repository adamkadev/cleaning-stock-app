import { db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { Report } from "../models/report";

const reportsCollection = collection(db, "reports");
const locationsCollection = collection(db, "locations");

const isValidLocation = async (building: string, floor: number): Promise<boolean> => {
  const q = query(locationsCollection);
  const snapshot = await getDocs(q);
  return snapshot.docs.some(doc => doc.data().building === building && doc.data().floor === floor);
};

const saveReport = async (report: Report) => {
  await addDoc(reportsCollection, { ...report, createdAt: new Date() });
};

const sendReportEmail = async (report: Report) => {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        building: report.building,
        floor: report.floor,
        consumables: report.consumables,
      }),
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi du mail");
  } catch (err) {
    console.error("Erreur envoi mail :", err);
    throw err;
  }
};

export const addReport = async (report: Report) => {
  const valid = await isValidLocation(report.building, report.floor);
  if (!valid) throw new Error(`Bâtiment ou étage invalide: ${report.building} - ${report.floor}`);

  await saveReport(report);
  await sendReportEmail(report);
};

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

export const updateReportStatus = async (id: string, status: Report["status"]) => {
  const docRef = doc(db, "reports", id);
  await updateDoc(docRef, { status });
};
