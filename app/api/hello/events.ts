import { db } from "../../../src/services/firebase/firebaseService";
import {
  collection,
  addDoc,
  CollectionReference,
  Timestamp,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

interface CalendarEventModel {
  date: Timestamp;
  eventName: string;
  media: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const eventsCalendarCol = collection(
    db,
    "eventsCalendar"
  ) as CollectionReference<CalendarEventModel>;

  switch (req.method) {
    case "POST": {
      const { date, eventName, media } = req.body as CalendarEventModel;

      if (!date || !eventName || !media) {
        return res
          .status(400)
          .json({ message: "Missing fields to create an event" });
      }

      try {
        const docRef = await addDoc(eventsCalendarCol, {
          date,
          eventName,
          media,
        });

        return res
          .status(200)
          .json({ message: "Event created", id: docRef.id });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    }

    case "GET": {
      try {
        const eventsSnapshot = await getDocs(eventsCalendarCol);
        const events: CalendarEventModel[] = [];

        eventsSnapshot.forEach((doc) => {
          const data = doc.data() as CalendarEventModel;
          events.push({ id: doc.id, ...data } as CalendarEventModel);
        });

        return res.status(200).json(events);
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }
    // The DELETE request expects an id in the request body. It deletes the document with that id from the 'events' collection.
    case "DELETE": {
      const { eventName } = req.body; // id is the name of the file

      if (!eventName) {
        return res.status(400).json({ message: "Missing eventName" });
      }

      try {
        await deleteDoc(eventName);
        return res.status(200).json({ message: "Event deleted" });
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }

    default:
      res.setHeader("Allow", ["POST", "GET", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
