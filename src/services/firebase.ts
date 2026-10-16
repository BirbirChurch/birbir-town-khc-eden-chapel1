import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc,
  getDocs,
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  limit,
  Firestore,
  writeBatch
} from 'firebase/firestore';
import { 
  Member, 
  LeadershipMessage, 
  ChapelPlan, 
  ChapelReport,
  AnnualPlanItem,
  DailyCoordinatorLog
} from '../types/chapel';

export const firebaseConfig = {
  apiKey: "AIzaSyB9ziWa-dc59SSfESc0rEn6Le0__XdtRUE",
  authDomain: "birbir-tow-khc-eden-chapel.firebaseapp.com",
  projectId: "birbir-tow-khc-eden-chapel",
  storageBucket: "birbir-tow-khc-eden-chapel.firebasestorage.app",
  messagingSenderId: "230789602685",
  appId: "1:230789602685:web:6157de5e26b095249e4014"
};

// Safe singleton Firebase initialization
let appInstance: FirebaseApp;
let dbInstance: Firestore;

try {
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  dbInstance = getFirestore(appInstance);
} catch (e) {
  console.warn('Firebase initialization note:', e);
  appInstance = getApps()[0] || initializeApp(firebaseConfig);
  dbInstance = getFirestore(appInstance);
}

export const app = appInstance;
export const db = dbInstance;

const LOCAL_STORAGE_MESSAGES_KEY = 'eden_leadership_messages_v4';

// BroadcastChannel for instant cross-tab sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('eden_chapel_realtime_bus');
  }
} catch {
  // Ignore in unsupported environments
}

/**
 * Checks connection health to Firebase Firestore SDK
 */
export async function checkFirebaseConnection(): Promise<{ 
  connected: boolean; 
  projectId: string; 
  authDomain: string;
  latencyMs: number; 
  error?: string 
}> {
  const start = Date.now();
  try {
    const testCol = collection(db, 'eden_status_ping');
    const q = query(testCol, limit(1));
    await getDocs(q);
    return {
      connected: true,
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      latencyMs: Date.now() - start
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      latencyMs: Date.now() - start,
      error: errorMsg
    };
  }
}

/**
 * Syncs all 136 chapel members to Firebase Firestore collection `eden_members`
 */
export async function syncMembersToFirestore(members: Member[]): Promise<{ 
  success: boolean; 
  count: number; 
  message: string 
}> {
  if (!db) {
    return { success: false, count: 0, message: 'Firebase Firestore አልተጀመረም' };
  }

  try {
    let synced = 0;
    // Firestore batches allow up to 500 operations per batch
    const batchSize = 100;
    for (let i = 0; i < members.length; i += batchSize) {
      const chunk = members.slice(i, i + batchSize);
      const batch = writeBatch(db);

      chunk.forEach((member) => {
        const docRef = doc(db, 'eden_members', member.id);
        batch.set(docRef, {
          ...member,
          syncedAt: serverTimestamp()
        }, { merge: true });
        synced++;
      });

      await batch.commit();
    }

    return { 
      success: true, 
      count: synced, 
      message: `${synced} አባወራዎችና ቤተሰቦች በተሳካ ሁኔታ ወደ Firebase ክላውድ ተመሳስለዋል!` 
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Firestore sync note:', msg);
    return { 
      success: false, 
      count: 0, 
      message: `ወደ Firebase ሲመሳሰል ማስታወሻ ተፈጥሯል፦ ${msg}` 
    };
  }
}

/**
 * Loads members stored in Firestore `eden_members`
 */
export async function fetchMembersFromFirestore(): Promise<{
  success: boolean;
  members: Member[];
  message: string;
}> {
  try {
    const querySnapshot = await getDocs(collection(db, 'eden_members'));
    const loaded: Member[] = [];
    querySnapshot.forEach((docSnap) => {
      loaded.push(docSnap.data() as Member);
    });

    if (loaded.length > 0) {
      // Sort by householdNo or id
      loaded.sort((a, b) => Number(a.householdNo || 0) - Number(b.householdNo || 0));
      return {
        success: true,
        members: loaded,
        message: `${loaded.length} አባላት ከFirebase ክላውድ ተነበዋል`
      };
    }
    return { success: false, members: [], message: 'በክላውዱ ላይ የተመዘገበ አባል የለም' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, members: [], message: msg };
  }
}

/**
 * Syncs 2018 Annual Plan items to Firestore collection `eden_annual_plans`
 */
export async function syncAnnualPlansToFirestore(plans: AnnualPlanItem[]): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firestore offline' };
  try {
    const batch = writeBatch(db);
    plans.forEach(p => {
      const docRef = doc(db, 'eden_annual_plans', p.id);
      batch.set(docRef, { ...p, syncedAt: serverTimestamp() }, { merge: true });
    });
    await batch.commit();
    return { success: true, message: `${plans.length} የዕቅድ ዝርዝሮች ወደ Firebase ክላውድ ተመሳስለዋል` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg };
  }
}

