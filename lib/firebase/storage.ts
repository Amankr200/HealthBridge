import { storage } from "./firebase-config"
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"

export interface MedicalRecord {
  id: string
  fileName: string
  fileUrl: string
  uploadDate: string
  fileType: string
  userId: string
}

export async function uploadMedicalRecord(
  file: File,
  userId: string
): Promise<MedicalRecord> {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `medical-records/${userId}/${fileName}`;
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    return {
      id: uuidv4(),
      fileName: file.name,
      fileUrl: downloadUrl,
      uploadDate: new Date().toISOString(),
      fileType: file.type,
      userId,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getUserMedicalRecords(userId: string): Promise<MedicalRecord[]> {
  const listRef = ref(storage, `medical-records/${userId}`)
  const records: MedicalRecord[] = []

  try {
    const res = await listAll(listRef)
    const recordsPromises = res.items.map(async (itemRef) => {
      const downloadUrl = await getDownloadURL(itemRef)
      return {
        id: itemRef.name,
        fileName: itemRef.name,
        fileUrl: downloadUrl,
        uploadDate: new Date().toISOString(),
        fileType: 'application/pdf',
        userId
      }
    })

    return await Promise.all(recordsPromises)
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return []
  }
}

export async function deleteMedicalRecord(recordPath: string): Promise<boolean> {
  try {
    const recordRef = ref(storage, recordPath)
    await deleteObject(recordRef)
    return true
  } catch (error) {
    console.error('Error deleting medical record:', error)
    return false
  }
}