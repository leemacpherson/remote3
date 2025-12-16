////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with React Router, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeContacts.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  return fakeContacts.get(id);
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id);
}

[
  {
    avatar: "https://helpwithapi.com/pictures/XR11.png",
    first: "XR11",
    last: "Xfinity",
    twitter: "https://helpwithapi.com/descriptions/XR11.txt",
    notes:
      "To switch your Xfinity XR11 remote and X1 system to English, press the Xfinity button, navigate to the gear icon (Settings), select Language, choose Menu Language, then highlight and select English, and confirm with OK on the screen to apply changes.",
  },
  {
    avatar: "https://helpwithapi.com/pictures/XR15.png",
    first: "XR15",
    last: "Xfinity",
    twitter: "https://helpwithapi.com/descriptions/XR15.txt",
    notes:
      'To switch your XR15 Xfinity remote to English, use the voice command by holding the mic button and saying "Change language to English," or manually go to Settings > Language (gear icon) to select "English" for menu and audio settings; this changes your entire X1 experience to English.',
  },
  {
    avatar: "https://helpwithapi.com/pictures/XRA-large-button.png",
    first: "XRA Large Button",
    last: "Xfinity",
    twitter: "https://helpwithapi.com/descriptions/XRA-large-button.txt",
    notes:
      'To switch your Xfinity XRA remote to English, press the Xfinity button, navigate to the gear icon (Settings), select Language, then Menu Language, and choose English. Alternatively, use your voice by holding the mic button and saying "Change language to English," or for audio-only, press the Menu button, find Audio Setup, and set the Default Audio Track to English. ',
  },
  {
    avatar: "https://helpwithapi.com/pictures/large-button.png",
    first: "Large Button",
    last: "Xfinity",
    twitter: "https://helpwithapi.com/descriptions/large-button.txt",
    notes:
      'To switch your Xfinity large button remote to English, press the Xfinity button, navigate to the Gear icon (Settings), select Language, then choose Menu Language and English, confirming with the OK button, or use voice by pressing the microphone and saying "Change language to English"',
  },
  {
    avatar: "https://helpwithapi.com/pictures/Silver-w-grey-OK.png",
    first: "Silver with grey OK",
    last: "Xfinity",
    twitter: "https://helpwithapi.com/descriptions/large-button.txt",
    notes:
      "Press the Xfinity button on your remote. Highlight Settings (the gear icon) and press OK.The Main Menu is displayed, with the Settings at the lower right. You can get to Audio Language (SAP) Reset from Device Settings > Audio, Language, or Accessibility Settings. \nSelect one of them. \r\n Device Settings appears second in a vertically-scrolling list of options, just under Preferences. \r\nNavigate to Audio Language (SAP) Reset. Audio Language (SAP) Reset appears second in a vertically-scrolling list of three options, just under Bluetooth Devices.\nPress OK on your remote to clear your last chosen audio language and go back to the default language setting.\nThe Audio Language Reset confirmation screen is displayed.",
  },
].forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first
      .toLowerCase()
      .split(" ")
      .join("_")}-${contact.last.toLocaleLowerCase()}`,
  });
});