/**
 * Syncs Coordinator Daily Logs to Firestore collection `eden_daily_logs`
 */
export async function syncDailyLogsToFirestore(logs: DailyCoordinatorLog[]): Promise<{ success: boolean; message: string }> {
  if (!db) return { success: false, message: 'Firestore offline' };
  try {
    const batch = writeBatch(db);
    logs.forEach(l => {
      const docRef = doc(db, 'eden_daily_logs', l.id);
      batch.set(docRef, { ...l, syncedAt: serverTimestamp() }, { merge: true });
    });
    await batch.commit();
    return { success: true, message: `${logs.length} ዕለታዊ የስራ መዝገቦች ወደ Firebase ክላውድ ተመሳስለዋል` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg };
  }
}

/**
 * Initial preloaded forum discussion seeds
 */
const INITIAL_FORUM_MESSAGES: LeadershipMessage[] = [
  {
    id: 'msg-seed-1',
    channelId: 'joint',
    senderName: 'ወንጌላዊ ገላትያ ደስታ',
    senderRole: 'የቻፕሉ አስተባባሪ',
    senderPhone: '0910000000',
    message: 'የተወደዳችሁ የኤዴን ቻፕል መሪዎች እንኳን ደህና መጣችሁ! የዚህ ወር አገልግሎታችንን፣ የቤተሰብ ጉብኝት መርሃ ግብርና ሪፖርቶች እዚህ የጋራ መድረክ ላይ እንወያይ።',
    timestamp: '09:00 ጧት · ዛሬ',
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'msg-seed-2',
    channelId: 'joint',
    senderName: 'አቶ ዳዊት ጫመቶ',
    senderRole: 'የአባቶች ሰብሳቢ',
    senderPhone: '0910926126',
    message: 'አሜን ወንጌላዊ ገላትያ። የአባቶች ጉባኤ ተወያይተን የቤት ለቤት ጉብኝት እቅዳችንን አዘጋጅተናል። በዚህ ሳምንት ተግባራዊ እናደርጋለን።',
    timestamp: '09:45 ጧት · ዛሬ',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'msg-seed-3',
    channelId: 'fathers',
    senderName: 'አቶ ዳዊት ጫመቶ',
    senderRole: 'የአባቶች ሰብሳቢ',
    senderPhone: '0910926126',
    message: 'ሰላም ለአባቶች መሪዎች ይሁን! በየመንደሩ ላሉ አባወራዎች ክትትልና አብሮነት የምናደርግበትን የጸሎት ሰዓት እንመድብ።',
    timestamp: '10:15 ጧት · ዛሬ',
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'msg-seed-4',
    channelId: 'women',
    senderName: 'ወ/ሮ ምህረት ፎላ',
    senderRole: 'የሴቶች ሰብሳቢ',
    senderPhone: '0916401398',
    message: 'እህቶች ሰላም ለእናንተ ይሁን። የሴቶች ሳምንታዊ የጾምና ጸሎት ፕሮግራም በየመንደሩ በታማኝነት እየተካሄደ ነው።',
    timestamp: '10:30 ጧት · ዛሬ',
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'msg-seed-5',
    channelId: 'youth',
    senderName: 'ሩት በረገነ',
    senderRole: 'የወጣቶች መሪ',
    senderPhone: '0912345675',
    message: 'የወጣቶች ህብረት ቅዳሜ ከሰዓት የሚደረገውን የህብረት ጊዜና የከተማ ወንጌል ስርጭት በሙሉ ዝግጅት እየጠበቅን ነው።',
    timestamp: '11:00 ጧት · ዛሬ',
    createdAt: Date.now() - 3600000 * 1
  },
  {
    id: 'msg-seed-6',
    channelId: 'discipleship',
    senderName: 'ወንጌላዊ ገላትያ ደስታ',
    senderRole: 'የቻፕሉ አስተባባሪ',
    senderPhone: '0910000000',
    message: 'በ5ቱም የኤዴን መንደሮች የመንፈሳዊ ትምህርት ቡድኖች የደቀመዝሙርነት ማስተማሪያ መጻሕፍት ተሰራጭተዋል።',
    timestamp: '11:30 ጧት · ዛሬ',
    createdAt: Date.now() - 1800000
  }
];

