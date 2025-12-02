# Firebase Storage Adapter

Production-ready Firestore adapter for the MUI Theme Builder.

## Features

✅ **Multi-user support** - Data isolation per user  
✅ **Offline persistence** - Works without network  
✅ **Real-time sync** - Changes sync across devices  
✅ **Transactions** - Atomic multi-operation updates  
✅ **Security** - User-level data ownership checks  
✅ **Scalable** - Cloud Firestore handles millions of documents

## Installation

```bash
pnpm add firebase
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database

### 2. Get Configuration

```javascript
// firebase-config.ts
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /theme-snapshots/{snapshotId} {
      allow read, write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Usage

### Basic Setup

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FirebaseStorageAdapter } from './storage';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Wait for auth
auth.onAuthStateChanged(user => {
  if (user) {
    const adapter = new FirebaseStorageAdapter(db, user.uid);
    // Use adapter in StorageProvider
  }
});
```

### With StorageProvider

```tsx
import { StorageProvider } from './Editor/Design/storage';
import { FirebaseStorageAdapter } from './Editor/Design/storage';

function App() {
  const [adapter, setAdapter] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAdapter(new FirebaseStorageAdapter(db, user.uid));
      }
    });
    return unsubscribe;
  }, []);

  if (!adapter) return <div>Loading...</div>;

  return (
    <StorageProvider adapter={adapter}>
      <YourApp />
    </StorageProvider>
  );
}
```

### Custom Collection Path

```typescript
// Use custom collection per environment
const adapter = new FirebaseStorageAdapter(
  db,
  userId,
  process.env.NODE_ENV === 'production' 
    ? 'theme-snapshots' 
    : 'theme-snapshots-dev'
);
```

## Advanced Features

### Offline Persistence

```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db)
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.log('Browser not supported');
    }
  });
```

### Real-time Sync

```typescript
import { onSnapshot, query, where } from 'firebase/firestore';

// Listen to collection changes
const q = query(
  collection(db, 'theme-snapshots'),
  where('userId', '==', userId)
);

onSnapshot(q, snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') console.log('New: ', change.doc.data());
    if (change.type === 'modified') console.log('Modified: ', change.doc.data());
    if (change.type === 'removed') console.log('Removed: ', change.doc.data());
  });
});
```

### Backup to Cloud Storage

```typescript
import { getStorage, ref, uploadString } from 'firebase/storage';

async function backupSnapshot(snapshot: ThemeSnapshot) {
  const storage = getStorage();
  const backupRef = ref(storage, `backups/${snapshot.id}.json`);
  await uploadString(backupRef, JSON.stringify(snapshot));
}
```

## Migration from LocalStorage

```typescript
import { MockStorageAdapter } from './storage';
import { FirebaseStorageAdapter } from './storage';

async function migrateToFirebase(userId: string) {
  const localAdapter = new MockStorageAdapter();
  const firebaseAdapter = new FirebaseStorageAdapter(db, userId);

  // Get all local snapshots
  const snapshots = await localAdapter.list();

  // Upload to Firebase
  for (const meta of snapshots) {
    const snapshot = await localAdapter.get(meta.id);
    if (snapshot) {
      await firebaseAdapter.create(snapshot);
    }
  }

  console.log(`Migrated ${snapshots.length} snapshots`);
}
```

## Error Handling

```typescript
try {
  await adapter.create(snapshot);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.error('User not authenticated');
  } else if (error.code === 'unavailable') {
    console.error('Network error, will retry when online');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Performance Tips

1. **Use indexes** - Add composite indexes in Firebase Console for complex queries
2. **Batch operations** - Use `transaction()` for multiple operations
3. **Limit results** - Use pagination for large collections
4. **Cache metadata** - Store `list()` results in memory with TTL

## Cost Optimization

- **Read operations**: ~$0.06 per 100k reads
- **Write operations**: ~$0.18 per 100k writes
- **Storage**: ~$0.18 per GB/month

**Typical usage**: ~10k operations/month = **FREE** (under free tier)
