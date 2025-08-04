import {CrashPoint} from '../models/crashPoints.js';
import { broadcastToClients } from '../server.js';

function generateCrashPoint() {
  const r = Math.random();
  if (r < 0.6) return +(Math.random() * 1 + 1).toFixed(2);
  else if (r < 0.9) return +(Math.random() * 3 + 2).toFixed(2);
  else if (r < 0.95) return +(Math.random() * 5 + 5).toFixed(2);
  else return +(Math.random() * 40 + 10).toFixed(2);
}

const MAX_CRASH_POINTS = 50;
async function saveCrashPoint(value) {
  try {
    const crash = new CrashPoint({ value });
    await crash.save();

    const count = await CrashPoint.countDocuments();
    if (count > MAX_CRASH_POINTS) {
      const toDelete = await CrashPoint.find()
        .sort({ createdAt: 1 })
        .limit(count - MAX_CRASH_POINTS);
      const ids = toDelete.map(doc => doc._id);
      await CrashPoint.deleteMany({ _id: { $in: ids } });
    }

    const updated = await CrashPoint.find().sort({ createdAt: -1 }).limit(50);
    return updated.reverse();
  } catch (err) {
    console.error('DB Error:', err);
    return [];
  }
}

export async function gameLoop() {
  const crashAt = generateCrashPoint();
  console.log('New round: crash at', crashAt);

  let multiplier = 1.0;
  broadcastToClients({ type: 'START', message: 'Round started!' });

  const interval = setInterval(async () => {
    let increment = multiplier > 30 ? 0.05 : multiplier > 10 ? 0.04 : multiplier > 5 ? 0.03 : multiplier > 3 ? 0.02 : 0.01;
    multiplier = +(multiplier + increment).toFixed(2);
    broadcastToClients({ type: 'IN_PROGRESS', multiplier });

    if (multiplier >= crashAt) {
      clearInterval(interval);
      console.log('💥 Crashed at:', multiplier);

      broadcastToClients({ type: 'CRASH', multiplier });

      const updatedHistory = await saveCrashPoint(multiplier);
      broadcastToClients({ type: 'HISTORY', history: updatedHistory });

      setTimeout(() => {
        broadcastToClients({ type: 'WAITING', message: 'Next round in 10s' });
      }, 3000);

      setTimeout(() => {
        gameLoop();
      }, 13000);
    }
  }, 100);
}