export function getLocalMessages(): LeadershipMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(INITIAL_FORUM_MESSAGES));
      return INITIAL_FORUM_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FORUM_MESSAGES;
  } catch {
    return INITIAL_FORUM_MESSAGES;
  }
}

export function saveLocalMessage(msg: LeadershipMessage): void {
  try {
    const msgs = getLocalMessages();
    const updated = [...msgs, msg];
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eden_message_update', { detail: { channelId: msg.channelId } }));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'NEW_MESSAGE', message: msg });
      }
    }
  } catch (e) {
    console.error('Error saving local message:', e);
  }
}

/**
 * Real-time subscription to Firebase Firestore messages with offline cache
 */
export function subscribeToChannelMessages(
  channelId: string,
  onUpdate: (messages: LeadershipMessage[]) => void
): () => void {
  const deliverLocal = () => {
    const all = getLocalMessages();
    const filtered = all
      .filter(m => m.channelId === channelId)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    onUpdate(filtered);
  };

  deliverLocal();

  const handleLocalUpdate = (e: Event) => {
    const custom = e as CustomEvent;
    if (!custom.detail || custom.detail.channelId === channelId) {
      deliverLocal();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('eden_message_update', handleLocalUpdate);
  }

  const handleBroadcast = (evt: MessageEvent) => {
    if (evt.data?.type === 'NEW_MESSAGE' && evt.data?.message?.channelId === channelId) {
      deliverLocal();
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  let firestoreUnsubscribe: (() => void) | null = null;

  if (db) {
    try {
      const messagesRef = collection(db, 'leadership_messages');
      const q = query(
        messagesRef,
        where('channelId', '==', channelId),
        orderBy('createdAt', 'asc'),
        limit(100)
      );

      firestoreUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteMsgs: LeadershipMessage[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              remoteMsgs.push({
                id: docSnap.id,
                channelId: data.channelId,
                senderName: data.senderName,
                senderRole: data.senderRole,
                senderPhone: data.senderPhone || '',
                message: data.message,
                timestamp: data.timestamp || new Date().toLocaleTimeString('am-ET', { hour: '2-digit', minute: '2-digit' }),
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
              });
            });

            const local = getLocalMessages().filter(m => m.channelId === channelId);
            const combined = [...remoteMsgs];
            local.forEach(loc => {
              if (!combined.some(r => r.id === loc.id || (r.message === loc.message && Math.abs((r.createdAt || 0) - (loc.createdAt || 0)) < 3000))) {
                combined.push(loc);
              }
            });
            combined.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
            onUpdate(combined);
          }
        },
        (_err) => {
          deliverLocal();
        }
      );
    } catch {
      // Handled gracefully
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('eden_message_update', handleLocalUpdate);
    }
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    if (firestoreUnsubscribe) {
      try {
        firestoreUnsubscribe();
      } catch {
        // ignore
      }
    }
  };
}

/**
 * Send a message to Firebase Firestore and local bus simultaneously
 */
export async function sendChannelMessage(
  channelId: string,
  senderName: string,
  senderRole: string,
  message: string,
  senderPhone?: string
): Promise<LeadershipMessage> {
  const newMsg: LeadershipMessage = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    channelId,
    senderName,
    senderRole,
    senderPhone: senderPhone || '',
    message,
    timestamp: new Date().toLocaleTimeString('am-ET', { hour: '2-digit', minute: '2-digit' }) + ' · ዛሬ',
    createdAt: Date.now()
  };

  saveLocalMessage(newMsg);

  if (db) {
    addDoc(collection(db, 'leadership_messages'), {
      channelId,
      senderName,
      senderRole,
      senderPhone: senderPhone || '',
      message,
      timestamp: newMsg.timestamp,
      createdAt: serverTimestamp()
    }).catch((e) => {
      console.warn('Firestore message write note:', e);
    });
  }

  return newMsg;
}
